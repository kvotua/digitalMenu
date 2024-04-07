import os
from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Body,
    Form,
    Header,
    HTTPException,
    Path,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse

from app.products.schemas import Product
from app.products.service import create_product, delete, get_product, update, get_all
from app.schemas import JWToken, ProductId

router = APIRouter(prefix="/products", tags=["Products"])


@router.get(
    "/{id}",
    description="Get product info (no JWT verification now)",
)
async def get_product_info(
    token: Annotated[JWToken, Header()],
    id: Annotated[ProductId, Path()],
) -> Product:
    return get_product(id)


@router.get(
    "/",
    description="Get all products info (no JWT verification now)",
)
async def get_products_info(
    token: Annotated[JWToken, Header()],
) -> list[Product]:
    return get_all()


@router.get(
    "/{id}/image",
    description="Get image of product",
    response_class=FileResponse,
    responses={
        200: {"content": {"image/*": {}}},
    },
)
async def get_image(
    id: Annotated[ProductId, Path()],
) -> FileResponse:
    path = f"/storage/{id}"
    if not os.path.isfile(path):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "File not found")
    return FileResponse(path, media_type="image/*")


@router.post(
    "/",
    description="Create new product (no JWT, file type and file size verification now)",
)
async def post_product(
    token: Annotated[JWToken, Header()],
    image: UploadFile,
    name: Annotated[str, Form(min_length=1)],
    description: Annotated[str, Form(min_length=1)],
    price: Annotated[int, Form(gt=0)],
) -> ProductId:
    product_id = create_product(name, description, price)
    with open(f"/storage/{product_id}", "wb") as file:
        file.write(image.file.read())
    return product_id


@router.patch(
    "/{id}",
    description="Update product info (no JWT verification now)",
)
async def update_product_info(
    token: Annotated[JWToken, Header()],
    id: Annotated[ProductId, Path()],
    name: Optional[Annotated[str, Body(min_length=1)]],
    description: Optional[Annotated[str, Body()]],
    price: Optional[Annotated[int, Body(gt=0)]],
) -> None:
    update(id, name, description, price)


@router.delete(
    "/{id}",
    description="Also removes it from all compositions (no JWT verification now)",
)
async def delete_product(
    token: Annotated[JWToken, Header()],
    id: Annotated[ProductId, Path()],
) -> None:
    delete(id)
