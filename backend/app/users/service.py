import bcrypt
from fastapi import HTTPException, status

from app.schemas import JWToken, UserId
from app.users.models import UserModel as UserModel

from .schemas import User
from .utils import id_to_jwt


def create_user() -> JWToken:
    user = User()
    UserModel(id=user.id, username=user.username, password=user.password).save()
    return id_to_jwt(user.id)


def get_info(id: UserId) -> User:
    try:
        model = UserModel.get(id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return model.to_schema()


def assign(user_id: UserId, username: str, password: str):
    try:
        model = UserModel.get(user_id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong user ID")
    if len(model.username) != 0:
        raise HTTPException(status.HTTP_409_CONFLICT, "Account already assigned")
    if len(list(UserModel.scan(UserModel.username == username))) != 0:
        raise HTTPException(status.HTTP_409_CONFLICT, "Username already taken")
    model.username = username
    model.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    model.save()


def login(username: str, password: str) -> JWToken:
    models = list(UserModel.scan(UserModel.username == username))
    if len(models) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong username")
    user = models[0].to_schema()
    if not bcrypt.checkpw(password.encode(), user.password.encode()):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong password")
    return id_to_jwt(user.id)


def update_password(user_id: UserId, password: str) -> None:
    try:
        model = UserModel.get(user_id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong user ID")
    model.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    model.save()
