from typing import Annotated, Optional

from fastapi import APIRouter, Body, Header, Path
from pydantic_extra_types.color import Color

from app.schemas import JWToken, TagId
from app.tags.schemas import Tag
from app.tags.service import create_tag, delete, get_all, update

router = APIRouter(prefix="/tags", tags=["Tags"])


@router.get(
    "/",
    description="Get all tags (now JWT verification now)",
)
async def get_all_tags(
    token: Annotated[JWToken, Header()],
) -> list[Tag]:
    return get_all()


@router.post(
    "/",
    description="Creates new tag (now JWT verification now)",
)
async def post_tag(
    token: Annotated[JWToken, Header()],
    name: Annotated[str, Body(min_length=1)],
    color: Annotated[Color, Body()],
) -> TagId:
    return create_tag(name, color)


@router.patch("/{id}")
async def update_tag_info(
    token: Annotated[JWToken, Header()],
    id: Annotated[TagId, Path()],
    name: Optional[Annotated[str, Body(min_length=1)]],
    color: Optional[Annotated[Color, Body()]],
) -> None:
    update(id, name, color)


@router.delete(
    "/{id}",
    description="Also remove it from all compositions (now JWT verification now)",
)
async def delete_tag(
    token: Annotated[JWToken, Header()],
    id: Annotated[TagId, Path()],
) -> None:
    delete(id)
