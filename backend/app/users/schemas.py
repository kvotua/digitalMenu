import uuid

from pydantic import BaseModel, Field

from app.schemas import CompositionId, ProductId, UserId


class UserLikes(BaseModel):
    products: list[ProductId] = []
    compositions: list[CompositionId] = []


class User(BaseModel):
    id: UserId = Field(default_factory=lambda: UserId(str(uuid.uuid4())))
    likes: UserLikes = Field(default_factory=lambda: UserLikes())
    username: str = Field(default="")
    password: str = Field(default="")
