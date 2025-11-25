import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function ResultsPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const supabase = createClient();

  // 验证用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取测试结果
  const { data: result, error: resultError } = await supabase
    .from("assessment_results")
    .select(
      `
      *,
      assessments (
        title,
        description,
        category
      )
    `
    )
    .eq("session_id", params.sessionId)
    .eq("user_id", user.id)
    .single();

  if (resultError || !result) {
    redirect(`/assessments/${params.id}`);
  }

  // 计算百分比
  const percentage = Math.round((result.total_score / result.max_score) * 100);

  // 维度分析
  const dimensionScores = result.dimension_scores as Record<string, number> || {};
  const dimensionNames: Record<string, string> = {
    confirmation: "确认偏差",
    availability: "可得性偏差",
    balanced: "平衡思维",
    negativity: "消极倾向",
    intuition: "直觉思维",
    simplification: "简化倾向",
    analytical: "分析思维",
    social: "社会参照",
    impulsive: "冲动决策",
    moderate: "适度决策",
    indecisive: "优柔寡断",
    intuitive: "直觉主导",
    rational: "理性主导",
    experiential: "经验主导",
    satisficing: "满意即可",
    maximizing: "追求最优",
    random: "随机决策",
    delegating: "委托决策",
  };

  // 获取会话信息
  const { data: session } = await supabase
    .from("user_assessment_sessions")
    .select("completed_at")
    .eq("id", params.sessionId)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">测试结果</h1>
            <div className="flex gap-4">
              <Link
                href={`/assessments/${params.id}`}
                className="text-sm text-gray-600 hover:text-primary"
              >
                返回测试详情
              </Link>
              <Link
                href="/assessments"
                className="text-sm text-gray-600 hover:text-primary"
              >
                浏览其他测试
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Summary Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">
              {result.assessments?.title}
            </CardTitle>
            <p className="text-gray-600">
              完成时间:{" "}
              {session?.completed_at &&
                new Date(session.completed_at).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${percentage * 5.03} 503`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-5xl font-bold text-primary">
                    {percentage}
                  </div>
                  <div className="text-sm text-gray-600">分数</div>
                </div>
              </div>
            </div>
            <div className="text-center text-gray-600">
              总分: {result.total_score} / {result.max_score}
            </div>
          </CardContent>
        </Card>

        {/* Dimension Analysis */}
        {Object.keys(dimensionScores).length > 0 && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>维度分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dimensionScores)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([dimension, score]) => {
                    const maxDimensionScore = 12; // 假设每个维度最高12分
                    const dimensionPercentage = Math.min(
                      ((score as number) / maxDimensionScore) * 100,
                      100
                    );

                    return (
                      <div key={dimension}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {dimensionNames[dimension] || dimension}
                          </span>
                          <span className="text-sm text-gray-600">
                            {score} 分
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${dimensionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>结果解读</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {percentage >= 70 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">
                    高认知偏差倾向
                  </h4>
                  <p className="text-red-800 text-sm">
                    你在测试中表现出较强的认知偏差倾向。建议多关注自己的思维模式，尝试从不同角度思考问题，培养批判性思维能力。
                  </p>
                </div>
              ) : percentage >= 40 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    中等认知偏差
                  </h4>
                  <p className="text-yellow-800 text-sm">
                    你在某些方面存在认知偏差，但整体表现尚可。继续保持开放的心态，主动寻求不同的观点和信息，可以进一步提升决策质量。
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    良好的认知平衡
                  </h4>
                  <p className="text-green-800 text-sm">
                    你展现出较好的批判性思维能力，能够相对客观地看待问题。继续保持这种思维方式，将有助于做出更明智的决策。
                  </p>
                </div>
              )}

              {/* 维度特定建议 */}
              {dimensionScores.confirmation &&
                (dimensionScores.confirmation as number) >= 6 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      确认偏差提醒
                    </h4>
                    <p className="text-blue-800 text-sm">
                      你倾向于寻找支持自己观点的信息。尝试主动寻找反对意见，可以帮助你做出更全面的判断。
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href={`/assessments/${params.id}`}>
            <Button variant="outline">重新测试</Button>
          </Link>
          <Link href="/assessments">
            <Button>探索更多测试</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
