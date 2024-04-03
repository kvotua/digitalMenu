from fastapi import HTTPException, status

from app.database import users_collection
from app.schemas import JWToken, UserId
from app.utils import id_to_jwt

from .schemas import User


def create_user() -> JWToken:
    user = User()
    users_collection.insert_one(user.model_dump())
    return id_to_jwt(user.id)


def get_info(user_id: UserId) -> User:
    result = users_collection.find_one({"id": user_id})
    if result is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return User(**result)
