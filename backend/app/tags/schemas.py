import uuid

from pydantic import BaseModel, Field

from app.schemas import TagId


class Tag(BaseModel):
    id: TagId = Field(default_factory=lambda: TagId(str(uuid.uuid4())))
    name: str = Field(min_length=1)
    color: str
