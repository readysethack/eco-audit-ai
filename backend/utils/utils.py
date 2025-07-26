import requests

from google import genai
from urllib import parse
from enum import Enum



QLOO_API_URL = "https://hackathon.api.qloo.com/v2"

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

def generate_summary():
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="" #TODO
    )
    return response.text



def generate_recommendation(config, query):
    url = parse.quote(f"{QLOO_API_URL}/insights?filter.type={query}")

    headers = {
        "accept": "application/json",
        "X-Api-Key": config
        }

    response = requests.get(url, headers=headers)

    return response.text