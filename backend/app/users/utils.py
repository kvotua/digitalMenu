import jwt

from app.config import JWT_SECRET
from app.schemas import JWToken, UserId


def id_to_jwt(id: UserId) -> JWToken:
    return JWToken(jwt.encode({"id": id}, JWT_SECRET, algorithm="HS256"))
