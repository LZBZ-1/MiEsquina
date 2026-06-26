import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from supabase_client import get_public_storage_url, get_supabase

router = APIRouter(prefix="/api/upload", tags=["upload"])

BUCKET_NAME = "trabajadores-fotos"


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_photo(file: UploadFile = File(...)):
    supabase = get_supabase()

    # Validar tipo de archivo
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG and WEBP are allowed.",
        )

    # Validar tamaño (máx 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB.",
        )

    # Generar nombre único
    extension = file.filename.split(".")[-1] if "." in file.filename else "png"
    unique_name = f"{uuid.uuid4()}.{extension}"
    path = f"uploads/{unique_name}"

    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=path,
            file=contents,
            file_options={"content-type": file.content_type, "upsert": "true"},
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload error: {exc}",
        )

    public_url = get_public_storage_url(BUCKET_NAME, path)
    return {"url": public_url}
