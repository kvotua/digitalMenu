from typing import Annotated

import jwt
from fastapi import Depends, Header, HTTPException, status

from app.config import JWT_SECRET
from app.schemas import JWToken, UserId
from app.users.models import UserModel


def jwt_to_id(token: Annotated[JWToken, Header()]) -> UserId:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])["id"]
    except jwt.exceptions.PyJWTError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"JWT: {str(exc)}")


def check_admin(user_id: Annotated[UserId, Depends(jwt_to_id)]) -> None:
    try:
        model = UserModel.get(user_id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong user ID in JWT")
    if model.username != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only admin")
