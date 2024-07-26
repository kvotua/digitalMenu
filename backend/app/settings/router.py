import os, logging
from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Body,
    Depends,
    Header,
    HTTPException,
    Path,
    Query,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from app.schemas import CompositionId, JWToken, ProductId, TagId, UserId
from app.utils import ACCEPTED_FILE_TYPES, check_admin, jwt_to_id, validate_file_size_image, validate_file_size_video

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get(
    "/settings",
    description="Get settings of composition"
)
async def get_settings():
    dict_accepted_files = {"accepted_files_type": ACCEPTED_FILE_TYPES}
    logging.info(dict_accepted_files)
    return JSONResponse(content=jsonable_encoder(dict_accepted_files))