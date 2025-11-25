import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AddTaskButton } from "@/components/tasks/add-task-button";

const difficultyLabels = {
  1: { label: "简单", color: "bg-green-100 text-green-800" },
  2: { label: "中等", color: "bg-yellow-100 text-yellow-800" },
  3: { label: "挑战", color: "bg-red-100 text-red-800" },
};

const typeLabels = {
  daily: { label: "每日", icon: "📅" },
  weekly: { label: "每周", icon: "📆" },
  custom: { label: "自定义", icon: "⚙️" },
};

const categoryIcons: Record<string, string> = {
  thinking: "🧠",
  emotion: "❤️",
  reflection: "🤔",
  challenge: "💪",
  decision: "🎯",
  learning: "📚",
  social: "👥",
  mindfulness: "🧘",
  information: "📰",
};

export default async function TaskDetailPage({
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

  // 获取任务详情
  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .eq("is_active", true)
    .single();

  if (error || !task) {
    redirect("/tasks");
  }

  // 检查是否已添加到今日任务
  const today = new Date().toISOString().split("T")[0];
  const { data: userTask } = await supabase
    .from("user_tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("task_id", params.id)
    .eq("assigned_date", today)
    .single();

  const difficultyInfo =
    difficultyLabels[task.difficulty as keyof typeof difficultyLabels];
  const typeInfo = typeLabels[task.type as keyof typeof typeLabels];
  const categoryIcon = categoryIcons[task.category] || "📌";

  const steps = task.steps || [];
  const tips = task.tips || [];
  const resources = task.resources || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/tasks"
              className="text-gray-600 hover:text-primary flex items-center gap-2"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              返回任务列表
            </Link>
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
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{categoryIcon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyInfo.color}`}
                    >
                      {difficultyInfo.label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ⏱️ 预计 {task.estimated_minutes} 分钟
                  </div>
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl">{task.title}</CardTitle>
            <p className="text-gray-600 mt-2">{task.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Steps */}
            {steps.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                  完成步骤
                </h3>
                <div className="space-y-3">
                  {steps.map((step: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                        {step.order || index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {tips.length > 0 && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  💡 提示
                </h3>
                <ul className="space-y-1">
                  {tips.map((tip: string, index: number) => (
                    <li key={index} className="text-sm text-blue-800">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            {resources.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  推荐资源
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resources.map((resource: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {resource.type === "book" && "📚 书籍"}
                        {resource.type === "article" && "📄 文章"}
                        {resource.type === "video" && "🎥 视频"}
                        {resource.type === "app" && "📱 应用"}
                        {resource.type === "guide" && "📖 指南"}
                        {resource.type === "template" && "📋 模板"}
                        {resource.type === "tool" && "🛠️ 工具"}
                        {resource.type === "community" && "👥 社区"}
                        {resource.type === "checklist" && "✅ 清单"}
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {resource.title}
                      </div>
                      {resource.author && (
                        <div className="text-xs text-gray-500 mt-1">
                          作者：{resource.author}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              {!userTask ? (
                <AddTaskButton taskId={params.id} userId={user.id} />
              ) : userTask.status === "completed" ? (
                <div className="flex-1 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <span className="text-green-700 font-medium">
                    ✅ 今日已完成此任务
                  </span>
                </div>
              ) : (
                <Link href="/tasks" className="flex-1">
                  <Button className="w-full" size="lg">
                    返回任务列表完成打卡
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
