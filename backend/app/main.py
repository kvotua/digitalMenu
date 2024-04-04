from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.compositions.router import router as compositions_router
from app.products.router import router as products_router
from app.tags.router import router as tags_router
from app.users.router import router as users_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(products_router)
app.include_router(compositions_router)
app.include_router(tags_router)
