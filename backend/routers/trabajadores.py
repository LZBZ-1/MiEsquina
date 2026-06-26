from fastapi import APIRouter, HTTPException, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address

from models import TrabajadorPublic
from supabase_client import get_supabase

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/trabajadores", tags=["trabajadores"])


@router.get("/{trabajador_id}", response_model=TrabajadorPublic)
@limiter.limit("30/minute")
async def get_trabajador(request: Request, trabajador_id: str):
    supabase = get_supabase()

    try:
        db_resp = (
            supabase.table("trabajadores")
            .select("id, nombre, foto_url, qr_code, created_at")
            .eq("id", trabajador_id)
            .single()
            .execute()
        )
        profile = db_resp.data
    except Exception:
        profile = None

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trabajador not found",
        )

    return TrabajadorPublic(
        id=profile["id"],
        nombre=profile["nombre"],
        foto_url=profile.get("foto_url"),
        qr_code=profile.get("qr_code"),
        created_at=profile.get("created_at"),
    )
