from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app
import pytest

client = TestClient(app)

@pytest.fixture
def mock_redis():
    with patch("main.redis_client") as mock:
        yield mock

def test_shorten_url_success(mock_redis):
    # Mock do Redis
    mock_redis.exists.return_value = False
    
    response = client.post(
        "/api/shorten",
        json={"url": "https://www.google.com", "expiration_hours": 24}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "short_url" in data
    assert len(data["short_url"]) == 6
    assert data["original_url"] == "https://www.google.com/"
    assert data["expiration_hours"] == 24
    
    # Verifica se o método setex foi chamado com os argumentos corretos
    mock_redis.setex.assert_called_once()
    args, kwargs = mock_redis.setex.call_args
    assert kwargs["time"] == 24 * 3600
    assert kwargs["value"] == "https://www.google.com/"

def test_redirect_to_original_success(mock_redis):
    # Mockando que a URL existe no Redis
    mock_redis.get.return_value = "https://www.google.com/"
    
    # Importante: não seguir redirects no TestClient para verificar o status 307
    response = client.get("/abcdef", follow_redirects=False)
    
    assert response.status_code == 307
    assert response.headers["location"] == "https://www.google.com/"
    mock_redis.get.assert_called_once_with("abcdef")

def test_redirect_to_original_not_found(mock_redis):
    # Mockando que a URL não existe no Redis
    mock_redis.get.return_value = None
    
    response = client.get("/notfnd")
    
    assert response.status_code == 404
    assert response.json() == {"detail": "URL não encontrada ou expirada"}

def test_shorten_url_invalid_input():
    # URL inválida
    response = client.post(
        "/api/shorten",
        json={"url": "not-a-valid-url"}
    )
    assert response.status_code == 422
