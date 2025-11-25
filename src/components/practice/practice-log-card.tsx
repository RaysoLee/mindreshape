import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PracticeLog {
  id: string;
  situation: string;
  original_thought: string;
  bias_types: string[] | null;
  reframed_thought: string | null;
  mood_score: number | null;
  category: string | null;
  tags: string[] | null;
  occurred_at: string;
}

interface PracticeLogCardProps {
  log: PracticeLog;
}

const biasTypeLabels: Record<string, string> = {
  confirmation: "确认偏差",
  availability: "可得性偏差",
  anchoring: "锚定效应",
  sunk_cost: "沉没成本",
  overconfidence: "过度自信",
  negativity: "消极偏差",
  halo_effect: "光环效应",
  groupthink: "群体思维",
  dunning_kruger: "达克效应",
  framing: "框架效应",
};

const categoryIcons: Record<string, string> = {
  work: "💼",
  life: "🏠",
  relationship: "👥",
  finance: "💰",
  health: "🏥",
  learning: "📚",
  other: "📌",
};

const moodEmojis = ["😢", "😟", "😐", "🙂", "😊"];

export function PracticeLogCard({ log }: PracticeLogCardProps) {
  const moodEmoji = log.mood_score
    ? moodEmojis[Math.floor((log.mood_score - 1) / 2)]
    : "😐";

  const categoryIcon = log.category
    ? categoryIcons[log.category] || "📌"
    : "📌";

  return (
    <Link href={`/practice/${log.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{categoryIcon}</span>
                <span className="text-xs text-gray-500">
                  {new Date(log.occurred_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {log.mood_score && (
                  <span className="text-lg ml-auto">{moodEmoji}</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {log.situation}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">原始想法：</p>
              <p className="text-gray-900 line-clamp-2">
                {log.original_thought}
              </p>
            </div>

            {log.reframed_thought && (
              <div>
                <p className="text-sm text-gray-600 mb-1">重新思考：</p>
                <p className="text-green-700 line-clamp-2">
                  {log.reframed_thought}
                </p>
              </div>
            )}

            {log.bias_types && log.bias_types.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {log.bias_types.map((bias) => (
                  <span
                    key={bias}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                  >
                    {biasTypeLabels[bias] || bias}
                  </span>
                ))}
              </div>
            )}

            {log.tags && log.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {log.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
