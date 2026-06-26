from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def _make_mock_supabase(
    user_id="test-uuid-1234",
    email="juan@test.com",
    access_token="access_token_123",
    refresh_token="refresh_token_123",
    expires_in=3600,
    profile=None,
    create_user_side_effect=None,
    sign_in_side_effect=None,
):
    mock = MagicMock()

    # Mock auth.admin.create_user
    mock_user = MagicMock()
    mock_user.id = user_id
    mock_auth_resp = MagicMock()
    mock_auth_resp.user = mock_user

    if create_user_side_effect:
        mock.auth.admin.create_user.side_effect = create_user_side_effect
    else:
        mock.auth.admin.create_user.return_value = mock_auth_resp

    # Mock table operations
    if profile is not None:
        mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
            data=profile
        )
    else:
        mock.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
            data=None
        )

    mock.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=None
    )

    # Mock auth.sign_in_with_password
    mock_session = MagicMock()
    mock_session.access_token = access_token
    mock_session.refresh_token = refresh_token
    mock_session.expires_in = expires_in

    mock_signin_user = MagicMock()
    mock_signin_user.id = user_id
    mock_signin_user.email = email
    mock_signin_user.user_metadata = {}

    mock_signin_resp = MagicMock()
    mock_signin_resp.session = mock_session
    mock_signin_resp.user = mock_signin_user

    if sign_in_side_effect:
        mock.auth.sign_in_with_password.side_effect = sign_in_side_effect
    else:
        mock.auth.sign_in_with_password.return_value = mock_signin_resp

    return mock


def test_register_success():
    mock = _make_mock_supabase()

    with patch("routers.auth.get_supabase", return_value=mock):
        response = client.post(
            "/api/auth/register",
            json={
                "nombre": "Juan Pérez",
                "email": "juan@test.com",
                "password": "secret123",
                "telefono": "123456789",
                "foto_url": "https://example.com/foto.jpg",
            },
        )

    assert response.status_code == 201
    data = response.json()
    assert data["access_token"] == "access_token_123"
    assert data["refresh_token"] == "refresh_token_123"
    assert data["expires_in"] == 3600
    assert data["user"]["email"] == "juan@test.com"
    assert data["user"]["nombre"] == "Juan Pérez"
    assert data["user"]["qr_code"] is not None
    assert data["user"]["foto_url"] == "https://example.com/foto.jpg"


def test_register_user_already_exists():
    mock = _make_mock_supabase(
        create_user_side_effect=Exception("User already registered")
    )

    with patch("routers.auth.get_supabase", return_value=mock):
        response = client.post(
            "/api/auth/register",
            json={
                "nombre": "Juan Pérez",
                "email": "juan@test.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 409
    assert response.json()["detail"] == "User already exists"


def test_register_bad_request():
    mock = _make_mock_supabase(
        create_user_side_effect=Exception("Some random auth error")
    )

    with patch("routers.auth.get_supabase", return_value=mock):
        response = client.post(
            "/api/auth/register",
            json={
                "nombre": "Juan Pérez",
                "email": "juan@test.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 400
    assert "Auth error" in response.json()["detail"]


def test_register_validation_error():
    response = client.post(
        "/api/auth/register",
        json={
            "nombre": "",
            "email": "not-an-email",
            "password": "123",
        },
    )

    assert response.status_code == 422


def test_login_success():
    profile = {
        "nombre": "Juan Pérez",
        "telefono": "123456789",
        "foto_url": "https://example.com/foto.jpg",
        "qr_code": "qr-123",
        "created_at": "2024-01-01T00:00:00Z",
    }
    mock = _make_mock_supabase(profile=profile)

    with patch("routers.auth.get_supabase", return_value=mock):
        response = client.post(
            "/api/auth/login",
            json={
                "email": "juan@test.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert data["access_token"] == "access_token_123"
    assert data["refresh_token"] == "refresh_token_123"
    assert data["expires_in"] == 3600
    assert data["user"]["email"] == "juan@test.com"
    assert data["user"]["nombre"] == "Juan Pérez"
    assert data["user"]["qr_code"] == "qr-123"
    assert data["user"]["created_at"] == "2024-01-01T00:00:00Z"


def test_login_invalid_credentials():
    mock = _make_mock_supabase(
        sign_in_side_effect=Exception("Invalid login credentials")
    )

    with patch("routers.auth.get_supabase", return_value=mock):
        response = client.post(
            "/api/auth/login",
            json={
                "email": "juan@test.com",
                "password": "wrongpass",
            },
        )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_login_bad_request():
    mock = _make_mock_supabase(
        sign_in_side_effect=Exception("Some other error")
    )

    with patch("routers.auth.get_supabase", return_value=mock):
        response = client.post(
            "/api/auth/login",
            json={
                "email": "juan@test.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 400
    assert "Auth error" in response.json()["detail"]


def test_login_validation_error():
    response = client.post(
        "/api/auth/login",
        json={
            "email": "not-an-email",
            "password": "",
        },
    )

    assert response.status_code == 422
