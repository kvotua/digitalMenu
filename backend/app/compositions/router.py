import os
from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Body,
    Depends,
    Header,
    HTTPException,
    Path,
    Query,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse

from app.compositions.schemas import Composition, Point
from app.compositions.service import (
    attach_product,
    attach_tag,
    create_composition,
    delete_composition_by_id,
    delete_tag,
    exist,
    get_composition,
    get_compositions,
    like,
    remove_product,
)
from app.schemas import CompositionId, JWToken, ProductId, TagId, UserId
from app.utils import jwt_to_id

router = APIRouter(prefix="/compositions", tags=["Compositions"])


@router.get(
    "/{id}",
    description="Get composition info (no JWT verification now)",
)
async def get_composition_info(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
) -> Composition:
    return get_composition(id)


@router.get(
    "/{id}/image",
    description="Get image of composition",
    response_class=FileResponse,
    responses={
        200: {"content": {"image/*": {}}},
    },
)
async def get_image(
    id: Annotated[CompositionId, Path()],
) -> FileResponse:
    path = f"/storage/{id}"
    if not os.path.isfile(path):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "File not found")
    return FileResponse(path, media_type="image/*")


@router.get(
    "/",
    description="Get all compositions",
)
async def get_all_compositions(
    token: Annotated[JWToken, Header()],
    tag: Optional[Annotated[TagId, Query()]] = None,
) -> list[CompositionId]:
    return get_compositions(tag)


@router.post(
    "/",
    description="New composition (no JWT, file type and file size verification now)",
)
async def post_composition(
    token: Annotated[JWToken, Header()],
    points: Annotated[Optional[list[Point]], Body()] = None,
    tags: Annotated[Optional[list[TagId]], Body()] = None,
) -> CompositionId:
    composition_id = create_composition(points, tags)
    return composition_id


@router.post(
    "/{id}/image",
    description="Add image to composition (no JWT, file type/size verification now)",
)
async def post_composition_image(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    image: UploadFile,
) -> None:
    if not exist(id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")
    with open(f"/storage/{id}", "wb") as file:
        file.write(image.file.read())


@router.post(
    "/{id}/product",
    description="Attach product to composition (no JWT verification now)",
)
async def attach_product_to_composition(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    product_id: Annotated[ProductId, Body()],
    x: Annotated[float, Body(ge=0, le=1)],
    y: Annotated[float, Body(ge=0, le=1)],
) -> None:
    attach_product(id, product_id, x, y)


@router.post(
    "/{id}/like",
    description="Add composition to liked (no JWT verification now)",
)
async def like_composition(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    id: Annotated[CompositionId, Path()],
) -> None:
    like(id, user_id)


@router.post(
    "/{id}/tag",
    description="Attach tag to composition (no JWT verification now)",
)
async def post_tag(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    tag_id: Annotated[TagId, Body(embed=True)],
) -> None:
    attach_tag(id, tag_id)


@router.delete(
    "/{id}",
    description="Delete composition (no JWT verification now)",
)
async def delete_composition(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
) -> None:
    delete_composition_by_id(id)


@router.delete(
    "/{id}/tag/{tag_id}",
    description="Remove tag from composition (no JWT verification now)",
)
async def remove_tag(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    tag_id: Annotated[TagId, Path()],
) -> None:
    delete_tag(id, tag_id)


@router.delete(
    "/{id}/product/{product_id}",
    description="Remove product from composition (no JWT verification now)",
)
async def remove_product_from_composition(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    product_id: Annotated[ProductId, Path()],
) -> None:
    remove_product(id, product_id)
