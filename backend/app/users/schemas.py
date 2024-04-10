import uuid
from typing import Optional

from pydantic import BaseModel, EmailStr, Field
from pydantic_extra_types.phone_numbers import PhoneNumber

from app.schemas import CompositionId, ProductId, UserId


class UserLikes(BaseModel):
    products: list[ProductId] = []
    compositions: list[CompositionId] = []


class User(BaseModel):
    id: UserId = Field(default_factory=lambda: UserId(str(uuid.uuid4())))
    likes: UserLikes = Field(default_factory=lambda: UserLikes())
    username: str = ""
    password: str = ""
    name: str = ""
    surname: str = ""
    email: Optional[EmailStr] = None
    phone: Optional[PhoneNumber] = None
