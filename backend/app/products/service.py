from typing import Optional

from fastapi import HTTPException, status

from app.database import compositions_collection, products_collection
from app.products.schemas import Product
from app.schemas import ProductId


def create_product(name: str, description: str, price: int) -> ProductId:
    product = Product(name=name, description=description, price=price)
    products_collection.insert_one(product.model_dump())
    return product.id


def get_product(id: ProductId) -> Product:
    result = products_collection.find_one({"id": id})
    if result is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return Product(**result)


def delete(id: ProductId) -> None:
    result = products_collection.delete_one({"id": id})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong product ID")
    compositions_collection.update_many(
        {"points": {"product_id": id}},
        {"$pull": {"points": {"product_id": id}}},
    )


def update(
    id: ProductId, name: Optional[str], description: Optional[str], price: Optional[int]
) -> None:
    if all(map(lambda x: x is None, (name, description, price))):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Any changes required")
    updates: dict[str, str | int] = {}
    if name is not None:
        updates["name"] = name
    if description is not None:
        updates["description"] = description
    if price is not None:
        updates["price"] = price
    result = products_collection.update_one(
        {"id": id},
        updates,
    )
    if result.modified_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong product ID")
