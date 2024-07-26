from typing import Annotated

import filetype  # type: ignore
import jwt
from fastapi import Depends, Header, HTTPException, status

from app.config import JWT_SECRET
from app.schemas import JWToken, UserId
from app.users.models import UserModel

FILE_SIZE_IMAGE = 2147483648  # 2гб в байтах
FILE_SIZE_VIDEO = 2147483648  # 2гб в байтах


ACCEPTED_FILE_TYPES = (
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/heic",
    "image/heif",
    "image/heics",
    "video/mp4",
    "video/gif",
    "png",
    "jpeg",
    "jpg",
    "heic",
    "heif",
    "heics",
)


def jwt_to_id(token: Annotated[JWToken, Header()]) -> UserId:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])["id"]
    except jwt.exceptions.PyJWTError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"JWT: {str(exc)}")


def check_admin(user_id: Annotated[UserId, Depends(jwt_to_id)]) -> None:
    try:
        model = UserModel.get(user_id)
    except UserModel.DoesNotExist:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Wrong user ID in JWT")
    if model.username != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Only admin")


def validate_file_size_image(file) -> None:
    file_info = filetype.guess(file.file)
    if file_info is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unable to determine file type",
        )
    
    detected_content_type = file_info.extension.lower()

    if (
        file.content_type not in ACCEPTED_FILE_TYPES
        or detected_content_type not in ACCEPTED_FILE_TYPES
    ):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type",
        )

    real_file_size = 0
    for chunk in file.file:
        real_file_size += len(chunk)
        if real_file_size > FILE_SIZE_IMAGE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Too large"
            )
        
def validate_file_size_video(file) -> None:
    file_info = filetype.guess(file.file)
    if file_info is None:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unable to determine file type",
        )

    detected_content_type = file_info.extension.lower()

    if (
        file.content_type not in ACCEPTED_FILE_TYPES
        or detected_content_type not in ACCEPTED_FILE_TYPES
    ):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type",
        )

    real_file_size = 0
    for chunk in file.file:
        real_file_size += len(chunk)
        if real_file_size > FILE_SIZE_VIDEO:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Too large"
            )
