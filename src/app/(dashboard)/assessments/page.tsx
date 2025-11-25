import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AssessmentCard } from "@/components/assessments/assessment-card";

export default async function AssessmentsPage() {
  const supabase = createClient();

  // 验证用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取所有已发布的测试
  const { data: assessments, error } = await supabase
    .from("assessments")
    .select(`
      *,
      questions(count)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching assessments:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">测试中心</h1>
            <a
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-primary"
            >
              返回仪表板
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            探索你的思维模式
          </h2>
          <p className="text-gray-600 mt-2">
            通过科学的测评，了解你的认知偏差和决策风格
          </p>
        </div>

        {/* Assessments Grid */}
        {assessments && assessments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment: any) => (
              <AssessmentCard
                key={assessment.id}
                id={assessment.id}
                title={assessment.title}
                description={assessment.description}
                category={assessment.category}
                difficulty={assessment.difficulty}
                estimated_minutes={assessment.estimated_minutes}
                questionCount={assessment.questions?.[0]?.count || 0}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              暂无可用测试
            </h3>
            <p className="text-gray-600">
              测试内容正在准备中，敬请期待
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
