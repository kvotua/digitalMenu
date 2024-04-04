import uuid

from pydantic import BaseModel, Field

from app.schemas import CompositionId, ProductId, TagId


class Point(BaseModel):
    product_id: ProductId
    x: float = Field(ge=0, le=1)
    y: float = Field(ge=0, le=1)


class Composition(BaseModel):
    id: CompositionId = Field(default_factory=lambda: CompositionId(str(uuid.uuid4())))
    tags: list[TagId] = []
    points: list[Point] = []
