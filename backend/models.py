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


class TrabajadorPublic(BaseModel):
    id: str
    nombre: str
    foto_url: Optional[str] = None
    qr_code: Optional[str] = None
    created_at: Optional[str] = None


# Jornadas schemas

class JornadaCreate(BaseModel):
    interseccion: str = Field(..., min_length=1, max_length=255)


class JornadaResponse(BaseModel):
    id: str
    trabajador_id: str
    interseccion: str
    inicio: str
    fin: Optional[str] = None
    ingreso_estimado: Optional[float] = None
    created_at: Optional[str] = None


# Donaciones schemas

class DonacionCreate(BaseModel):
    trabajador_id: str
    monto: float = Field(..., gt=0)
    metodo_pago: str = Field(
        ...,
        pattern="^(tarjeta_nacional|tarjeta_internacional|yape|cuotealo_bcp|pago_efectivo)$",
    )
    token_culqi: str


class DonacionResponse(BaseModel):
    id: str
    trabajador_id: str
    monto: float
    monto_final: float
    comision: float
    metodo_pago: str
    estado: str
    created_at: Optional[str] = None
