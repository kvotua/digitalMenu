from typing import Optional

from fastapi import HTTPException, status

from app.compositions.models import CompositionModel
from app.compositions.schemas import Composition, Point
from app.products.models import ProductModel
from app.schemas import CompositionId, ProductId, TagId, UserId
from app.tags.models import TagModel
from app.users.models import UserModel


def create_composition(
    points: Optional[list[Point]], tags: Optional[list[TagId]]
) -> CompositionId:
    if points is None:
        points = []
    if tags is None:
        tags = []
    composition = Composition(points=points, tags=tags)
    for point in points:
        try:
            ProductModel.get(point.product_id)
        except ProductModel.DoesNotExist:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, f"Wrong product ID: {point.product_id}"
            )
    for tag in tags:
        try:
            TagModel.get(tag)
        except TagModel.DoesNotExist:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Wrong tag ID: {tag}")
    CompositionModel(**composition.model_dump()).save()
    return composition.id


def exist(id: CompositionId) -> bool:
    try:
        CompositionModel.get(id)
        return True
    except CompositionModel.DoesNotExist:
        return False


def get_composition(id: CompositionId) -> Composition:
    try:
        model = CompositionModel.get(id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    return model.to_schema()


def get_compositions(tag: Optional[TagId] = None) -> list[CompositionId]:
    if tag is None:
        models = CompositionModel.scan()
    else:
        try:
            TagModel.get(tag)
        except TagModel.DoesNotExist:
            raise HTTPException(status.HTTP_404_NOT_FOUND, f"Wrong tag ID: {tag}")
        models = CompositionModel.scan(CompositionModel.tags.contains(tag))
    return [CompositionId(model.id) for model in models]


def attach_tag(composition_id: CompositionId, tag: TagId) -> None:
    try:
        CompositionModel.get(composition_id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong composition ID: {composition_id}"
        )
    try:
        TagModel.get(tag)
    except TagModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Wrong tag ID: {tag}")
    model = CompositionModel.get(composition_id)
    model.tags.add(tag)
    model.save()


def attach_product(
    composition_id: CompositionId, product_id: ProductId, x: float, y: float
) -> None:
    try:
        model = CompositionModel.get(composition_id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong composition ID: {composition_id}"
        )
    try:
        ProductModel.get(product_id)
    except ProductModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong product ID: {product_id}"
        )
    point = Point(product_id=product_id, x=x, y=y)
    model.points.append(point.model_dump())
    model.save()


def like(composition_id: CompositionId, user_id: UserId) -> None:
    try:
        model = CompositionModel.get(composition_id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong composition ID: {composition_id}"
        )
    user_model = UserModel.get(user_id)
    if user_model.compositions_likes is None:
        user_model.compositions_likes = {composition_id}
    else:
        user_model.compositions_likes.add(composition_id)
    user_model.save()
    model.likes += 1
    model.save()


def unlike(composition_id: CompositionId, user_id: UserId) -> None:
    try:
        model = CompositionModel.get(composition_id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong composition ID: {composition_id}"
        )
    user_model = UserModel.get(user_id)
    user_model.compositions_likes = {
        liked for liked in user_model.compositions_likes if liked != composition_id
    }
    user_model.save()
    model.likes -= 1
    model.save()


def remove_product(composition_id: CompositionId, product_id: ProductId) -> None:
    try:
        model = CompositionModel.get(composition_id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong composition ID: {composition_id}"
        )
    try:
        ProductModel.get(product_id)
    except ProductModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong product ID: {product_id}"
        )
    model.points = [
        point for point in model.points if point["product_id"] != product_id
    ]
    model.save()


def delete_tag(composition_id: CompositionId, tag_id: TagId) -> None:
    try:
        model = CompositionModel.get(composition_id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Wrong composition ID: {composition_id}"
        )
    try:
        TagModel.get(tag_id)
    except TagModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Wrong tag ID: {tag_id}")
    model.tags.remove(tag_id)
    model.save()


def delete_composition_by_id(id: CompositionId) -> None:
    try:
        model = CompositionModel.get(id)
    except CompositionModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Wrong composition ID: {id}")
    model.delete()
