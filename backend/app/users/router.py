from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas import JWToken, UserId
from app.utils import jwt_to_id

from .schemas import User
from .service import create_user, get_info

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", description="Creates new user and returns JWT")
async def post_user() -> JWToken:
    return create_user()


@router.get("/me", description="Get info about current user by JWT")
async def get_me(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
) -> User:
    return get_info(user_id)
