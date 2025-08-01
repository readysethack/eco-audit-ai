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
    url = f"{QlooData.api_url.value}/v2/insights?filter.type=urn:tag&filter.tag.types={parse.quote('urn:tag:sustainability_initiative:qloo,urn:tag:dietary_option:qloo')}&take=50&page={page_index}"
    try:
        response = requests.get(url, headers=QlooData.headers.value, timeout=20)  # Increased timeout to 20 seconds
        # Check if the response was successful
        if response.status_code != 200:
            print(f"API returned non-200 status code: {response.status_code}")
            return []
            
        # Safely parse JSON
        json_response = response.json()
        if 'results' not in json_response or 'tags' not in json_response['results']:
            print(f"API response missing expected fields: {json_response}")
            return []
            
        data = json_response['results']['tags']

        output = [tag.get("name", "") for tag in data]
        
        if len(data) >= 50:
            index += 1
            next_tags = get_sustainability_tags(index)
            if next_tags:
                output.extend(next_tags)

        return output
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error in get_sustainability_tags: {e}")
        return []

def get_similar_entity_affinities(query:str, filters:dict[str]):
    url = f"{QlooData.api_url.value}/v2/insights?filter.type={filters['type']}&filter.location.query={query}&signal.interests.tags=urn:tag:sustainability_initiative:qloo&take=10"
    try:
        response = requests.get(url, headers=QlooData.headers.value, timeout=20)  # Increased timeout to 20 seconds
        print(f"status code -> {response.status_code}")
        
        # Check if the response was successful
        if response.status_code != 200:
            print(f"API returned non-200 status code: {response.status_code}")
            return []
            
        # Safely parse JSON
        json_response = response.json()
        if 'results' not in json_response or 'entities' not in json_response['results']:
            print(f"API response missing expected fields: {json_response}")
            return []
            
        data = json_response['results']['entities']
        output = []

        for entity in data:
            try:
                cleaned_data = {}
                cleaned_data["name"] = entity.get("name", "Unknown")
                
                # Safely get nested properties
                properties = entity.get("properties", {})
                keywords = properties.get("keywords", [])
                cleaned_data["keywords"] = [keyword.get("name", "") for keyword in keywords]
                
                cleaned_data["tags"] = [{tag.get("name", "") : tag.get("weight", 0.01)} for tag in entity.get("tags", [])]
                
                # Safely get nested query
                query_data = entity.get("query", {})
                cleaned_data["affinity"] = query_data.get("affinity", 0.0)
                cleaned_data["popularity"] = entity.get("popularity", 0.0)
                
                output.append(cleaned_data)
            except Exception as e:
                print(f"Error processing entity: {e}")
                continue
                
        return output
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error in get_similar_entity_affinities: {e}")
        return []

def calculate_sustainability_score(business_data, base_tags=None):
    if base_tags is None:
        base_tags = get_sustainability_tags()
    
    # Return a default score if no business data is available
    if not business_data:
        return 50  # Default middle score when no data
        
    scores = [60]  # Buffer
    for business in business_data:
        try:
            # Tag Match
            tag_score = 0
            total_tag_score = 0
            for tag in business.get("tags", []):
                for name, weight in tag.items():
                    if name in base_tags:
                        tag_score += weight
                    total_tag_score += weight
            
            # Avoid division by zero
            if total_tag_score > 0:
                tag_score = (tag_score/total_tag_score) * 25
            else:
                tag_score = 0

            # Affinity Match
            affinity_score = business.get("affinity", 0) * 25

            # Popularity Match
            popularity_score = business.get("popularity", 0) * 25

            # Keyword Match
            keyword_score = 0
            keywords = business.get("keywords", [])
            if keywords:  # Only process if keywords exist
                for keyword in keywords:
                    if keyword in base_tags:
                        keyword_score += 1
                keyword_score = (keyword_score/len(keywords)) * 25
            
            scores.append(tag_score + affinity_score + popularity_score + keyword_score)
        except Exception as e:
            print(f"Error calculating score for business: {e}")
            continue
    
    # If we couldn't calculate any scores, return a default
    if len(scores) <= 1:
        return 50
        
    return round(sum(scores)/len(scores))

class Summary(BaseModel): # Response Schema
    business_name : str
    sustainability_score : float
    strengths : list[str]
    improvements : list[str]
    tip : str

