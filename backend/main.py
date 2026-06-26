import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.auth import router as auth_router
from routers.donaciones import router as donaciones_router
from routers.jornadas import router as jornadas_router
from routers.trabajadores import router as trabajadores_router

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Mi Esquina API",
    description="Backend API para Mi Esquina",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(trabajadores_router)
app.include_router(jornadas_router)
app.include_router(donaciones_router)


@app.get("/")
async def root():
    return {"message": "Hola Mundo desde FastAPI"}


@app.get("/health")
async def health():
    return {"status": "ok"}
