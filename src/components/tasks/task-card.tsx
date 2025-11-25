"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  difficulty: number;
  estimated_minutes: number;
  tags: string[] | null;
}

interface TaskCardProps {
  task: Task;
  userId: string;
  isAdded: boolean;
}

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

export function TaskCard({ task, userId, isAdded }: TaskCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [adding, setAdding] = useState(false);

  const handleAddTask = async () => {
    setAdding(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("user_tasks").insert({
        user_id: userId,
        task_id: task.id,
        assigned_date: today,
        status: "pending",
      });

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("添加任务失败，请重试");
    } finally {
      setAdding(false);
    }
  };

  const difficultyInfo =
    difficultyLabels[task.difficulty as keyof typeof difficultyLabels];
  const typeInfo = typeLabels[task.type as keyof typeof typeLabels];
  const categoryIcon = categoryIcons[task.category] || "📌";

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcon}</span>
            <div>
              <span className="text-xs text-gray-500">
                {typeInfo.icon} {typeInfo.label}
              </span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyInfo.color}`}
          >
            {difficultyInfo.label}
          </span>
        </div>
        <CardTitle className="text-lg">{task.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">
            ⏱️ {task.estimated_minutes} 分钟
          </span>
          {task.tags && task.tags.length > 0 && (
            <span className="text-xs text-gray-500">
              {task.tags.slice(0, 2).join(", ")}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={`/tasks/${task.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              查看详情
            </Button>
          </Link>
          {!isAdded && (
            <Button
              onClick={handleAddTask}
              disabled={adding}
              size="sm"
              className="flex-1"
            >
              {adding ? "添加中..." : "添加到今日"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
