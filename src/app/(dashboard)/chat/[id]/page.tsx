import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import Link from "next/link";

export default async function ChatConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // 验证用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取对话信息
  const { data: conversation, error: convError } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (convError || !conversation) {
    redirect("/chat");
  }

  // 获取消息历史
  const { data: messages, error: msgError } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", params.id)
    .order("created_at", { ascending: true });

  if (msgError) {
    console.error("Error fetching messages:", msgError);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b flex-shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/chat"
                className="text-gray-600 hover:text-primary"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                {conversation.title}
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-primary"
            >
              返回仪表板
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          conversationId={params.id}
          initialMessages={messages || []}
        />
      </div>
    </div>
  );
}
