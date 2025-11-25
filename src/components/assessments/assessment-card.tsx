import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AssessmentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  estimated_minutes: number;
  questionCount?: number;
}

export function AssessmentCard({
  id,
  title,
  description,
  category,
  difficulty,
  estimated_minutes,
  questionCount = 0,
}: AssessmentCardProps) {
  const difficultyColors = {
    1: "bg-green-100 text-green-800",
    2: "bg-yellow-100 text-yellow-800",
    3: "bg-orange-100 text-orange-800",
    4: "bg-red-100 text-red-800",
    5: "bg-purple-100 text-purple-800",
  };

  const difficultyLabels = {
    1: "简单",
    2: "较易",
    3: "中等",
    4: "较难",
    5: "困难",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              difficultyColors[difficulty as keyof typeof difficultyColors]
            }`}
          >
            {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
          </span>
          <span className="text-sm text-gray-600">
            {estimated_minutes} 分钟
          </span>
          {questionCount > 0 && (
            <span className="text-sm text-gray-600">
              {questionCount} 道题
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/assessments/${id}`}>
          <Button className="w-full">开始测试</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
