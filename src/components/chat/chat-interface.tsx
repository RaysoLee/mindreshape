"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "./message-bubble";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  conversationId: string;
  initialMessages: Message[];
}

export function ChatInterface({
  conversationId,
  initialMessages,
}: ChatInterfaceProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // 保存用户消息到数据库
      const { data: savedMessage, error: saveError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          role: "user",
          content: userMessage,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // 添加到本地状态
      setMessages((prev) => [...prev, savedMessage]);

      // 调用 AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          message: userMessage,
          history: messages.filter((m) => m.role !== "system"),
        }),
      });

      if (!response.ok) {
        throw new Error("AI response failed");
      }

      const data = await response.json();

      // 保存 AI 回复到数据库
      const { data: aiMessage, error: aiSaveError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          role: "assistant",
          content: data.message,
          metadata: {
            model: data.model,
            tokens: data.tokens,
          },
        })
        .select()
        .single();

      if (aiSaveError) throw aiSaveError;

      // 添加到本地状态
      setMessages((prev) => [...prev, aiMessage]);

      // 如果是第一条消息，更新对话标题
      if (messages.filter((m) => m.role === "user").length === 0) {
        const title = userMessage.substring(0, 50);
        await supabase
          .from("chat_conversations")
          .update({ title })
          .eq("id", conversationId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("发送消息失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const displayMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {displayMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                开始对话
              </h3>
              <p className="text-gray-600">
                你可以问我任何关于思维模式、认知偏差的问题
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  "帮我分析最近的测试结果",
                  "什么是确认偏差？",
                  "如何提升批判性思维？",
                  "我该如何做更好的决策？",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {displayMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">AI</span>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题... (Shift + Enter 换行)"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent max-h-32"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? (
                "发送中..."
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            提示：AI 会基于你的测试结果提供个性化建议
          </p>
        </form>
      </div>
    </div>
  );
}
