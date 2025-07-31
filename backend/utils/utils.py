import requests, os
from google import genai
from urllib import parse
from enum import Enum
from dotenv import load_dotenv
from urllib import parse
from pydantic import BaseModel
load_dotenv()

# QLOO_API_URL = "https://hackathon.api.qloo.com/"
# Insights -> "/v2/insights"
# Search -> "/search?query="


class QlooData(Enum):
    api_url = "https://hackathon.api.qloo.com"
    headers = {
        "accept": "application/json",
        "X-Api-Key": os.getenv("QLOO_API_KEY")
    }

def get_sustainability_tags(page_index = 1):
    index = page_index
    url = f"{QlooData.api_url.value}/v2/insights?filter.type={"urn:tag"}&filter.tag.types={parse.quote("urn:tag:sustainability_initiative:qloo,urn:tag:dietary_option:qloo")}&take=50&page={page_index}"
    try:
        response = requests.get(url, headers=QlooData.headers.value, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return
    data = response.json()['results']['tags']

    output = [tag["name"] for tag in data]
    
    if len(data) >= 50:
        index += 1
        output.extend(get_sustainability_tags(index))

    return output

def get_similar_entity_affinities(query:str, filters:dict[str]):
    url = f"{QlooData.api_url.value}/v2/insights?filter.type={filters["type"]}&filter.location.query={query}&signal.interests.tags={"urn:tag:sustainability_initiative:qloo"}&take=10"
    try:
        response = requests.get(url, headers=QlooData.headers.value, timeout=10)
        print(f"status code -> {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return
    
    data = response.json()['results']['entities']
    output = []

    for entity in data:
        cleaned_data = {}
        cleaned_data["name"] = entity["name"]
        cleaned_data["keywords"] = [keyword["name"] for keyword in entity["properties"]["keywords"]]
        cleaned_data["tags"] = [{tag["name"] : tag.get("weight", 0.01)} for tag in entity["tags"]]
        cleaned_data["affinity"] = entity["query"]["affinity"]
        cleaned_data["popularity"] = entity["popularity"]
        output.append(cleaned_data)

    return output

def calculate_sustainability_score(business_data):
    base_tags = get_sustainability_tags()

    scores = [60] # Buffer
    for business in business_data:
        # Tag Match
        tag_score  = 0
        total_tag_score = 0
        for tag in business["tags"]:
            for name, weight in tag.items():
                if name in base_tags:
                    tag_score += weight
                total_tag_score += weight
        tag_score = (tag_score/total_tag_score) * 25

        # Affinity Match
        affinity_score = business["affinity"] * 25

        # Popularity Match
        popularity_score = business["popularity"] * 25

        # Keyword Match
        keyword_score = 0
        keywords = business["keywords"]
        for keyword in keywords:
            if keyword in base_tags:
                keyword_score += 1
        keyword_score = (keyword_score/len(keywords)) * 25
    scores.append(tag_score + affinity_score + popularity_score + keyword_score)
    
    return round(sum(scores)/len(scores))

class Summary(BaseModel): # Response Schema
    business_name : str
    sustainability_score : float
    strengths : list[str]
    improvements : list[str]
    tip : str

def generate_summary(title, location, products):
    similar_business_data = get_similar_entity_affinities(location, {
        "type" : "urn:entity:place",
    })
    sustainability_score = calculate_sustainability_score(business_data=similar_business_data)
    prompt = f"""
        You are an expert sustainability analyst. Your task is to generate a concise, data-driven sustainability audit based *only* on the provided Qloo insight data.

        **Primary Goal:** Analyze the provided `Insight Data` for a business and compare it against the `Sustainability data (tags)` to identify strengths, weaknesses, and actionable advice.

        **STRICT RULES:**
        1.  **No External Knowledge:** Use ONLY the data provided in this prompt. Do not use any information you were trained on about sustainability in general.
        2.  **Data-Driven Only:** Every statement in the output (strengths, improvements, tip) MUST be directly traceable to a piece of data in the input.
        3.  **Adhere to Schema:** The final output MUST be a valid JSON object matching the `EXPECTED OUTPUT` schema.
        4.  **Handle Missing Data:** If a conclusion cannot be drawn from the data for a specific field, state "Insufficient data to determine." Do not invent information.

        ---
        **INPUT DATA**

        *   **business_type:** {title}
        *   **location:** {location}
        *   **offerings:** {products}
        *   **Sustainability Score:** {sustainability_score}
        *   **Sustainability data (tags):** {get_sustainability_tags()}
        *   **Insight Data from businesses in the region:** {similar_business_data}

        ---
        **REASONING FRAMEWORK (How to generate the audit):**

        1.  **To determine `strengths`:**
            *   Look for businesses in the `Insight Data` with high `affinity` or `popularity` scores.
            *   Identify the `tags` or `keywords` associated with these successful businesses that are also present in the `Sustainability data (tags)`.
            *   These represent existing, successful sustainability practices in the area. List the top 3 as strengths.

        2.  **To determine `improvements`:**
            *   Look for `tags` from the `Sustainability data (tags)` that are RARE or ABSENT in the `Insight Data` from the region.
            *   These represent untapped opportunities for improvement. List the top 2.

        3.  **To determine the `tip`:**
            *   Select the most impactful "improvement" you identified.
            *   Frame it as a single, actionable tip for the business. For example, if "renewable energy" is a missing tag, the tip could be "Consider installing solar panels to align with growing consumer interest in renewable energy."

        ---
        **EXPECTED OUTPUT (JSON Schema)**
        {{
            "business_name": "{title} at {location}",
            "sustainability_score": {sustainability_score},
            "strengths": [
                "A data-driven strength based on the reasoning framework.",
                "A second data-driven strength.",
                "A third data-driven strength."
            ],
            "improvements": [
                "A data-driven improvement opportunity.",
                "A second data-driven improvement opportunity."
            ],
            "tip": "A single, actionable tip derived from the improvements."
        }}

        ---
        Now, begin your analysis.
        """
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": Summary,
        },
    )
    return response.model_dump()['parsed']