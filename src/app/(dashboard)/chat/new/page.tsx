"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function NewChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createNewConversation();
  }, []);

  const createNewConversation = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // 获取话题（如果有）
      const topic = searchParams.get("topic");
      const title = topic || "新对话";

      // 创建新对话
      const { data: conversation, error } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: user.id,
          title: title,
          context_type: "general",
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(conversation.id);

      // 如果有话题，添加系统消息
      if (topic) {
        await supabase.from("chat_messages").insert({
          conversation_id: conversation.id,
          role: "system",
          content: `用户想要讨论：${topic}`,
        });
      }

      setLoading(false);

      // 跳转到对话页面
      router.replace(`/chat/${conversation.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("创建对话失败，请重试");
      router.push("/chat");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">创建新对话...</p>
        </div>
      </div>
    );
  }

  return null;
}
