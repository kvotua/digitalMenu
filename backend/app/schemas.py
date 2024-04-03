from typing import NewType

from pydantic import BaseModel, Field
from pydantic_extra_types.color import Color

from .utils import get_random_id

UserId = NewType("UserId", str)
TagId = NewType("TagId", str)
ProductId = NewType("ProductId", str)
CompositionId = NewType("CompositionId", str)
JWToken = NewType("JWToken", str)


class Tag(BaseModel):
    id: TagId = Field(default_factory=lambda: TagId(get_random_id()))
    name: str = Field(min_length=1)
    color: Color


class Product(BaseModel):
    id: ProductId = Field(default_factory=lambda: ProductId(get_random_id()))
    name: str = Field(min_length=1)
    price: int = Field(gt=0)
    description: str = Field(min_length=1)
    likes: int = Field(default=0, gt=0)


class Point(BaseModel):
    product_id: ProductId
    x: float = Field(gt=0, lt=1)
    y: float = Field(gt=0, lt=1)


class Composition(BaseModel):
    id: CompositionId = Field(default_factory=lambda: CompositionId(get_random_id()))
    tags: list[TagId]
    points: list[Point]
