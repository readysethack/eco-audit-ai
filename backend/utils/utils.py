import requests, os
from google import genai
from urllib import parse
from enum import Enum
from dotenv import load_dotenv
from urllib import parse
load_dotenv()

# QLOO_API_URL = "https://hackathon.api.qloo.com/"
# Insights -> "/v2/insights"
# Search -> "/search?query="

class EntityType(Enum):
    artist = "urn:entity:artist"
    brand = "urn:entity:brand"
    book = "urn:entity:book"
    destination = "urn:entity:destination"
    movie = "urn:entity:movie"
    person = "urn:entity:person"
    place = "urn:entity:place"
    podcast = "urn:entity:podcast"
    tv_show = "urn:entity:tv_show"
    video_game = "urn:entity:video_game"

class QlooData(Enum):
    api_url = "https://hackathon.api.qloo.com"
    headers = {
        "accept": "application/json",
        "X-Api-Key": os.getenv("QLOO_API_KEY")
    }

def entity_search(query:str, page_index=1):
    url = f"{QlooData.api_url.value}/search?query={parse.quote(query)}&page={page_index}"
    try:
        response = requests.get(url, headers=QlooData.headers.value, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return
    
    data = response.json()["results"]

    for entity in data:
        if entity['types'][0] == 'urn:entity:destination':
            return entity['entity_id']

def get_sustainability_tags(page_index = 1):
    index = page_index
    url = f"{QlooData.api_url.value}/v2/insights?filter.type={"urn:tag"}&filter.tag.types={parse.quote("urn:tag:sustainability_initiative:qloo,urn:tag:dietary_option:qloo")}&take=50&page={page_index}"
    try:
        response = requests.get(url, headers=QlooData.headers.value, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return
    data = response.json()['results']['tags']

    output = []
    for tag in data:
        cleaned_data = {}
        cleaned_data["name"] = tag["name"]
        cleaned_data["type"] = tag["subtype"].split(":")[2]
        output.append(cleaned_data)
    
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
        cleaned_data["description"] = entity["properties"]["short_description"]
        cleaned_data["tags"] = [tag["name"] for tag in entity["tags"]]
        cleaned_data["affinity"] = entity["query"]["affinity"]
        output.append(cleaned_data)

    return output

# get_similar_entity_affinities(
#     "lisbon",
# {
#     "type" : "urn:entity:place",
# })

location = "lisbon"
similar_business_data = get_similar_entity_affinities(location, {
    "type" : "urn:entity:place",
})
prompt = f"""
You are a sustainability consultant and cultural trend analyst. Using taste data from Qloo and regional climate data, generate an insightful and localized 1-page sustainability audit tailored to small businesses.

Sustainability keywords: {get_sustainability_tags()}
Insight data from businesses in the region: {similar_business_data}

"""
def generate_summary():
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text
