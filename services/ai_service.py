from openai import OpenAI, OpenAIError
from config.settings import OPENAI_API_KEY
from typing import List, Dict, AsyncGenerator
import logging

logger = logging.getLogger("devmate")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_response(prompt: str) -> str:
    """Non‑streaming call with error handling."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except OpenAIError as e:
        logger.error(f"OpenAI API error: {e}")
        return "⚠️ AI service is temporarily unavailable. Please try again later."
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return "⚠️ Something went wrong. Please try again."

async def stream_response(messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
    """
    Yields tokens from a streaming completion.
    On error, yields an error message as a final chunk.
    """
    try:
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            stream=True
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    except OpenAIError as e:
        logger.error(f"Stream error: {e}")
        yield "\n\n⚠️ AI service interrupted. Please try again."
    except Exception as e:
        logger.error(f"Unexpected stream error: {e}")
        yield "\n\n⚠️ Something went wrong."
