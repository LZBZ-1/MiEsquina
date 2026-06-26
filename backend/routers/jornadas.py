import os

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from models import JornadaCreate, JornadaResponse
from supabase_client import get_supabase

router = APIRouter(prefix="/api/jornadas", tags=["jornadas"])
security = HTTPBearer()

JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, JWT_SECRET, algorithms=["HS256"], audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/activa", response_model=JornadaResponse)
async def get_jornada_activa(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    trabajador_id = user.get("sub")

    try:
        result = (
            supabase.table("jornadas")
            .select("*")
            .eq("trabajador_id", trabajador_id)
            .is_("fin", "null")
            .single()
            .execute()
        )
        jornada = result.data
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay jornada activa",
        )

    if not jornada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay jornada activa",
        )

    return JornadaResponse(
        id=jornada["id"],
        trabajador_id=jornada["trabajador_id"],
        interseccion=jornada["interseccion"],
        inicio=jornada["inicio"],
        fin=jornada.get("fin"),
        ingreso_estimado=jornada.get("ingreso_estimado"),
        created_at=jornada.get("created_at"),
    )


@router.post("/iniciar", response_model=JornadaResponse)
async def iniciar_jornada(
    body: JornadaCreate, user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    trabajador_id = user.get("sub")

    # Verificar si hay jornada activa
    try:
        active = (
            supabase.table("jornadas")
            .select("*")
            .eq("trabajador_id", trabajador_id)
            .is_("fin", "null")
            .execute()
        )
        if active.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe una jornada activa",
            )
    except HTTPException:
        raise
    except Exception:
        pass

    # Insertar nueva jornada
    try:
        result = (
            supabase.table("jornadas")
            .insert(
                {
                    "trabajador_id": trabajador_id,
                    "interseccion": body.interseccion,
                }
            )
            .execute()
        )
        data = result.data[0]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database error: {exc}",
        )

    return JornadaResponse(
        id=data["id"],
        trabajador_id=data["trabajador_id"],
        interseccion=data["interseccion"],
        inicio=data["inicio"],
        fin=data.get("fin"),
        ingreso_estimado=data.get("ingreso_estimado"),
        created_at=data.get("created_at"),
    )


@router.post("/finalizar", response_model=JornadaResponse)
async def finalizar_jornada(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    trabajador_id = user.get("sub")

    # Buscar jornada activa
    try:
        result = (
            supabase.table("jornadas")
            .select("*")
            .eq("trabajador_id", trabajador_id)
            .is_("fin", "null")
            .single()
            .execute()
        )
        jornada = result.data
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay jornada activa para finalizar",
        )

    if not jornada:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hay jornada activa para finalizar",
        )

    # Actualizar fin
    try:
        updated = (
            supabase.table("jornadas")
            .update({"fin": "now()"})
            .eq("id", jornada["id"])
            .execute()
        )
        data = updated.data[0]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database error: {exc}",
        )

    return JornadaResponse(
        id=data["id"],
        trabajador_id=data["trabajador_id"],
        interseccion=data["interseccion"],
        inicio=data["inicio"],
        fin=data.get("fin"),
        ingreso_estimado=data.get("ingreso_estimado"),
        created_at=data.get("created_at"),
    )
