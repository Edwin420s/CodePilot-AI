from fastapi import APIRouter, Header, HTTPException, Request
from fastapi.responses import StreamingResponse
from models.schemas import RequestModel
from services.ai_service import generate_response, stream_response
from utils.memory import add_message, get_history
from utils.logger import setup_logger
from openai import OpenAI
import time
from slowapi import Limiter
from slowapi.util import get_remote_address
from config.settings import OPENAI_API_KEY

limiter = Limiter(key_func=get_remote_address)
logger = setup_logger()
router = APIRouter()
client = OpenAI(api_key=OPENAI_API_KEY)

DEFAULT_SESSION = "default"

@router.post("/chat")
@limiter.limit("10/minute")
async def chat(
    request: Request,
    data: RequestModel,
    x_session_id: str = Header(default=DEFAULT_SESSION)
):
    start = time.time()
    session_id = data.session_id or x_session_id

    # Build system prompt
    system_prompt = "You are a helpful AI assistant for developers. Answer clearly and concisely."

    # Retrieve conversation history and add user message
    history = get_history(session_id)
    add_message(session_id, "user", data.message)

    # Compose messages: system + history + current user
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)
    messages.append({"role": "user", "content": data.message})

    # Call AI with full context
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages
        )
        response_text = response.choices[0].message.content
    except Exception as e:
        logger.error(f"AI error: {e}")
        response_text = "AI service is temporarily unavailable. Please try again later."

    add_message(session_id, "assistant", response_text)

    elapsed = time.time() - start
    logger.info(f"POST /chat | session={session_id} | time={elapsed:.2f}s")
    return {"response": response_text, "session_id": session_id}


@router.post("/chat/stream")
@limiter.limit("10/minute")
async def chat_stream(
    request: Request,
    data: RequestModel,
    x_session_id: str = Header(default=DEFAULT_SESSION)
):
    session_id = data.session_id or x_session_id
    system_prompt = "You are a helpful AI assistant for developers. Answer clearly and concisely."

    history = get_history(session_id)
    add_message(session_id, "user", data.message)

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)
    messages.append({"role": "user", "content": data.message})

    # We'll collect the complete response in memory for memory storage
    collected = ""

    async def wrapper():
        nonlocal collected
        async for token in stream_response(messages):
            collected += token
            yield token
        add_message(session_id, "assistant", collected)
        logger.info(f"Stream completed for session {session_id}")

    return StreamingResponse(wrapper(), media_type="text/plain")