def generate_summary(title, location, products):
    try:
        # Start by fetching sustainability tags to prevent multiple fetches
        sustainability_tags = get_sustainability_tags()
        
        similar_business_data = get_similar_entity_affinities(location, {
            "type": "urn:entity:place",
        })
        
        # Calculate score using the cached tags
        sustainability_score = calculate_sustainability_score(business_data=similar_business_data, base_tags=sustainability_tags)
        
        # If we couldn't get data, return a basic response
        if not similar_business_data:
            return Summary(
                business_name=f"{title} at {location}",
                sustainability_score=50,
                strengths=["Insufficient data to determine strengths."],
                improvements=["Insufficient data to determine improvement areas."],
                tip="Try a different location or business type for more specific recommendations."
            )
            
        prompt = f"""
            You are an expert sustainability consultant for small businesses. Your task is to generate a concise, practical sustainability audit tailored specifically for a {title} in {location}, based *only* on the provided Qloo insight data.

            **Primary Goal:** Analyze the provided `Insight Data` for similar businesses in the region and compare it against the `Sustainability data (tags)` to identify strengths, weaknesses, and actionable advice that is realistic for a small {title} to implement.

            **STRICT RULES:**
            1.  **Blend Knowledge Sources:** While primarily using the data provided in this prompt, you may incorporate your general knowledge about sustainability best practices specific to a {title} when necessary to provide more valuable insights.
            2.  **Data-Driven Foundation:** The core of your analysis should be based on the input data, with external knowledge serving to enhance and contextualize recommendations.
            3.  **Adhere to Schema:** The final output MUST be a valid JSON object matching the `EXPECTED OUTPUT` schema.
            4.  **Handle Missing Data:** If input data is insufficient, use your knowledge of sustainability practices for similar business types to provide relevant recommendations.
            5.  **Small Business Focus:** All recommendations must be practical and cost-effective for a small {title} to implement. Consider the specific challenges and opportunities unique to this business type.
            6.  **Local Context:** Ensure all insights are relevant to the {location} market and incorporate local cultural preferences.

            ---
            **INPUT DATA**

            *   **business_type:** {title}
            *   **location:** {location}
            *   **offerings:** {products}
            *   **Sustainability Score:** {sustainability_score}
            *   **Sustainability data (tags):** {sustainability_tags}
            *   **Insight Data from businesses in the region:** {similar_business_data}

            ---
            **REASONING FRAMEWORK (How to generate the audit):**

            1.  **To determine `strengths`:**
                *   Look for businesses in the `Insight Data` with high `affinity` or `popularity` scores.
                *   Identify the `tags` or `keywords` associated with these successful businesses that are also present in the `Sustainability data (tags)`.
                *   Relate these strengths specifically to the business type ({title}) and explain why they're particularly valuable for this type of small business.
                *   Consider the specific business offerings ({products}) when highlighting strengths.

            2.  **To determine `improvements`:**
                *   Look for `tags` from the `Sustainability data (tags)` that are RARE or ABSENT in the `Insight Data` from the region.
                *   Add your knowledge of industry-specific sustainability practices for a {title}.
                *   Focus on cost-effective improvements with meaningful impact for small businesses.
                *   Consider implementation complexity and prioritize quick wins that small business owners can realistically implement.

            3.  **To determine the `tip`:**
                *   Select the most impactful and practical "improvement" for a small {title}.
                *   Frame it as a specific, actionable tip that includes implementation guidance.
                *   Consider local resources in {location} that could help with implementation.
                *   Explain the business benefit (customer appeal, cost savings, etc.) to motivate action.

            ---
            **EXPECTED OUTPUT (JSON Schema)**
            {{
                "business_name": "{title} at {location}",
                "sustainability_score": average between your prediction of the score and {sustainability_score},
                "strengths": [
                    "A specific strength tailored to this {title} with clear business benefits.",
                    "A second strength that relates directly to the business offerings ({products}).",
                    "A third strength relevant to the {location} market context."
                ],
                "improvements": [
                    "A practical, cost-effective improvement opportunity for a small {title}.",
                    "A second realistic improvement with implementation guidance for a small business owner."
                ],
                "tip": "A specific, actionable tip with clear implementation steps and business benefits for a {title} in {location}."
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
    except Exception as e:
        print(f"Error generating summary: {e}")
        # Return a fallback summary if an error occurs
        return Summary(
            business_name=f"{title} at {location}",
            sustainability_score=50,
            strengths=["An error occurred while analyzing sustainability data."],
            improvements=["Please try again with a different location or business type."],
            tip="If the issue persists, contact support with the location and business details you provided."
        )