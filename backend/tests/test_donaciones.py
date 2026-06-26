from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_donacion_success_comision():
    mock = MagicMock()
    # Trabajador existe
    mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data={"id": "worker-1"}
    )
    # Insert donacion
    mock.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=[
            {
                "id": "donacion-1",
                "trabajador_id": "worker-1",
                "monto": 50.0,
                "metodo_pago": "tarjeta_nacional",
                "estado": "exitoso",
                "created_at": "2024-01-01T10:00:00Z",
            }
        ]
    )

    with patch("routers.donaciones.get_supabase", return_value=mock):
        response = client.post(
            "/api/donaciones",
            json={
                "trabajador_id": "worker-1",
                "monto": 50.0,
                "metodo_pago": "tarjeta_nacional",
                "token_culqi": "tok_test_1234567890",
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert data["trabajador_id"] == "worker-1"
    assert data["monto"] == 50.0
    assert data["estado"] == "exitoso"
    # Comisión: 50 * 0.0344 + 0.20 * 3.70 = 1.72 + 0.74 = 2.46
    assert data["comision"] > 0
    assert data["monto_final"] == round(50.0 - data["comision"], 2)


def test_donacion_success_sin_comision_menor_3():
    mock = MagicMock()
    mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data={"id": "worker-1"}
    )
    mock.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=[
            {
                "id": "donacion-2",
                "trabajador_id": "worker-1",
                "monto": 2.5,
                "metodo_pago": "yape",
                "estado": "exitoso",
                "created_at": "2024-01-01T10:00:00Z",
            }
        ]
    )

    with patch("routers.donaciones.get_supabase", return_value=mock):
        response = client.post(
            "/api/donaciones",
            json={
                "trabajador_id": "worker-1",
                "monto": 2.5,
                "metodo_pago": "yape",
                "token_culqi": "tok_test_1234567890",
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert data["monto"] == 2.5
    assert data["comision"] == 0.0
    assert data["monto_final"] == 2.5


def test_donacion_trabajador_no_existe():
    mock = MagicMock()
    mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.side_effect = Exception(
        "Not found"
    )

    with patch("routers.donaciones.get_supabase", return_value=mock):
        response = client.post(
            "/api/donaciones",
            json={
                "trabajador_id": "worker-not-found",
                "monto": 50.0,
                "metodo_pago": "tarjeta_nacional",
                "token_culqi": "tok_test_1234567890",
            },
        )

    assert response.status_code == 404
    assert response.json()["detail"] == "Trabajador not found"


def test_donacion_culqi_falla():
    mock = MagicMock()
    mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data={"id": "worker-1"}
    )
    mock.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=None
    )

    with patch("routers.donaciones.get_supabase", return_value=mock):
        response = client.post(
            "/api/donaciones",
            json={
                "trabajador_id": "worker-1",
                "monto": 50.0,
                "metodo_pago": "tarjeta_nacional",
                "token_culqi": "tok_fail_1234567890",
            },
        )

    assert response.status_code == 400
    assert "Payment processing failed" in response.json()["detail"]


def test_donacion_metodo_pago_invalido():
    response = client.post(
        "/api/donaciones",
        json={
            "trabajador_id": "worker-1",
            "monto": 50.0,
            "metodo_pago": "bitcoin",
            "token_culqi": "tok_test_1234567890",
        },
    )

    assert response.status_code == 422


def test_donacion_monto_invalido():
    response = client.post(
        "/api/donaciones",
        json={
            "trabajador_id": "worker-1",
            "monto": -10.0,
            "metodo_pago": "tarjeta_nacional",
            "token_culqi": "tok_test_1234567890",
        },
    )

    assert response.status_code == 422
