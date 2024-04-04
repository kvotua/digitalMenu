import os
from typing import Annotated, Optional

from fastapi import (APIRouter, Body, Header, HTTPException, Path, Query,
                     UploadFile, status)
from fastapi.responses import FileResponse

from app.compositions.schemas import Composition
from app.compositions.service import (attach_tag, create_composition,
                                      delete_composition_by_id, delete_tag,
                                      get_composition, get_compositions)
from app.schemas import CompositionId, JWToken, TagId

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
    image: UploadFile,
) -> CompositionId:
    composition_id = create_composition()
    with open(f"/storage/{composition_id}", "wb") as file:
        file.write(image.file.read())
    return composition_id


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
    "/{id}/tag",
    description="Remove tag from composition (no JWT verification now)",
)
async def remove_tag(
    token: Annotated[JWToken, Header()],
    id: Annotated[CompositionId, Path()],
    tag_id: Annotated[TagId, Body(embed=True)],
) -> None:
    delete_tag(id, tag_id)
