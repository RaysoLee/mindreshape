import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const biasTypeLabels: Record<string, string> = {
  confirmation: "确认偏差",
  availability: "可得性偏差",
  anchoring: "锚定效应",
  sunk_cost: "沉没成本",
  overconfidence: "过度自信",
  negativity: "消极偏差",
  halo_effect: "光环效应",
  groupthink: "群体思维",
  dunning_kruger: "达克效应",
  framing: "框架效应",
};

const categoryLabels: Record<string, { label: string; icon: string }> = {
  work: { label: "工作", icon: "💼" },
  life: { label: "生活", icon: "🏠" },
  relationship: { label: "人际关系", icon: "👥" },
  finance: { label: "财务", icon: "💰" },
  health: { label: "健康", icon: "🏥" },
  learning: { label: "学习", icon: "📚" },
  other: { label: "其他", icon: "📌" },
};

const moodEmojis = ["😢", "😢", "😟", "😟", "😐", "😐", "🙂", "🙂", "😊", "😊"];

export default async function PracticeDetailPage({
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

  // 获取记录详情
  const { data: log, error } = await supabase
    .from("practice_logs")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !log) {
    redirect("/practice");
  }

  const categoryInfo = log.category
    ? categoryLabels[log.category]
    : { label: "未分类", icon: "📌" };
  const moodEmoji = log.mood_score ? moodEmojis[log.mood_score - 1] : "😐";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/practice"
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
              返回列表
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary">
              返回仪表板
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{categoryInfo.icon}</span>
                  <div>
                    <p className="text-sm text-gray-600">{categoryInfo.label}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.occurred_at).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <CardTitle className="text-2xl">{log.situation}</CardTitle>
              </div>
              {log.mood_score && (
                <div className="text-center">
                  <div className="text-4xl mb-1">{moodEmoji}</div>
                  <div className="text-xs text-gray-600">
                    心情 {log.mood_score}/10
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 原始想法 */}
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <h3 className="font-semibold text-red-900 mb-2">当时的想法</h3>
              <p className="text-red-800 whitespace-pre-wrap">
                {log.original_thought}
              </p>
            </div>

            {/* 识别的认知偏差 */}
            {log.bias_types && log.bias_types.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  识别的认知偏差
                </h3>
                <div className="flex flex-wrap gap-2">
                  {log.bias_types.map((bias: string) => (
                    <span
                      key={bias}
                      className="px-3 py-2 bg-red-100 text-red-800 rounded-lg font-medium"
                    >
                      {biasTypeLabels[bias] || bias}
                    </span>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 识别认知偏差是改善思维的第一步。尝试理解这些偏差如何影响了你的判断。
                  </p>
                </div>
              </div>
            )}

            {/* 重新思考 */}
            {log.reframed_thought && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <h3 className="font-semibold text-green-900 mb-2">
                  重新思考后
                </h3>
                <p className="text-green-800 whitespace-pre-wrap">
                  {log.reframed_thought}
                </p>
              </div>
            )}

            {/* 标签 */}
            {log.tags && log.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {log.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 备注 */}
            {log.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">备注</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{log.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Link href={`/practice/${params.id}/edit`} className="flex-1">
                <Button variant="outline" className="w-full">
                  编辑记录
                </Button>
              </Link>
              <Link href="/practice/new" className="flex-1">
                <Button className="w-full">新建记录</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h4 className="font-semibold text-gray-900 mb-2">反思提示</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 这个想法基于事实还是假设？</li>
              <li>• 有没有其他解释或角度？</li>
              <li>• 如果朋友遇到同样的情况，我会怎么建议？</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h4 className="font-semibold text-gray-900 mb-2">下一步行动</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 继续记录类似情况</li>
              <li>• 寻找思维模式</li>
              <li>• 尝试新的应对策略</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
