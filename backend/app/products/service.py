from fastapi import HTTPException, status

from app.database import products_collection
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
