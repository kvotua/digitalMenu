from pydantic import BaseModel, Field

from app.schemas import CompositionId, ProductId, UserId
from app.users.utils import generate_random_username
from app.utils import get_random_id


class UserLikes(BaseModel):
    products: list[ProductId] = []
    compositions: list[CompositionId] = []


class User(BaseModel):
    id: UserId = Field(default_factory=lambda: UserId(get_random_id()))
    likes: UserLikes = Field(default_factory=lambda: UserLikes())
    username: str = Field(default_factory=generate_random_username, min_length=1)
