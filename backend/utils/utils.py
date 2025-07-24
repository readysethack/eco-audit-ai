import requests
from flask import current_app
from google import genai


QLOO_API_URL = "https://hackathon.api.qloo.com/v2"


def generate_summary():
    client = genai.Client()
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="" #TODO
    )

    return response.text

def generate_recommendation():
    url = f"{QLOO_API_URL}/insights?filter.type=ur"

    headers = {
        "accept": "application/json",
        "X-Api-Key": current_app.config['QLOO_API_KEY']
        }

    response = requests.get(url, headers=headers)

    return response.text