import os
from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Body,
    Depends,
    Form,
    Header,
    HTTPException,
    Path,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse

from app.products.schemas import Product
from app.products.service import (
    create_product,
    delete,
    from_cart,
    get_all,
    get_product,
    to_cart,
    update,
)
from app.schemas import JWToken, ProductId, UserId
from app.utils import check_admin, jwt_to_id, validate_file_size_type

router = APIRouter(prefix="/products", tags=["Products"])


@router.get(
    "/",
    description="Get all products info",
)
async def get_products_info(
    token: Annotated[JWToken, Header()],
) -> list[Product]:
    return get_all()


@router.get(
    "/{id}",
    description="Get product info",
)
async def get_product_info(
    token: Annotated[JWToken, Header()],
    id: Annotated[ProductId, Path()],
) -> Product:
    return get_product(id)


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
    description="Create new product",
    dependencies=[Depends(check_admin)],
)
async def post_product(
    image: UploadFile,
    name: Annotated[str, Form(min_length=1)],
    description: Annotated[str, Form(min_length=1)],
    price: Annotated[int, Form(gt=0)],
) -> ProductId:
    validate_file_size_type(image)
    await image.seek(0)
    product_id = create_product(name, description, price)
    with open(f"/storage/{product_id}", "wb") as file:
        file.write(image.file.read())
    return product_id


@router.post("/{id}/cart", description="Add product to user's cart")
async def add_to_cart(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    id: Annotated[ProductId, Path()],
) -> None:
    to_cart(user_id, id)


@router.patch(
    "/{id}",
    description="Update product info",
    dependencies=[Depends(check_admin)],
)
async def update_product_info(
    id: Annotated[ProductId, Path()],
    name: Optional[Annotated[str, Body(min_length=1)]],
    description: Optional[Annotated[str, Body()]],
    price: Optional[Annotated[int, Body(gt=0)]],
) -> None:
    update(id, name, description, price)


@router.delete(
    "/{id}",
    description="Also removes it from all compositions",
    dependencies=[Depends(check_admin)],
)
async def delete_product(
    id: Annotated[ProductId, Path()],
) -> None:
    delete(id)


@router.delete("/{id}/cart", description="Remove product from user's cart")
async def remove_from_cart(
    user_id: Annotated[UserId, Depends(jwt_to_id)],
    id: Annotated[ProductId, Path()],
) -> None:
    from_cart(user_id, id)
