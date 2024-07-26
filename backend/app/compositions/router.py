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
    unlike,
)
from app.schemas import CompositionId, JWToken, ProductId, TagId, UserId
from app.utils import check_admin, jwt_to_id, validate_file_size_image, validate_file_size_video

router = APIRouter(prefix="/compositions", tags=["Compositions"])


@router.get(
    "/{id}",
    description="Get composition info",
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
    return FileResponse(path,  media_type="image/*")

async def get_video(
    id: Annotated[CompositionId, Path()],
) -> FileResponse:
    path = f"/storage/{id}"
    if not os.path.isfile(path):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "File not found")
    return FileResponse(path,  media_type="video/*")

@router.get(
    "/{id}/video",
    description="Get video of composition",
    response_class=FileResponse,
    responses={
        200: {"content": {"video/*": {}}},
    },
)

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
    description="New composition",
    dependencies=[Depends(check_admin)],
)
async def post_composition(
    points: Annotated[Optional[list[Point]], Body()] = None,
    tags: Annotated[Optional[list[TagId]], Body()] = None,
) -> CompositionId:
    composition_id = create_composition(points, tags)
    return composition_id


@router.post(
    "/{id}/image",
    description="Add image to composition",
    dependencies=[Depends(check_admin)],
)
async def post_composition_image(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    image: UploadFile,
) -> None:
    if not exist(id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")
    validate_file_size_image(image)
    await image.seek(0)
    with open(f"/storage/{id}", "wb") as file:
        file.write(image.file.read())

@router.post(
    "/{id}/video",
    description="Add video to composition",
    dependencies=[Depends(check_admin)],
)
async def post_composition_video(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    video: UploadFile,
) -> None:
    if not exist(id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")
    validate_file_size_video(video)
    await video.seek(0)
    with open(f"/storage/{id}", "wb") as file:
        file.write(video.file.read())


@router.post(
    "/{id}/product",
    description="Attach product to composition",
    dependencies=[Depends(check_admin)],
)
async def attach_product_to_composition(
    id: Annotated[CompositionId, Path()],
    product_id: Annotated[ProductId, Body()],
    x: Annotated[float, Body(ge=0, le=1)],
    y: Annotated[float, Body(ge=0, le=1)],
) -> None:
    attach_product(id, product_id, x, y)


@router.post(
    "/{id}/like",
    description="Add composition to liked",
)
async def like_composition(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    id: Annotated[CompositionId, Path()],
) -> None:
    like(id, user_id)


@router.delete(
    "/{id}/like",
    description="Remove composition from liked",
)
async def unlike_composition(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    id: Annotated[CompositionId, Path()],
) -> None:
    unlike(id, user_id)


@router.post(
    "/{id}/tag",
    description="Attach tag to composition",
    dependencies=[Depends(check_admin)],
)
async def post_tag(
    id: Annotated[CompositionId, Path()],
    tag_id: Annotated[TagId, Body(embed=True)],
) -> None:
    attach_tag(id, tag_id)


@router.delete(
    "/{id}",
    description="Delete composition",
    dependencies=[Depends(check_admin)],
)
async def delete_composition(
    id: Annotated[CompositionId, Path()],
) -> None:
    delete_composition_by_id(id)


@router.delete(
    "/{id}/tag/{tag_id}",
    description="Remove tag from composition",
    dependencies=[Depends(check_admin)],
)
async def remove_tag(
    id: Annotated[CompositionId, Path()],
    tag_id: Annotated[TagId, Path()],
) -> None:
    delete_tag(id, tag_id)


@router.delete(
    "/{id}/product/{product_id}",
    description="Remove product from composition",
    dependencies=[Depends(check_admin)],
)
async def remove_product_from_composition(
    id: Annotated[CompositionId, Path()],
    product_id: Annotated[ProductId, Path()],
) -> None:
    remove_product(id, product_id)
