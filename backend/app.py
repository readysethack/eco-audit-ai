from enum import Enum
import json
from flask import Flask
from flask_smorest import Api, Blueprint
from flask_cors import CORS
from datetime import datetime, timezone
from uuid import uuid4, UUID
from flask.views import MethodView
import os
from dotenv import load_dotenv
from marshmallow import Schema, fields

from utils.utils import generate_summary
load_dotenv()

server = Flask(__name__)
CORS(server)

# Add a health check endpoint
@server.route('/health')
def health_check():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

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

audits = []

class CreateAudit(Schema): # Response Schema
    business_name = fields.Str(required=True)
    sustainability_score = fields.Float(required=True)
    strengths = fields.List(fields.Str(), required=True)
    improvements = fields.List(fields.Str(), required=True)
    tip = fields.Str(required=True)

class Audit(CreateAudit):
    id = fields.UUID(required=True)
    created = fields.DateTime()

class CreateAssessment(Schema):
    business_type = fields.Str(required=True)
    location = fields.Str(required=True)
    products = fields.List(fields.Str(), required=True)


class ListAudits(Schema):
    audits = fields.List(fields.Nested(Audit))


class SortByEnum(Enum):
    business_name = "business_name"
    created = "created"
    sustainability_score = "sustainability_score"

class SortDirectionEnum(Enum):
    asc = "asc"
    desc = "desc"

class ListAuditParameters(Schema):
    order_by=fields.Enum(SortByEnum, load_default=SortByEnum.created)
    order=fields.Enum(SortDirectionEnum, load_default=SortDirectionEnum.asc)


@bl.route("/list")
class AuditCollection(MethodView):

    @bl.arguments(ListAuditParameters, location="query")
    @bl.response(status_code=200, schema=ListAudits)
    def get(self, parameters):
        try:
            return {
                "audits" : sorted(
                    audits,
                    key= lambda data : data[parameters["order_by"].value],
                    reverse= parameters["order"] == SortDirectionEnum.desc
                )
            }
        except Exception as e:
            server.logger.error(f"Error in audit list endpoint: {str(e)}")
            return {"error": "Internal server error"}, 500

    @bl.arguments(CreateAssessment)
    @bl.response(status_code=201, schema=Audit)
    def post(self, data):
        try:
            server.logger.info(f"Received audit request: {data}")
            summary = generate_summary(
                title=data["business_type"],
                location=data["location"],
                products=data["products"]
            )
            new_audit = {
                "id": uuid4(),
                "created": datetime.now(timezone.utc),
                "business_name": summary["business_name"],
                "sustainability_score": summary["sustainability_score"],
                "strengths": summary["strengths"],
                "improvements": summary["improvements"],
                "tip": summary["tip"]
            }

            audits.append(new_audit)
            return new_audit
        except Exception as e:
            server.logger.error(f"Error in audit creation: {str(e)}")
            return {"error": "Internal server error"}, 500


@bl.route("/<uuid:audit_id>")
class GenerateAudit(MethodView):

    @bl.response(status_code=200)
    def get(self, audit_id):
        for audit in audits:
            if audit_id == audit["id"]:
                return audit
        return {"error": f"Audit with id {audit_id} not found"}

api.register_blueprint(bl)