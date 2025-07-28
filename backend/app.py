from flask import Flask
from flask_smorest import Api, Blueprint
from datetime import datetime, timezone
from uuid import UUID
from flask.views import MethodView
import os
from dotenv import load_dotenv
from marshmallow import Schema, fields
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

bl = Blueprint("audit", "audit", url_prefix="/audit", description="AUDIT API")

queries = [
    {
        "id": UUID("bcaec2b4-1af7-468c-b475-5c437ccde903"),
        "created": datetime.now(timezone.utc),
        "query": {
            "business_type" : "independent vegan café",
            "location" : "brussels",
            "offerings" :  ["oat milk", "handmade ceramics", "locally roasted beans"],
        },
    }
]

class CreateQuery(Schema):
    query = fields.Dict(keys=fields.Str(), values=fields.Str())
user_schema = CreateQuery()
@bl.route("/list")
class AuditCollection(MethodView):

    # @bl.arguments()
    @bl.response(status_code=200)
    def get():
        pass

    @bl.response(status_code=201)
    def post():
        pass
    

api.register_blueprint(bl)