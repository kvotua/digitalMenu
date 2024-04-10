from typing import Optional

from fastapi import HTTPException, status

from app.compositions.models import CompositionModel
from app.compositions.schemas import Point
from app.products.models import ProductModel
from app.products.schemas import Product
from app.schemas import ProductId, UserId
from app.users.models import UserModel


def create_product(name: str, description: str, price: int) -> ProductId:
    product = Product(name=name, description=description, price=price)
    ProductModel(**product.model_dump()).save()
    return product.id


def get_product(id: ProductId) -> Product:
    try:
        model = ProductModel.get(id)
    except ProductModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return model.to_schema()


def delete(id: ProductId) -> None:
    try:
        model = ProductModel.get(id)
    except ProductModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    for composition in CompositionModel.scan():
        points: list[Point] = [Point(**point) for point in composition.points]
        points = [point for point in points if point.product_id != id]
        composition.points = [point.model_dump() for point in points]
        composition.save()
    model.delete()


def get_all() -> list[Product]:
    return [product.to_schema() for product in ProductModel.scan()]


def update(
    id: ProductId, name: Optional[str], description: Optional[str], price: Optional[int]
) -> None:
    if all(map(lambda x: x is None, (name, description, price))):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Any changes required")
    try:
        model = ProductModel.get(id)
    except ProductModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)

    if name is not None:
        model.name = name
    if description is not None:
        model.description = description
    if price is not None:
        model.price = price
    model.save()


def to_cart(user_id: UserId, id: ProductId) -> None:
    try:
        ProductModel.get(id)
    except ProductModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong product ID")
    try:
        user_model = UserModel.get(user_id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not exist")
    dcart = user_model.cart.as_dict() if user_model.cart is not None else {}
    dcart[id] = dcart.get(id, 0) + 1
    user_model.cart = dcart
    user_model.save()


def from_cart(user_id: UserId, id: ProductId) -> None:
    try:
        user_model = UserModel.get(user_id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not exist")
    dcart = user_model.cart.as_dict() if user_model.cart is not None else {}
    if id not in dcart:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Product not in cart")
    dcart[id] = dcart.get(id) - 1
    if dcart[id] < 1:
        dcart.pop(id)
    user_model.cart = dcart
    user_model.save()
