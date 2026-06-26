import io
import os
import uuid

import jwt
import qrcode
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from models import AuthResponse, UserLogin, UserProfile, UserRegister
from supabase_client import get_public_storage_url, get_supabase

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
QR_BUCKET = "trabajadores-fotos"
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


def _generate_qr_image(trabajador_id: str) -> bytes:
    url = f"{FRONTEND_URL}/donar/{trabajador_id}"
    img = qrcode.make(url)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(body: UserRegister):
    supabase = get_supabase()

    try:
        auth_resp = supabase.auth.admin.create_user(
            {
                "email": str(body.email),
                "password": body.password,
                "email_confirm": True,
                "user_metadata": {
                    "nombre": body.nombre,
                    "telefono": body.telefono,
                },
            }
        )
    except Exception as exc:
        msg = str(exc).lower()
        if any(
            phrase in msg
            for phrase in ("already registered", "already exists", "unique constraint")
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="User already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Auth error: {exc}"
        )

    user = auth_resp.user if hasattr(auth_resp, "user") else auth_resp
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to create user"
        )

    user_id = str(user.id)
    qr_path = f"qrs/{user_id}.png"

    try:
        qr_bytes = _generate_qr_image(user_id)
        supabase.storage.from_(QR_BUCKET).upload(
            path=qr_path,
            file=qr_bytes,
            file_options={"content-type": "image/png", "upsert": "true"},
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"QR generation error: {exc}",
        )

    qr_url = get_public_storage_url(QR_BUCKET, qr_path)

    try:
        supabase.table("trabajadores").insert(
            {
                "id": user_id,
                "nombre": body.nombre,
                "foto_url": body.foto_url,
                "telefono": body.telefono,
                "qr_code": qr_url,
            }
        ).execute()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database error: {exc}",
        )

    try:
        session_resp = supabase.auth.sign_in_with_password(
            {"email": str(body.email), "password": body.password}
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Login error after registration: {exc}",
        )

    session = session_resp.session

    return AuthResponse(
        access_token=session.access_token,
        refresh_token=session.refresh_token,
        expires_in=getattr(session, "expires_in", 3600),
        user=UserProfile(
            id=user_id,
            email=str(body.email),
            nombre=body.nombre,
            telefono=body.telefono,
            foto_url=body.foto_url,
            qr_code=qr_url,
            created_at=None,
        ),
    )


@router.post("/login", response_model=AuthResponse)
async def login(body: UserLogin):
    supabase = get_supabase()

    try:
        session_resp = supabase.auth.sign_in_with_password(
            {"email": str(body.email), "password": body.password}
        )
    except Exception as exc:
        msg = str(exc).lower()
        if "invalid login credentials" in msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"Auth error: {exc}"
        )

    session = session_resp.session
    user = session_resp.user

    profile = None
    try:
        db_resp = (
            supabase.table("trabajadores")
            .select("*")
            .eq("id", str(user.id))
            .single()
            .execute()
        )
        profile = db_resp.data
    except Exception:
        pass

    user_meta = getattr(user, "user_metadata", {}) or {}

    return AuthResponse(
        access_token=session.access_token,
        refresh_token=session.refresh_token,
        expires_in=getattr(session, "expires_in", 3600),
        user=UserProfile(
            id=str(user.id),
            email=user.email or str(body.email),
            nombre=profile["nombre"] if profile else user_meta.get("nombre", ""),
            telefono=profile["telefono"] if profile else user_meta.get("telefono"),
            foto_url=profile["foto_url"] if profile else None,
            qr_code=profile["qr_code"] if profile else None,
            created_at=profile["created_at"] if profile else None,
        ),
    )


@router.get("/me", response_model=UserProfile)
async def me(user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user.get("sub")

    profile = None
    try:
        db_resp = (
            supabase.table("trabajadores")
            .select("*")
            .eq("id", user_id)
            .single()
            .execute()
        )
        profile = db_resp.data
    except Exception:
        pass

    return UserProfile(
        id=user_id,
        email=user.get("email", ""),
        nombre=profile["nombre"] if profile else user.get("user_metadata", {}).get("nombre", ""),
        telefono=profile["telefono"] if profile else user.get("user_metadata", {}).get("telefono"),
        foto_url=profile["foto_url"] if profile else None,
        qr_code=profile["qr_code"] if profile else None,
        created_at=profile["created_at"] if profile else None,
    )
