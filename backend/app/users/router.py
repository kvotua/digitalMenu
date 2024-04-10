from typing import Annotated, Optional

from fastapi import APIRouter, Body, Depends
from pydantic import EmailStr
from pydantic_extra_types.phone_numbers import PhoneNumber

from app.schemas import JWToken, UserId
from app.users.schemas import User
from app.users.service import (
    assign,
    create_user,
    get_info,
    login,
    update_info,
    update_password,
)
from app.utils import jwt_to_id

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    description="Get info about current user by JWT",
)
async def get_me(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
) -> User:
    return get_info(user_id)


@router.post(
    "/",
    description="Creates new user and returns JWT",
)
async def post_user() -> JWToken:
    return create_user()


@router.post(
    "/assign",
    description="Assign username and password to user",
)
async def assign_user(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    username: Annotated[str, Body(min_length=1)],
    password: Annotated[str, Body(min_length=1)],
) -> JWToken:
    return assign(user_id, username, password)


@router.post(
    "/login",
    description="Get JWT by username and password",
)
async def sign_in(
    username: Annotated[str, Body(min_length=1)],
    password: Annotated[str, Body(min_length=1)],
) -> JWToken:
    return login(username, password)


@router.put(
    "/password",
    description="Change password by JWT",
)
async def change_password(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    new_password: Annotated[str, Body(min_length=1)],
) -> None:
    update_password(user_id, new_password)


@router.patch(
    "/credentials",
    description="Set name, surname, email or/and phone",
)
async def put_credentials(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    name: Annotated[Optional[str], Body(min_length=1)] = None,
    surname: Annotated[Optional[str], Body(min_length=1)] = None,
    email: Annotated[Optional[EmailStr], Body()] = None,
    phone: Annotated[Optional[PhoneNumber], Body()] = None,
) -> None:
    update_info(user_id, name, surname, email, phone)
