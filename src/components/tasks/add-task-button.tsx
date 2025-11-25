"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface AddTaskButtonProps {
  taskId: string;
  userId: string;
}

export function AddTaskButton({ taskId, userId }: AddTaskButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [adding, setAdding] = useState(false);

  const handleAddTask = async () => {
    setAdding(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("user_tasks").insert({
        user_id: userId,
        task_id: taskId,
        assigned_date: today,
        status: "pending",
      });

      if (error) throw error;

      router.push("/tasks");
      router.refresh();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("添加任务失败，请重试");
      setAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddTask}
      disabled={adding}
      size="lg"
      className="flex-1"
    >
      {adding ? "添加中..." : "添加到今日任务"}
    </Button>
  );
}
