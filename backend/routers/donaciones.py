from fastapi import APIRouter, HTTPException, status

from models import DonacionCreate, DonacionResponse
from supabase_client import get_supabase

router = APIRouter(prefix="/api/donaciones", tags=["donaciones"])

COMISIONES = {
    "tarjeta_nacional": 0.0344,
    "tarjeta_internacional": 0.0399,
    "yape": 0.0344,
    "cuotealo_bcp": 0.0399,
    "pago_efectivo": 0.0399,
}

COMISION_FIJA_USD = 0.20
TIPO_CAMBIO_PEN = 3.70


async def _mock_culqi_charge(token: str, monto: float):
    """Mock de la API de Culqi"""
    if token.startswith("tok_fail_"):
        raise Exception("Culqi charge failed")
    return {
        "id": f"char_{token[-10:]}",
        "estado": "exitoso",
        "monto": monto,
    }


@router.post("", response_model=DonacionResponse)
async def crear_donacion(body: DonacionCreate):
    supabase = get_supabase()

    # Validar que trabajador existe
    try:
        worker = (
            supabase.table("trabajadores")
            .select("id")
            .eq("id", body.trabajador_id)
            .single()
            .execute()
        )
        if not worker.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trabajador not found",
            )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trabajador not found",
        )

    # Calcular comisión
    comision_pct = COMISIONES.get(body.metodo_pago, 0.0344)
    comision_fija_pen = COMISION_FIJA_USD * TIPO_CAMBIO_PEN

    if body.monto <= 3:
        monto_final = body.monto
        comision_total = 0.0
    else:
        comision_variable = body.monto * comision_pct
        comision_total = comision_variable + comision_fija_pen
        monto_final = body.monto - comision_total

    # Mock: procesar cargo Culqi
    try:
        culqi_resp = await _mock_culqi_charge(body.token_culqi, body.monto)
    except Exception as exc:
        # Guardar donación fallida
        try:
            supabase.table("donaciones").insert(
                {
                    "trabajador_id": body.trabajador_id,
                    "monto": body.monto,
                    "metodo_pago": body.metodo_pago,
                    "estado": "fallido",
                }
            ).execute()
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment processing failed: {exc}",
        )

    # Guardar donación exitosa
    try:
        result = (
            supabase.table("donaciones")
            .insert(
                {
                    "trabajador_id": body.trabajador_id,
                    "monto": body.monto,
                    "metodo_pago": body.metodo_pago,
                    "estado": "exitoso",
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

    return DonacionResponse(
        id=data["id"],
        trabajador_id=data["trabajador_id"],
        monto=body.monto,
        monto_final=round(monto_final, 2),
        comision=round(comision_total, 2),
        metodo_pago=data["metodo_pago"],
        estado=data["estado"],
        created_at=data.get("created_at"),
    )
