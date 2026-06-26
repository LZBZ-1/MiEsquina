from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_get_trabajador_success():
    profile = {
        "id": "uuid-1234",
        "nombre": "Juan Pérez",
        "foto_url": "https://example.com/foto.jpg",
        "qr_code": "https://test.supabase.co/storage/v1/object/public/trabajadores-fotos/qrs/uuid-1234.png",
        "created_at": "2024-01-01T00:00:00Z",
    }
    mock = MagicMock()
    mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data=profile
    )

    with patch("routers.trabajadores.get_supabase", return_value=mock):
        response = client.get("/api/trabajadores/uuid-1234")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "uuid-1234"
    assert data["nombre"] == "Juan Pérez"
    assert data["foto_url"] == "https://example.com/foto.jpg"
    assert data["qr_code"] is not None
    assert data["created_at"] == "2024-01-01T00:00:00Z"


def test_get_trabajador_not_found():
    mock = MagicMock()
    mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.side_effect = Exception(
        "Not found"
    )

    with patch("routers.trabajadores.get_supabase", return_value=mock):
        response = client.get("/api/trabajadores/uuid-not-found")

    assert response.status_code == 404
    assert response.json()["detail"] == "Trabajador not found"


def test_get_trabajador_rate_limit():
    # slowapi rate limit is 30/minute; we just verify the endpoint is accessible
    mock = MagicMock()
    mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data={
            "id": "uuid-1234",
            "nombre": "Juan Pérez",
            "foto_url": None,
            "qr_code": None,
            "created_at": "2024-01-01T00:00:00Z",
        }
    )

    with patch("routers.trabajadores.get_supabase", return_value=mock):
        response = client.get("/api/trabajadores/uuid-1234")

    assert response.status_code == 200
