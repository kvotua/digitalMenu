from typing import Optional

from fastapi import HTTPException, status
from pydantic_extra_types.color import Color

from app.schemas import TagId
from app.tags.models import TagModel
from app.tags.schemas import Tag


def create_tag(name: str, color: Color) -> TagId:
    tag = Tag(name=name, color=color.as_hex())
    TagModel(**tag.model_dump()).save()
    return tag.id


def get_all() -> list[Tag]:
    return [model.to_schema() for model in TagModel.scan()]


def delete(id: TagId) -> None:
    try:
        model = TagModel.get(id)
    except TagModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    model.delete()
    # TODO: delete tag from all compositions


def update(id: TagId, name: Optional[str], color: Optional[Color]) -> None:
    if name is None and color is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Any changes required")
    try:
        model = TagModel.get(id)
    except TagModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    if name is not None:
        model.name = name
    if color is not None:
        model.color = color.as_hex()
    model.save()
