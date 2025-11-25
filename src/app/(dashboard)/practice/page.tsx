import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PracticeLogCard } from "@/components/practice/practice-log-card";

export default async function PracticePage() {
  const supabase = createClient();

  // 验证用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取用户的实践记录
  const { data: logs, error } = await supabase
    .from("practice_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("occurred_at", { ascending: false });

  if (error) {
    console.error("Error fetching practice logs:", error);
  }

  // 统计数据
  const totalLogs = logs?.length || 0;
  const thisWeekLogs =
    logs?.filter((log) => {
      const logDate = new Date(log.occurred_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    }).length || 0;

  const biasTypes = logs?.flatMap((log) => log.bias_types || []) || [];
  const uniqueBiases = [...new Set(biasTypes)].length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">实践记录</h1>
            <div className="flex gap-4">
              <Link href="/practice/new">
                <Button>
                  <svg
                    className="w-4 h-4 mr-2"
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
                  新建记录
                </Button>
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-primary flex items-center"
              >
                返回仪表板
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总记录数</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {totalLogs}
                </p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">本周记录</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {thisWeekLogs}
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">识别偏差类型</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {uniqueBiases}
                </p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
        </div>

        {/* Logs List */}
        {logs && logs.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              我的记录
            </h2>
            {logs.map((log) => (
              <PracticeLogCard key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              还没有实践记录
            </h3>
            <p className="text-gray-600 mb-6">
              开始记录你的思维过程，识别认知偏差，建立更好的思维习惯
            </p>
            <Link href="/practice/new">
              <Button size="lg">创建第一条记录</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
