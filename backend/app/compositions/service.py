from typing import Optional

from fastapi import HTTPException, status

from app.compositions.schemas import Composition, Point
from app.database import compositions_collection, products_collection, tags_collection
from app.schemas import CompositionId, ProductId, TagId


def create_composition(
    points: Optional[list[Point]], tags: Optional[list[TagId]]
) -> CompositionId:
    if points is None:
        points = []
    if tags is None:
        tags = []
    composition = Composition(points=points, tags=tags)
    for point in points:
        if products_collection.count_documents({"id": point.product_id}) == 0:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, f"Wrong product ID: {point.product_id}"
            )
    for tag in tags:
        if tags_collection.find_one({"id": tag}) is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Wrong tag ID: {tag}")
    compositions_collection.insert_one(composition.model_dump())
    return composition.id


def exist(id: CompositionId) -> bool:
    result = compositions_collection.find_one({"id": id})
    return result is not None


def get_composition(id: CompositionId) -> Composition:
    result = compositions_collection.find_one({"id": id})
    if result is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return Composition(**result)


def get_compositions(tag: Optional[TagId] = None) -> list[CompositionId]:
    query = {"tags": tag} if tag is not None else {}
    result = compositions_collection.find(query)
    return [composition["id"] for composition in result]


def attach_tag(composition_id: CompositionId, tag_id: TagId) -> None:
    if tags_collection.find_one({"id": tag_id}) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong tag ID")
    result = compositions_collection.update_one(
        {"id": id},
        {"$push": {"tags": tag_id}},
    )
    if result.modified_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")


def attach_product(
    composition_id: CompositionId, product_id: ProductId, x: float, y: float
) -> None:
    if products_collection.count_documents({"id": product_id}) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong product ID")
    point = Point(product_id=product_id, x=x, y=y)
    result = compositions_collection.update_one(
        {"id": composition_id},
        {"$push": {"points": point.model_dump()}},
    )
    if result.modified_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")


def remove_product(composition_id: CompositionId, product_id: ProductId) -> None:
    if compositions_collection.count_documents({"id": composition_id}) == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")
    result = compositions_collection.update_one(
        {"id": composition_id},
        {"$pull": {"points": {"product_id": product_id}}},
    )
    if result.modified_count == 0:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Product not attached to composition"
        )


def delete_tag(composition_id: CompositionId, tag_id: TagId) -> None:
    result = compositions_collection.find_one_and_delete({"id": composition_id})
    if result is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")
    composition = Composition(**result)
    if tag_id not in composition.tags:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "Tag not attached to composition"
        )
    compositions_collection.update_one(
        {"id": composition_id},
        {"$pull": {"tags": tag_id}},
    )


def delete_composition_by_id(id: CompositionId) -> None:
    result = compositions_collection.delete_one({"id": id})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong composition ID")
