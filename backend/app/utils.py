from typing import Annotated

import jwt
from fastapi import Header, HTTPException, status

from app.config import JWT_SECRET
from app.schemas import JWToken, UserId


def jwt_to_id(token: Annotated[JWToken, Header()]) -> UserId:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])["id"]
    except jwt.exceptions.PyJWTError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"JWT: {str(exc)}")
