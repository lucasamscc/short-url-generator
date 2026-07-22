from pydantic import BaseModel, HttpUrl
from typing import Optional

class URLCreate(BaseModel):
    url: HttpUrl
    expiration_hours: Optional[int] = 24 # Padrão: 24 horas

class URLResponse(BaseModel):
    short_url: str
    original_url: str
    expiration_hours: Optional[int] = None
