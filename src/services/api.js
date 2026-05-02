import axios from "axios";

const BASE_URL = "http://localhost:8000";

// Non‑streaming (fallback)
export async function sendMessage(mode, message, sessionId) {
  const res = await axios.post(`${BASE_URL}/${mode}`, {
    message,
    session_id: sessionId,
  }, {
    headers: {
      "Content-Type": "application/json",
      "x-session-id": sessionId,
    },
  });
  return res.data.response;
}

// Streaming using fetch + ReadableStream
export async function sendStreamMessage(
  mode,
  message,
  sessionId,
  onChunk,   // callback for each text chunk
  onDone,    // callback when stream ends
  onError    // callback for errors
) {
  try {
    const response = await fetch(`${BASE_URL}/${mode}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": sessionId,
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }

    onDone();
  } catch (error) {
    onError(error);
  }
}
