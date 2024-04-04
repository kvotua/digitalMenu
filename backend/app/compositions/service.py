from typing import Optional

from fastapi import HTTPException, status

from app.compositions.schemas import Composition
from app.database import compositions_collection, tags_collection
from app.schemas import CompositionId, TagId


def create_composition() -> CompositionId:
    composition = Composition()
    compositions_collection.insert_one(composition.model_dump())
    return composition.id


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
