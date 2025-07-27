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
    url = f"{QlooData.api_url}/search?query={parse.quote(query)}&page={page_index}"
    try:
        response = requests.get(url, headers=QlooData.headers, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return
    
    data = response.json()["results"]

    for entity in data:
        if entity['types'][0] == 'urn:entity:destination':
            return entity['entity_id']


def get_entity_affinities(entity_id:str, filters:dict[str]):
    url = f"{QlooData.api_url}/v2/insights?filter.type={filters["type"]}&filter.location={entity_id}&filter.tag.types={"urn:tag:sustainability_initiative:qloo"}"
    try:
        response = requests.get(url, headers=QlooData.headers, timeout=10)
    except requests.exceptions.RequestException as e:
        print(f"Qloo API failed: {e}")
        return
    
    data = response.json()
    return data["results"]['tags']

        
def generate_summary():
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="" #TODO
    )
    return response.text
