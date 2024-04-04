import uuid

from pydantic import BaseModel, Field

from app.schemas import CompositionId, ProductId, UserId
from app.users.utils import generate_random_username


class UserLikes(BaseModel):
    products: list[ProductId] = []
    compositions: list[CompositionId] = []


class User(BaseModel):
    id: UserId = Field(default_factory=lambda: UserId(str(uuid.uuid4())))
    likes: UserLikes = Field(default_factory=lambda: UserLikes())
    username: str = Field(default_factory=generate_random_username, min_length=1)
