import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import InputBox from "./components/InputBox";
import { sendStreamMessage } from "./services/api";
import { v4 as uuidv4 } from "uuid";

function getSessionId() {
  let id = localStorage.getItem("devmate_session_id");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("devmate_session_id", id);
  }
  return id;
}

export default function App() {
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const sessionId = useRef(getSessionId());
  const chatEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      // Add user message
      const userMsg = { role: "user", text, id: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        // Use streaming for all modes
        setIsStreaming(true);

        // Add a placeholder AI message that will update in real time
        const aiMsgId = Date.now() + 1;
        const aiMsg = { role: "ai", text: "", id: aiMsgId, streaming: true };
        setMessages((prev) => [...prev, aiMsg]);

        // Call streaming endpoint
        await sendStreamMessage(
          mode,
          text,
          sessionId.current,
          (chunk) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMsgId
                  ? { ...msg, text: msg.text + chunk }
                  : msg
              )
            );
          },
          () => {
            // Done
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMsgId ? { ...msg, streaming: false } : msg
              )
            );
            setIsStreaming(false);
            setIsLoading(false);
          },
          (error) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMsgId
                  ? { ...msg, text: "⚠️ Error: " + error.message, streaming: false }
                  : msg
              )
            );
            setIsStreaming(false);
            setIsLoading(false);
          }
        );
      } catch (error) {
        // Fallback error if not handled
        const errorMsg = {
          role: "ai",
          text: "⚠️ Something went wrong. Please try again.",
          id: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [mode, isLoading]
  );

  const clearChat = () => {
    setMessages([]);
    // Optionally reset session? We'll keep session for continuity.
  };

  return (
    <div className="flex h-screen bg-dark text-white">
      <Sidebar
        mode={mode}
        setMode={setMode}
        onClear={clearChat}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          messages={messages}
          chatEndRef={chatEndRef}
        />
        <InputBox
          onSend={handleSend}
          mode={mode}
          isLoading={isLoading}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
