import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, chatEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome to DevMate AI</h2>
            <p>Start a conversation with your AI developer assistant</p>
          </div>
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}
