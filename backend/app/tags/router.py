from typing import Annotated, Optional

from fastapi import APIRouter, Body, Depends, Path
from pydantic_extra_types.color import Color

from app.schemas import TagId
from app.tags.schemas import Tag
from app.tags.service import create_tag, delete, get_all, update
from app.utils import check_admin

router = APIRouter(prefix="/tags", tags=["Tags"])


@router.get(
    "/",
    description="Get all tags",
    dependencies=[Depends(check_admin)],
)
async def get_all_tags() -> list[Tag]:
    return get_all()


@router.post(
    "/",
    description="Creates new tag",
    dependencies=[Depends(check_admin)],
)
async def post_tag(
    name: Annotated[str, Body(min_length=1)],
    color: Annotated[Color, Body()],
) -> TagId:
    return create_tag(name, color)


@router.patch(
    "/{id}",
    dependencies=[Depends(check_admin)],
)
async def update_tag_info(
    id: Annotated[TagId, Path()],
    name: Optional[Annotated[str, Body(min_length=1)]],
    color: Optional[Annotated[Color, Body()]],
) -> None:
    update(id, name, color)


@router.delete(
    "/{id}",
    description="Also remove it from all compositions",
    dependencies=[Depends(check_admin)],
)
async def delete_tag(
    id: Annotated[TagId, Path()],
) -> None:
    delete(id)
