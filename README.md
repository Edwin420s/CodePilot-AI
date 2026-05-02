# DevMate AI

A complete AI-powered developer assistant with both backend and frontend components, featuring real-time streaming responses, conversation memory, and a professional dark UI.

## 🚀 Project Overview

DevMate AI is a full-stack application that provides intelligent assistance for developers through three specialized modes:
- **General Chat**: Ask any development-related questions
- **Code Explanation**: Get detailed explanations of code snippets
- **Error Fixing**: Receive debugging assistance for errors

### ✨ Key Features

- **Real-time Streaming**: Watch AI responses appear token by token
- **Conversation Memory**: Maintains context across messages using session IDs
- **Rate Limiting**: 10 requests per minute per IP to prevent abuse
- **Error Handling**: Graceful handling of API failures and network issues
- **Code Formatting**: Automatic syntax highlighting and copy functionality
- **Responsive Design**: Mobile-friendly with collapsible sidebar
- **Dark Theme**: Professional dark navy theme with Tailwind CSS
- **Session Management**: Persistent conversations via localStorage

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI GPT-4o-mini** - AI model for responses
- **SlowAPI** - Rate limiting middleware
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python-dotenv** - Environment variable management

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **UUID** for session management

## 📁 Project Structure

```
DevMate-AI/
├── backend/                    # FastAPI backend
│   ├── main.py                # Application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── config/
│   │   └── settings.py        # Configuration
│   ├── models/
│   │   └── schemas.py         # Pydantic models
│   ├── services/
│   │   └── ai_service.py      # OpenAI integration
│   ├── routes/
│   │   ├── chat.py           # Chat endpoints
│   │   ├── explain.py        # Code explanation endpoints
│   │   └── fix_error.py      # Error fixing endpoints
│   └── utils/
│       ├── logger.py         # Logging configuration
│       └── memory.py         # Conversation memory
├── frontend/                  # React frontend
│   ├── index.html            # HTML entry point
│   ├── package.json          # Dependencies and scripts
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── src/
│   │   ├── main.jsx         # React app entry
│   │   ├── index.css        # Global styles
│   │   ├── App.jsx          # Main application component
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Mode selection sidebar
│   │   │   ├── ChatWindow.jsx # Message display area
│   │   │   ├── MessageBubble.jsx # Individual messages
│   │   │   └── InputBox.jsx  # Message input with streaming
│   │   └── services/
│   │       └── api.js         # API communication
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- OpenAI API key

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your-actual-openai-api-key-here
```

Start the backend server:
```bash
uvicorn main:app --reload
```
Backend runs at: `http://localhost:8000`
API docs available at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to `http://localhost:5173` to start using DevMate AI!

## 📖 Usage Guide

### Mode Selection

1. **General Chat** 💬
   - Ask any development-related questions
   - Get help with programming concepts
   - Receive coding advice and best practices

2. **Explain Code** 📝
   - Paste code snippets for detailed explanations
   - Understand complex algorithms
   - Learn about programming patterns

3. **Fix Error** 🐛
   - Paste error messages for debugging assistance
   - Get solutions to common programming errors
   - Receive step-by-step troubleshooting guidance

### Interface Features

#### Sending Messages
- Type your message in the input box
- Press `Enter` to send (or click the send button)
- Press `Shift + Enter` for a new line
- Watch responses stream in real-time with typing indicators

#### Session Management
- Sessions are automatically created and stored in localStorage
- The same session ID is used across all messages for context awareness
- Clear chat button removes all messages but preserves the session
- Conversation memory maintains the last 10 messages for context

#### Code Features
- Code blocks are automatically detected and formatted with syntax highlighting
- Hover over code blocks to see the copy button
- Click the copy button to copy code to clipboard
- Code is displayed in a dark theme with green syntax highlighting

#### Responsive Design
- **Desktop**: Fixed sidebar with full chat interface
- **Mobile**: Collapsible sidebar with hamburger menu
- **Tablet**: Adaptive layout based on screen size

## 🔌 API Documentation

### Backend Endpoints

The FastAPI backend provides the following endpoints:

#### Chat Endpoints
- `POST /chat` - Non-streaming chat responses
- `POST /chat/stream` - Streaming chat responses

#### Code Explanation Endpoints
- `POST /explain` - Non-streaming code explanations
- `POST /explain/stream` - Streaming code explanations

