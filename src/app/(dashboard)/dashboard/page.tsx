"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">MindReShape</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button variant="outline" onClick={signOut}>
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            欢迎回来！👋
          </h2>
          <p className="text-gray-600 mt-2">
            今天也要继续探索你的思维模式
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="完成测试"
            value={0}
            icon="📊"
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="实践记录"
            value={0}
            icon="✍️"
            trend={{ value: 0, isPositive: true }}
          />
          <StatsCard
            title="连续打卡"
            value="0 天"
            icon="🔥"
          />
          <StatsCard
            title="获得积分"
            value={0}
            icon="⭐"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">快速开始</h3>
          <QuickActions />
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-semibold mb-4">最近活动</h3>
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p>暂无活动记录</p>
            <p className="text-sm mt-2">开始你的第一次探索吧！</p>
          </div>
        </div>
      </main>
    </div>
  );
}
