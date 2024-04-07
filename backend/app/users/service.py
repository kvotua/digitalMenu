from fastapi import HTTPException, status

from app.schemas import JWToken, UserId
from app.users.models import UserModel as UserModel

from .schemas import User
from .utils import id_to_jwt


def create_user() -> JWToken:
    user = User()
    UserModel(id=user.id, username=user.username).save()
    return id_to_jwt(user.id)


def get_info(id: UserId) -> User:
    try:
        model = UserModel.get(id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return model.to_schema()