#### Error Fixing Endpoints
- `POST /fix-error` - Non-streaming error analysis
- `POST /fix-error/stream` - Streaming error analysis

#### Utility Endpoints
- `GET /` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)

### Request Format

All POST endpoints accept JSON with the following format:

```json
{
  "message": "Your message here",
  "session_id": "optional-session-identifier"
}
```

You can also provide a session ID via the `x-session-id` header.

### Rate Limiting

- **Limit**: 10 requests per minute per IP address
- **Response**: HTTP 429 Too Many Requests when exceeded
- **Purpose**: Prevents abuse and ensures fair usage

### Streaming Implementation

The frontend uses the Fetch API with ReadableStream for real-time response streaming:

```javascript
const response = await fetch(`${BASE_URL}/${mode}/stream`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-session-id": sessionId,
  },
  body: JSON.stringify({ message, session_id: sessionId }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder("utf-8");

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value, { stream: true });
  onChunk(chunk); // Update UI in real-time
}
```

## 🛡️ Error Handling

### Backend Error Handling

The backend gracefully handles:
- **OpenAI API errors** (rate limits, service unavailability)
- **Network connectivity issues**
- **Invalid request formats**
- **Missing API keys**

### Frontend Error Handling

The frontend gracefully handles:
- **Network connectivity issues**
- **API rate limiting (429 responses)**
- **Server errors (5xx responses)**
- **Invalid API responses**
- **Streaming interruptions**

Error messages are displayed directly in the chat interface with clear indicators.

## ⚡ Performance Optimizations

### Backend Optimizations
- **Rate Limiting**: Prevents abuse with SlowAPI middleware
- **Efficient Logging**: Structured logging with response times
- **Memory Management**: In-memory session storage with automatic cleanup
- **Error Handling**: Graceful degradation on API failures

### Frontend Optimizations
- **Component Memoization**: Prevents unnecessary re-renders with React hooks
- **Efficient State Management**: Optimized useState and useEffect usage
- **Lazy Loading**: Components load as needed
- **Optimized Streaming**: Efficient text decoding and rendering
- **Auto-resizing Textarea**: Dynamic height adjustment for input

## 🛠️ Development Guide

### Adding New Modes

1. **Backend**: Create new route file in `backend/routes/`
2. **Frontend**: Update the `modes` array in `Sidebar.jsx`
3. **API**: Add corresponding endpoints to `frontend/src/services/api.js`
4. **UI**: Update placeholder text in `InputBox.jsx`

### Customizing Styling

Modify `frontend/tailwind.config.js` to adjust the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      dark: "#0B1120",           // Main background
      darkSecondary: "#111827",    // Secondary background
      card: "#1F2937",           // Card backgrounds
      border: "#374151",          // Borders and dividers
      primary: "#3B82F6",         // Primary accent color
    },
  },
}
```

### Environment Configuration

For production deployment:
1. **Backend**: Set `OPENAI_API_KEY` as environment variable
2. **Frontend**: Update the `BASE_URL` in `src/services/api.js` to point to your live backend URL
3. **CORS**: Configure appropriate CORS origins in backend

## 🚀 Deployment

### Backend Deployment

Deploy to platforms like Render, Railway, or Heroku:

```bash
# Example for Render
# Connect your GitHub repository
# Set environment variable: OPENAI_API_KEY
# Build command: pip install -r requirements.txt
# Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Deploy the dist/ folder
```

### Docker Deployment

Create a `Dockerfile` for containerized deployment:

```dockerfile
# Backend Dockerfile example
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Logging and Monitoring

### Backend Logging
All requests are logged with:
- Timestamp
- Endpoint
- Session ID
- Response time
- Error details (if applicable)

### Monitoring
Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session recording
- **Google Analytics** for usage metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (both backend and frontend)
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT-4o-mini model
- **FastAPI** for the modern Python web framework
- **React** for the frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the fast development build tool

## 📞 Support

If you encounter any issues or have questions:

1. Check the [API documentation](http://localhost:8000/docs) when backend is running
2. Review the troubleshooting section below
3. Open an issue on GitHub

### Common Issues

**Q: Backend fails to start**
A: Ensure your OpenAI API key is correctly set in the `.env` file

**Q: Frontend can't connect to backend**
A: Verify both services are running and check CORS configuration

**Q: Rate limiting errors**
A: Wait for the rate limit window to reset (1 minute) or upgrade your plan

**Q: Streaming not working**
A: Check browser console for errors and ensure network connection is stable
