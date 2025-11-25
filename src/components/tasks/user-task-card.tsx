"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserTask {
  id: string;
  task_id: string;
  status: string;
  completed_at: string | null;
  tasks: {
    title: string;
    description: string;
    category: string;
    estimated_minutes: number;
  };
}

interface UserTaskCardProps {
  userTask: UserTask;
}

const statusLabels = {
  pending: { label: "待完成", color: "bg-gray-100 text-gray-800" },
  in_progress: { label: "进行中", color: "bg-blue-100 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-100 text-green-800" },
  skipped: { label: "已跳过", color: "bg-gray-100 text-gray-500" },
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

export function UserTaskCard({ userTask }: UserTaskCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [updating, setUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);

    try {
      const updates: any = { status: newStatus };

      if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
      } else if (newStatus === "in_progress") {
        updates.completed_at = null;
      }

      const { error } = await supabase
        .from("user_tasks")
        .update(updates)
        .eq("id", userTask.id);

      if (error) throw error;

      // 如果完成任务，更新用户积分
      if (newStatus === "completed" && userTask.status !== "completed") {
        // 获取用户ID
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // 增加10积分
          await supabase.rpc("increment_user_points", {
            user_id: user.id,
            points: 10,
          });
        }
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("更新失败，请重试");
    } finally {
      setUpdating(false);
    }
  };

  const statusInfo =
    statusLabels[userTask.status as keyof typeof statusLabels];
  const categoryIcon = categoryIcons[userTask.tasks.category] || "📌";
  const isCompleted = userTask.status === "completed";

  return (
    <Card className={`${isCompleted ? "opacity-75" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <span className="text-2xl">{categoryIcon}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>
        <CardTitle className="text-lg">{userTask.tasks.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {userTask.tasks.description}
        </p>

        <div className="text-xs text-gray-500 mb-4">
          ⏱️ {userTask.tasks.estimated_minutes} 分钟
        </div>

        {!isCompleted ? (
          <div className="flex gap-2">
            <Link href={`/tasks/${userTask.task_id}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                开始任务
              </Button>
            </Link>
            <Button
              onClick={() => handleUpdateStatus("completed")}
              disabled={updating}
              size="sm"
              className="flex-1"
            >
              {updating ? "..." : "完成"}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <span className="text-sm text-green-600 flex-1">
              ✅ 已完成 (+10 积分)
            </span>
            <Button
              onClick={() => handleUpdateStatus("pending")}
              disabled={updating}
              variant="outline"
              size="sm"
            >
              取消完成
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
