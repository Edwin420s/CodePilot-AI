import { useState } from "react";
import { Copy, Check, User, Bot } from "lucide-react";

export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  // Detect code blocks (simple fallback)
  const renderText = (text) => {
    // Check for markdown code blocks ```
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).replace(/^\n/, "");
        // Remove language identifier if present
        const cleanCode = code.replace(/^[a-zA-Z]+\n/, "");
        return (
          <div key={i} className="relative group my-2">
            <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto text-sm">
              <code className="text-green-300">{cleanCode}</code>
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(cleanCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="absolute top-2 right-2 p-1 rounded bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy code"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary" : "bg-gray-600"
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? "bg-primary text-white rounded-br-md"
              : "bg-card text-gray-100 rounded-bl-md border border-border"
          }`}
        >
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {renderText(msg.text)}
            {msg.streaming && (
              <span className="inline-block w-2 h-4 bg-gray-300 animate-pulse ml-1 align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
