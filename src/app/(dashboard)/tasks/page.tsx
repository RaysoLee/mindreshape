import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TaskCard } from "@/components/tasks/task-card";
import { UserTaskCard } from "@/components/tasks/user-task-card";

export default async function TasksPage() {
  const supabase = createClient();

  // 验证用户
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 获取用户统计数据
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 获取今日任务
  const today = new Date().toISOString().split("T")[0];
  const { data: todayTasks } = await supabase
    .from("user_tasks")
    .select(
      `
      *,
      tasks (*)
    `
    )
    .eq("user_id", user.id)
    .eq("assigned_date", today);

  // 获取推荐任务（每日和每周）
  const { data: recommendedTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_active", true)
    .in("type", ["daily", "weekly"])
    .order("type", { ascending: true })
    .order("difficulty", { ascending: true });

  // 获取自定义任务
  const { data: customTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("is_active", true)
    .eq("type", "custom")
    .order("difficulty", { ascending: true });

  // 统计
  const completedToday = todayTasks?.filter((t) => t.status === "completed").length || 0;
  const totalPoints = stats?.total_points || 0;
  const currentStreak = stats?.current_streak || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">成长任务</h1>
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
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">今日完成</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {completedToday}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总积分</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {totalPoints}
                </p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">连续打卡</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {currentStreak} 天
                </p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        {todayTasks && todayTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              今日任务
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayTasks.map((userTask: any) => (
                <UserTaskCard key={userTask.id} userTask={userTask} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              推荐任务
            </h2>
            <p className="text-sm text-gray-600">
              基于你的测试结果为你推荐
            </p>
          </div>

          {recommendedTasks && recommendedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userId={user.id}
                  isAdded={todayTasks?.some((ut: any) => ut.task_id === task.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">暂无推荐任务</p>
            </div>
          )}
        </div>

        {/* Custom Tasks */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            更多任务
          </h2>

          {customTasks && customTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userId={user.id}
                  isAdded={todayTasks?.some((ut: any) => ut.task_id === task.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">暂无自定义任务</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
