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
        You are a sustainability consultant and cultural trend analyst. 
        Using insight data from Qloo, generate an insightful and localized 1-page sustainability audit tailored to small businesses.

        INPUT
            business_type: {title}
            location: {location}
            oferings: {products}

        Sustainability data (tags): {get_sustainability_tags()}
        Insight Data from businesses in the region: {similar_business_data}
        Sustainability Score: {sustainability_score}

        EXAMPLE INSIGHT DATA
            {{ name : Brandoa, keywords : ['rodizio', 'friday'], tags : [{{'Lunch': 0.6875}},{{'Lot': 0.3456}}], affinity : 0.23, popularity : 0.40}}

        Insight data is primarily used to check against the sustainability data to check if it there is cross-domain data.
        Understanding Insight Data
            
            Affinity: Affinity scores show how strongly a demographic group / entity aligns with your input (e.g., an artist or brand). Scores are returned as decimals, where:

            0.24 = 24% more likely than average to like it
            -0.40 = 40% less likely than average
            Values near 0 = average alignment

            Positive scores mean stronger-than-average interest,
            negative scores mean weaker-than-average interest.

            Tags: These influence affinity scores when paired with their corresponding weights. A weight property will indicate the strength of influence for each tag in your list. Weights must be greater than 0 and are relative. So, a weight of 20 means that tag will more heavily influence affinity scores than a weight of 7.
            Structure of a tag: {{name : weight}}

            Popularity: Popularity scores rank entities within their category, indicating their relative signal strength.

            Keywords: These are random words associated with the business, arranged in descending order for importance. That is, most important first, all the way to least.

        EXPECTED OUTPUT
            Name : Name of business and location
            Score : provided metric
            Strengths : Top 3 sustainability strengths
            Improvements : 2 improvement opportunities
            Tip : Industry-specific eco-tip

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

print(generate_summary(
    "lisbon",
    "vegan cafe",
    ["coffee", "leather", "decaf"]
))