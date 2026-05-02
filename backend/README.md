# DevMate AI Backend

A production-ready FastAPI backend for an AI-powered developer assistant with advanced features including rate limiting, conversation memory, streaming responses, and comprehensive error handling.

## Features

- **AI-Powered Responses**: Integration with OpenAI's GPT-4o-mini model
- **Rate Limiting**: 10 requests per minute per IP using SlowAPI
- **Conversation Memory**: Stores last 10 messages per session for context-aware responses
- **Streaming Responses**: Real-time token streaming for chat-like experience
- **Error Handling**: Graceful handling of API failures and network issues
- **Request Logging**: Comprehensive logging with timing information
- **CORS Support**: Ready for frontend integration
- **Auto Documentation**: Interactive Swagger/OpenAPI docs at `/docs`

## Project Structure

```
backend/
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (create this)
├── .gitignore              # Git ignore file
├── README.md               # This file
├── config/
│   └── settings.py         # Configuration and environment variables
├── models/
│   └── schemas.py          # Pydantic models for request validation
├── services/
│   └── ai_service.py       # OpenAI integration with streaming and error handling
├── routes/
│   ├── chat.py            # General chat endpoints
│   ├── explain.py         # Code explanation endpoints
│   └── fix_error.py       # Error debugging endpoints
└── utils/
    ├── logger.py          # Logging configuration
    └── memory.py          # Conversation memory management
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your-actual-openai-api-key-here
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

### 3. Run the Application

```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`.

## API Endpoints

### Base Endpoints
- `GET /` - Health check endpoint
- `GET /docs` - Interactive API documentation

### Chat Endpoints
- `POST /chat` - General AI assistant chat
- `POST /chat/stream` - Streaming chat responses

### Code Explanation Endpoints
- `POST /explain` - Explain code in simple terms
- `POST /explain/stream` - Streaming code explanation

### Error Fixing Endpoints
- `POST /fix-error` - Analyze and suggest fixes for errors
- `POST /fix-error/stream` - Streaming error analysis

## Request Format

All endpoints accept JSON with the following format:

```json
{
  "message": "Your message here",
  "session_id": "optional-session-identifier"
}
```

You can also provide a session ID via the `x-session-id` header.

## Session Management

- Sessions are automatically created and managed
- Each session maintains the last 10 messages for context
- Use the same session ID across requests for continuous conversations
- Default session ID is "default" if none provided

## Streaming Responses

Streaming endpoints provide real-time token-by-token responses:

```bash
curl -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -H "x-session-id: my-session" \
  -d '{"message": "Hello, explain Python decorators"}'
```

## Rate Limiting

- 10 requests per minute per IP address
- Exceeding limits returns HTTP 429 Too Many Requests
- Rate limits are applied to all endpoints

## Error Handling

The API gracefully handles:
- OpenAI API errors (rate limits, service unavailability)
- Network connectivity issues
- Invalid request formats
- Missing API keys

Error responses include user-friendly messages and proper HTTP status codes.

## Logging

All requests are logged with:
- Timestamp
- Endpoint
- Session ID
- Response time
- Error details (if applicable)

## Development

### Adding New Endpoints

1. Create a new route file in `routes/`
2. Follow the existing pattern with rate limiting, logging, and memory
3. Import and include the router in `main.py`

### Customizing AI Prompts

Modify the system prompts in each route file to change AI behavior:
- `chat.py` - General assistant behavior
- `explain.py` - Code tutoring style
- `fix_error.py` - Debugging approach

### Memory Configuration

Adjust `MAX_HISTORY` in `utils/memory.py` to change conversation length.

## Production Deployment

For production deployment:

1. Set `OPENAI_API_KEY` as an environment variable
2. Configure appropriate CORS origins instead of `"*"`
3. Use a production ASGI server like Gunicorn with Uvicorn workers
4. Set up proper logging and monitoring
5. Consider using Redis for persistent session storage

## License

This project is open source and available under the MIT License.
