from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class TrabajadorBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255, description="Nombre completo del trabajador")
    foto_url: Optional[str] = Field(None, description="URL pública de la foto en Supabase Storage")
    telefono: Optional[str] = Field(None, max_length=50, description="Número de teléfono de contacto")
    qr_code: Optional[str] = Field(None, description="Código o identificador del QR asociado")


class TrabajadorCreate(TrabajadorBase):
    pass


class TrabajadorUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=255)
    foto_url: Optional[str] = None
    telefono: Optional[str] = Field(None, max_length=50)
    qr_code: Optional[str] = None


class Trabajador(TrabajadorBase):
    id: UUID = Field(..., description="Identificador único UUID")
    created_at: datetime = Field(..., description="Fecha y hora de creación del registro")

    class Config:
        from_attributes = True


# Auth schemas

class UserRegister(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6)
    telefono: Optional[str] = Field(None, max_length=50)
    foto_url: Optional[str] = Field(
        None, description="URL pública de la foto en Supabase Storage"
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    id: str
    email: str
    nombre: str
    telefono: Optional[str] = None
    foto_url: Optional[str] = None
    qr_code: Optional[str] = None
    created_at: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    user: UserProfile
