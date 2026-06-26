import jwt
from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

TEST_JWT_SECRET = "test-jwt-secret-for-tests"


def _make_token(sub="test-uuid-1234"):
    return jwt.encode(
        {"sub": sub, "aud": "authenticated"},
        TEST_JWT_SECRET,
        algorithm="HS256",
    )


def test_iniciar_jornada_success():
    mock = MagicMock()
    # No hay jornada activa
    mock.table.return_value.select.return_value.eq.return_value.is_.return_value.execute.return_value = MagicMock(
        data=[]
    )
    # Insert jornada
    mock.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=[
            {
                "id": "jornada-1",
                "trabajador_id": "test-uuid-1234",
                "interseccion": "Av. Arequipa con Jr. Carabaya",
                "inicio": "2024-01-01T08:00:00Z",
                "fin": None,
                "ingreso_estimado": None,
                "created_at": "2024-01-01T08:00:00Z",
            }
        ]
    )

    with patch("routers.jornadas.get_supabase", return_value=mock):
        response = client.post(
            "/api/jornadas/iniciar",
            json={"interseccion": "Av. Arequipa con Jr. Carabaya"},
            headers={"Authorization": f"Bearer {_make_token()}"},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["trabajador_id"] == "test-uuid-1234"
    assert data["interseccion"] == "Av. Arequipa con Jr. Carabaya"
    assert data["fin"] is None


def test_iniciar_jornada_activa_existente():
    mock = MagicMock()
    # Hay jornada activa
    mock.table.return_value.select.return_value.eq.return_value.is_.return_value.execute.return_value = MagicMock(
        data=[{"id": "jornada-active"}]
    )

    with patch("routers.jornadas.get_supabase", return_value=mock):
        response = client.post(
            "/api/jornadas/iniciar",
            json={"interseccion": "Av. Arequipa con Jr. Carabaya"},
            headers={"Authorization": f"Bearer {_make_token()}"},
        )

    assert response.status_code == 400
    assert response.json()["detail"] == "Ya existe una jornada activa"


def test_iniciar_jornada_sin_auth():
    response = client.post(
        "/api/jornadas/iniciar",
        json={"interseccion": "Av. Arequipa con Jr. Carabaya"},
    )
    assert response.status_code == 403


def test_finalizar_jornada_success():
    mock = MagicMock()
    # Jornada activa encontrada
    mock.table.return_value.select.return_value.eq.return_value.is_.return_value.single.return_value.execute.return_value = MagicMock(
        data={
            "id": "jornada-1",
            "trabajador_id": "test-uuid-1234",
            "interseccion": "Av. Arequipa con Jr. Carabaya",
            "inicio": "2024-01-01T08:00:00Z",
            "fin": None,
        }
    )
    # Update jornada
    mock.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(
        data=[
            {
                "id": "jornada-1",
                "trabajador_id": "test-uuid-1234",
                "interseccion": "Av. Arequipa con Jr. Carabaya",
                "inicio": "2024-01-01T08:00:00Z",
                "fin": "2024-01-01T18:00:00Z",
                "created_at": "2024-01-01T08:00:00Z",
            }
        ]
    )

    with patch("routers.jornadas.get_supabase", return_value=mock):
        response = client.post(
            "/api/jornadas/finalizar",
            headers={"Authorization": f"Bearer {_make_token()}"},
        )

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "jornada-1"
    assert data["fin"] is not None


def test_finalizar_jornada_no_activa():
    mock = MagicMock()
    mock.table.return_value.select.return_value.eq.return_value.is_.return_value.single.return_value.execute.side_effect = Exception(
        "Not found"
    )

    with patch("routers.jornadas.get_supabase", return_value=mock):
        response = client.post(
            "/api/jornadas/finalizar",
            headers={"Authorization": f"Bearer {_make_token()}"},
        )

    assert response.status_code == 404
    assert response.json()["detail"] == "No hay jornada activa para finalizar"
