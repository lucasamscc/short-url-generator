import secrets
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from database import get_redis_client
from schemas import URLCreate, URLResponse

app = FastAPI(title="URL Shortener API")

# Setup CORS para permitir acesso do React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = get_redis_client()

def generate_short_code(length: int = 6) -> str:
    """Gera um código curto aleatório."""
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    return "".join(secrets.choice(chars) for _ in range(length))

@app.post("/api/shorten", response_model=URLResponse)
def shorten_url(url_data: URLCreate):
    for _ in range(10):
        short_code = generate_short_code()
        if not redis_client.exists(short_code):
            break
    else:
        raise HTTPException(status_code=500, detail="Não foi possível gerar um código único.")
    
    # Calcular TTL em segundos (horas * 3600)
    ttl_seconds = url_data.expiration_hours * 3600
    
    original_url = str(url_data.url)
    
    # Salvar no Redis
    try:
        redis_client.setex(name=short_code, time=ttl_seconds, value=original_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar com banco de dados: {str(e)}")
    
    # A URL curta gerada será a base da API + short_code.
    return URLResponse(
        short_url=short_code,
        original_url=original_url,
        expiration_hours=url_data.expiration_hours
    )

@app.get("/{short_code}")
def redirect_to_original(short_code: str):
    """Redireciona para a URL original com base no código curto."""
    try:
        original_url = redis_client.get(short_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar com banco de dados: {str(e)}")

    if original_url:
        return RedirectResponse(url=original_url, status_code=307)
    
    raise HTTPException(status_code=404, detail="URL não encontrada ou expirada")
