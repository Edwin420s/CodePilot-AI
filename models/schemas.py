from pydantic import BaseModel
from typing import Optional

class RequestModel(BaseModel):
    message: str
    session_id: Optional[str] = None   # frontend can pass it; also expects it in headers for memory
