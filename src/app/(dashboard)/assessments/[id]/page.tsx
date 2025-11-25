import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AssessmentDetailPage({
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

  // 获取测试详情
  const { data: assessment, error } = await supabase
    .from("assessments")
    .select(
      `
      *,
      questions(count)
    `
    )
    .eq("id", params.id)
    .eq("is_published", true)
    .single();

  if (error || !assessment) {
    redirect("/assessments");
  }

  // 获取用户的历史会话
  const { data: sessions } = await supabase
    .from("user_assessment_sessions")
    .select("*")
    .eq("assessment_id", params.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const completedSessions = sessions?.filter((s) => s.status === "completed");
  const inProgressSession = sessions?.find((s) => s.status === "in_progress");

  const difficultyColors = {
    1: "bg-green-100 text-green-800",
    2: "bg-yellow-100 text-yellow-800",
    3: "bg-orange-100 text-orange-800",
    4: "bg-red-100 text-red-800",
    5: "bg-purple-100 text-purple-800",
  };

  const difficultyLabels = {
    1: "简单",
    2: "较易",
    3: "中等",
    4: "较难",
    5: "困难",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/assessments"
              className="text-sm text-gray-600 hover:text-primary"
            >
              ← 返回测试列表
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
        {/* Assessment Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {assessment.title}
          </h1>
          <p className="text-gray-600 mb-6">{assessment.description}</p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                difficultyColors[
                  assessment.difficulty as keyof typeof difficultyColors
                ]
              }`}
            >
              {
                difficultyLabels[
                  assessment.difficulty as keyof typeof difficultyLabels
                ]
              }
            </span>
            <span className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {assessment.estimated_minutes} 分钟
            </span>
            <span className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {assessment.questions?.[0]?.count || 0} 道题
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {inProgressSession ? (
              <Link href={`/assessments/${params.id}/quiz`} className="flex-1">
                <Button className="w-full" size="lg">
                  继续未完成的测试
                </Button>
              </Link>
            ) : (
              <Link href={`/assessments/${params.id}/quiz`} className="flex-1">
                <Button className="w-full" size="lg">
                  开始测试
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Previous Results */}
        {completedSessions && completedSessions.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              历史记录
            </h2>
            <div className="space-y-3">
              {completedSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      完成时间:{" "}
                      {new Date(session.completed_at).toLocaleDateString(
                        "zh-CN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <Link href={`/assessments/${params.id}/results/${session.id}`}>
                    <Button variant="outline" size="sm">
                      查看结果
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">测试说明</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• 请在安静的环境中完成测试</li>
            <li>• 根据第一直觉选择最符合你的选项</li>
            <li>• 没有对错之分，请诚实作答</li>
            <li>• 测试过程中可以随时暂停，下次继续</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
