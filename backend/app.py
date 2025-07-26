from flask import Flask
from flask_smorest import Api
from blueprints.recommend import bl
import os
from dotenv import load_dotenv
load_dotenv()

server = Flask(__name__)

class APIConfig:
    API_TITLE = "eco-audit-api" 
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.1.0"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    QLOO_API_KEY = os.getenv("QLOO_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

server.config.from_object(APIConfig)

api = Api(server)

api.register_blueprint(bl)