from typing import Annotated

from fastapi import APIRouter, Body, Depends

from app.schemas import JWToken, UserId
from app.users.schemas import User
from app.users.service import assign, create_user, get_info, login, update_password
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
