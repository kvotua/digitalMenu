from typing import Optional

import bcrypt
from fastapi import HTTPException, status

from app.schemas import JWToken, UserId
from app.users.models import UserModel as UserModel

from .schemas import User
from .utils import id_to_jwt


def create_user() -> JWToken:
    user = User()
    UserModel(id=user.id, cart={}).save()
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
    if model.username is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "Account already assigned")
    if len(list(UserModel.scan(UserModel.username == username))) != 0:
        raise HTTPException(status.HTTP_409_CONFLICT, "Username already taken")
    model.username = username
    model.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    model.save()
    return id_to_jwt(user_id)


def login(username: str, password: str) -> JWToken:
    models = list(UserModel.scan(UserModel.username == username))
    if len(models) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong username")
    user = models[0].to_schema()
    if user.password is None:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "User with username doesn't have password",
        )
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


def update_info(
    user_id: UserId,
    name: Optional[str] = None,
    surname: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
) -> None:
    if all(map(lambda x: x is None, (name, surname, email, phone))):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Any of changes required")
    try:
        model = UserModel.get(user_id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong user ID")
    if name is not None:
        model.name = name
    if surname is not None:
        model.surname = surname
    if email is not None:
        model.email = email
    if phone is not None:
        model.phone = phone
    model.save()
