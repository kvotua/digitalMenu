from typing import Optional

from fastapi import HTTPException, status
from pydantic_extra_types.color import Color

from app.database import compositions_collection, tags_collection
from app.schemas import TagId
from app.tags.schemas import Tag


def create_tag(name: str, color: Color) -> TagId:
    tag = Tag(name=name, color=color)
    tags_collection.insert_one(tag.model_dump())
    return tag.id


def get_all() -> list[Tag]:
    result = tags_collection.find({})
    return [Tag(**tag) for tag in result]


def delete(id: TagId) -> None:
    tags_collection.delete_one({"id": id})
    compositions_collection.update_many(
        {"tags": id},
        {"$pull": {"tags": id}},
    )


def update(id: TagId, name: Optional[str], color: Optional[Color]) -> None:
    if name is None and color is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Any changes required")
    updates = {}
    if name is not None:
        updates["name"] = name
    if color is not None:
        updates["color"] = color.as_hex()
    tags_collection.update_one(
        {"id": id},
        updates,
    )
