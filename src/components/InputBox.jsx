import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

export default function InputBox({ onSend, mode, isLoading, isStreaming }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const modeLabel = {
    chat: "Ask anything...",
    explain: "Paste code to explain...",
    "fix-error": "Paste error message...",
  };

  return (
    <div className="border-t border-border p-3 bg-darkSecondary">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={modeLabel[mode] || "Type your message..."}
            rows={1}
            disabled={isLoading}
            className="w-full bg-dark border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
            style={{ maxHeight: "120px" }}
          />
          <div className="absolute right-2 bottom-2 text-xs text-gray-500">
            {isLoading && <Loader2 size={16} className="animate-spin" />}
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-gray-600">
          <kbd className="px-1 py-0.5 bg-dark rounded text-gray-400 border border-gray-700">
            Enter
          </kbd>{" "}
          to send,{" "}
          <kbd className="px-1 py-0.5 bg-dark rounded text-gray-400 border border-gray-700">
            Shift + Enter
          </kbd>{" "}
          for new line
        </span>
      </div>
    </div>
  );
}
