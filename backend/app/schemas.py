import uuid
from typing import NewType

from pydantic import BaseModel, Field
from pydantic_extra_types.color import Color

UserId = NewType("UserId", str)
TagId = NewType("TagId", str)
ProductId = NewType("ProductId", str)
CompositionId = NewType("CompositionId", str)
JWToken = NewType("JWToken", str)


class Tag(BaseModel):
    id: TagId = Field(default_factory=lambda: TagId(str(uuid.uuid4())))
    name: str = Field(min_length=1)
    color: Color


class Point(BaseModel):
    product_id: ProductId
    x: float = Field(gt=0, lt=1)
    y: float = Field(gt=0, lt=1)


class Composition(BaseModel):
    id: CompositionId = Field(default_factory=lambda: CompositionId(str(uuid.uuid4())))
    tags: list[TagId]
    points: list[Point]
