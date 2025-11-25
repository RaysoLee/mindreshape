"use client";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-gray-600" : "bg-primary"
        }`}
      >
        <span className="text-white text-sm">{isUser ? "我" : "AI"}</span>
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[80%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`rounded-lg p-4 ${
            isUser
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {new Date(message.created_at).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
