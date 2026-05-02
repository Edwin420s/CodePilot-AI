from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from routes import chat, explain, fix_error
from utils.logger import setup_logger

logger = setup_logger()

app = FastAPI(
    title="DevMate AI",
    description="Backend API for the DevMate AI Developer Assistant (upgraded)",
    version="2.0.0"
)

# Rate limiter setup
app.state.limiter = None  # will be set by SlowAPIMiddleware
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, tags=["Chat"])
app.include_router(explain.router, tags=["Explain"])
app.include_router(fix_error.router, tags=["Fix Error"])

@app.on_event("startup")
async def startup():
    logger.info("DevMate AI backend started")

@app.get("/")
def root():
    return {"message": "DevMate AI Backend v2.0 is running"}
