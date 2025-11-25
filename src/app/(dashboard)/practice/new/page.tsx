"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const biasTypeOptions = [
  { value: "confirmation", label: "确认偏差" },
  { value: "availability", label: "可得性偏差" },
  { value: "anchoring", label: "锚定效应" },
  { value: "sunk_cost", label: "沉没成本" },
  { value: "overconfidence", label: "过度自信" },
  { value: "negativity", label: "消极偏差" },
  { value: "halo_effect", label: "光环效应" },
  { value: "groupthink", label: "群体思维" },
  { value: "dunning_kruger", label: "达克效应" },
  { value: "framing", label: "框架效应" },
];

const categoryOptions = [
  { value: "work", label: "工作", icon: "💼" },
  { value: "life", label: "生活", icon: "🏠" },
  { value: "relationship", label: "人际关系", icon: "👥" },
  { value: "finance", label: "财务", icon: "💰" },
  { value: "health", label: "健康", icon: "🏥" },
  { value: "learning", label: "学习", icon: "📚" },
  { value: "other", label: "其他", icon: "📌" },
];

export default function NewPracticePage() {
  const router = useRouter();
  const supabase = createClient();

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    situation: "",
    original_thought: "",
    bias_types: [] as string[],
    reframed_thought: "",
    mood_score: 5,
    category: "",
    tags: "",
    notes: "",
    occurred_at: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.situation || !formData.original_thought) {
      alert("请填写情境和原始想法");
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // 处理标签
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // 创建记录
      const { data, error } = await supabase
        .from("practice_logs")
        .insert({
          user_id: user.id,
          situation: formData.situation,
          original_thought: formData.original_thought,
          bias_types: formData.bias_types.length > 0 ? formData.bias_types : null,
          reframed_thought:
            formData.reframed_thought || null,
          mood_score: formData.mood_score,
          category: formData.category || null,
          tags: tags.length > 0 ? tags : null,
          notes: formData.notes || null,
          occurred_at: formData.occurred_at,
        })
        .select()
        .single();

      if (error) throw error;

      // 跳转到记录详情页
      router.push(`/practice/${data.id}`);
    } catch (error) {
      console.error("Error creating practice log:", error);
      alert("创建记录失败，请重试");
      setSubmitting(false);
    }
  };

  const toggleBiasType = (biasType: string) => {
    setFormData((prev) => ({
      ...prev,
      bias_types: prev.bias_types.includes(biasType)
        ? prev.bias_types.filter((t) => t !== biasType)
        : [...prev.bias_types, biasType],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">新建实践记录</h1>
            <Link
              href="/practice"
              className="text-sm text-gray-600 hover:text-primary"
            >
              返回列表
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>记录你的思维过程</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 发生时间 */}
              <div>
                <Label htmlFor="occurred_at">发生时间</Label>
                <Input
                  id="occurred_at"
                  type="datetime-local"
                  value={formData.occurred_at}
                  onChange={(e) =>
                    setFormData({ ...formData, occurred_at: e.target.value })
                  }
                  required
                />
              </div>

              {/* 分类 */}
              <div>
                <Label>分类</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: cat.value })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.category === cat.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs font-medium">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 情境描述 */}
              <div>
                <Label htmlFor="situation">情境描述 *</Label>
                <Input
                  id="situation"
                  placeholder="简要描述发生了什么..."
                  value={formData.situation}
                  onChange={(e) =>
                    setFormData({ ...formData, situation: e.target.value })
                  }
                  required
                />
              </div>

              {/* 原始想法 */}
              <div>
                <Label htmlFor="original_thought">你当时的想法 *</Label>
                <textarea
                  id="original_thought"
                  placeholder="记录你当时的真实想法..."
                  value={formData.original_thought}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      original_thought: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* 识别的认知偏差 */}
              <div>
                <Label>识别的认知偏差（可多选）</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {biasTypeOptions.map((bias) => (
                    <button
                      key={bias.value}
                      type="button"
                      onClick={() => toggleBiasType(bias.value)}
                      className={`p-2 text-sm rounded-lg border-2 transition-all ${
                        formData.bias_types.includes(bias.value)
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {bias.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 重新思考 */}
              <div>
                <Label htmlFor="reframed_thought">重新思考后的想法</Label>
                <textarea
                  id="reframed_thought"
                  placeholder="用更客观、理性的角度重新思考这件事..."
                  value={formData.reframed_thought}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reframed_thought: e.target.value,
                    })
                  }
                  className="w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* 心情评分 */}
              <div>
                <Label htmlFor="mood_score">
                  心情评分：{formData.mood_score} 分
                </Label>
                <input
                  id="mood_score"
                  type="range"
                  min="1"
                  max="10"
                  value={formData.mood_score}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mood_score: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>很差</span>
                  <span>一般</span>
                  <span>很好</span>
                </div>
              </div>

              {/* 标签 */}
              <div>
                <Label htmlFor="tags">标签（用逗号分隔）</Label>
                <Input
                  id="tags"
                  placeholder="例如：工作压力, 决策, 焦虑"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>

              {/* 备注 */}
              <div>
                <Label htmlFor="notes">其他备注</Label>
                <textarea
                  id="notes"
                  placeholder="任何其他想记录的内容..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full min-h-[80px] rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? "保存中..." : "保存记录"}
                </Button>
                <Link href="/practice" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    取消
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
