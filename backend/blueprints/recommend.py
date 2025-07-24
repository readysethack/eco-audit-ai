import datetime
from time import timezone
from uuid import UUID
from flask_smorest import Blueprint

bl = Blueprint("recommend", "recommend", url_prefix="/todo", description="RECOMMEND API")

tastes = [
    {
        "id": UUID("bcaec2b4-1af7-468c-b475-5c437ccde903"),
        "created": datetime.now(timezone.utc),
        "taste": {

        },
    }
]