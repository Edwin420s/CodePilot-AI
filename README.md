# DevMate AI Frontend

A modern, responsive React frontend for the DevMate AI developer assistant with real-time streaming, conversation memory, and a polished dark UI.

## Features

- **Real-time Streaming**: Watch AI responses appear token by token
- **Conversation Memory**: Maintains context across messages using session IDs
- **Mode Selection**: Switch between General Chat, Code Explanation, and Error Fixing
- **Code Formatting**: Automatic syntax highlighting and copy functionality for code blocks
- **Responsive Design**: Mobile-friendly with collapsible sidebar
- **Dark Theme**: Professional dark navy theme with Tailwind CSS
- **Error Handling**: Graceful error display and retry functionality
- **Loading States**: Visual feedback during streaming and processing

## Tech Stack

- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **UUID** for session management

## Project Structure

```
frontend/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── src/
│   ├── main.jsx           # React app entry
│   ├── index.css          # Global styles
│   ├── App.jsx            # Main application component
│   ├── components/
│   │   ├── Sidebar.jsx    # Mode selection sidebar
│   │   ├── ChatWindow.jsx # Message display area
│   │   ├── MessageBubble.jsx # Individual message component
│   │   └── InputBox.jsx  # Message input with streaming
│   └── services/
│       └── api.js         # API communication with streaming support
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 3. Backend Requirements

Ensure the DevMate AI backend is running on `http://localhost:8000`. See the backend README for setup instructions.

## Usage

### Selecting a Mode

1. **General Chat**: Ask any development-related questions
2. **Explain Code**: Paste code snippets for detailed explanations
3. **Fix Error**: Paste error messages for debugging assistance

### Sending Messages

- Type your message in the input box
- Press `Enter` to send
- Press `Shift + Enter` for a new line
- Watch responses stream in real-time

### Session Management

- Sessions are automatically created and stored in localStorage
- The same session ID is used across all messages for context awareness
- Clear chat button removes all messages but preserves the session

### Code Features

- Code blocks are automatically detected and formatted
- Hover over code blocks to see the copy button
- Click the copy button to copy code to clipboard

## API Integration

The frontend communicates with the following backend endpoints:

- `POST /chat` and `POST /chat/stream`
- `POST /explain` and `POST /explain/stream`
- `POST /fix-error` and `POST /fix-error/stream`

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

## Responsive Design

- **Desktop**: Fixed sidebar with full chat interface
- **Mobile**: Collapsible sidebar with hamburger menu
- **Tablet**: Adaptive layout based on screen size

## Error Handling

The frontend gracefully handles:

- Network connectivity issues
- API rate limiting (429 responses)
- Server errors (5xx responses)
- Invalid API responses
- Streaming interruptions

Error messages are displayed directly in the chat interface with clear indicators.

## Performance Optimizations

- **Component Memoization**: Prevents unnecessary re-renders
- **Efficient State Management**: Uses React hooks optimally
- **Lazy Loading**: Components load as needed
- **Optimized Streaming**: Efficient text decoding and rendering

## Development

### Adding New Modes

1. Update the `modes` array in `Sidebar.jsx`
2. Add corresponding backend endpoints to `api.js`
3. Update placeholder text in `InputBox.jsx`

### Customizing Styling

Modify `tailwind.config.js` to adjust the color scheme:

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

For production deployment, update the `BASE_URL` in `src/services/api.js` to point to your live backend URL.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to platforms like Vercel, Netlify, or any static hosting service.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
