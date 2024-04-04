import uuid

from pydantic import BaseModel, Field

from app.schemas import ProductId


class Product(BaseModel):
    id: ProductId = Field(default_factory=lambda: ProductId(str(uuid.uuid4())))
    name: str = Field(min_length=1)
    price: int = Field(gt=0)
    description: str = Field(min_length=1)
    likes: int = Field(default=0, ge=0)
