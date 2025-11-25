import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConversationList } from "@/components/chat/conversation-list";

export default async function ChatPage() {
  const supabase = createClient();

  // 验证用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取用户的对话列表
  const { data: conversations, error } = await supabase
    .from("chat_conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">AI 对话分析</h1>
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-primary"
            >
              返回仪表板
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Conversation List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">对话历史</h2>
                <Link href="/chat/new">
                  <Button size="sm">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    新对话
                  </Button>
                </Link>
              </div>

              <ConversationList conversations={conversations || []} />
            </div>
          </div>

          {/* Main Area - Welcome/Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  欢迎来到 AI 对话分析
                </h2>
                <p className="text-gray-600">
                  通过与 AI 对话，深入了解你的思维模式和认知偏差
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    个性化分析
                  </h3>
                  <p className="text-sm text-blue-800">
                    基于你的测试结果，AI 会提供针对性的思维分析和改善建议
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    深度对话
                  </h3>
                  <p className="text-sm text-green-800">
                    探讨具体情境下的决策过程，识别潜在的认知偏差
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    持续学习
                  </h3>
                  <p className="text-sm text-purple-800">
                    通过多次对话，逐步建立更理性、客观的思维习惯
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    隐私安全
                  </h3>
                  <p className="text-sm text-orange-800">
                    所有对话记录仅你可见，数据加密存储，保护隐私
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/chat/new">
                  <Button size="lg">开始新对话</Button>
                </Link>
              </div>

              {/* Quick Topics */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">
                  热门话题
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "分析我的测试结果",
                    "如何克服确认偏差",
                    "提升决策质量",
                    "识别认知陷阱",
                    "批判性思维训练",
                  ].map((topic) => (
                    <Link
                      key={topic}
                      href={`/chat/new?topic=${encodeURIComponent(topic)}`}
                    >
                      <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors">
                        {topic}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
