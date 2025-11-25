import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    title: "开始测试",
    description: "进行思维模式评估",
    icon: "📊",
    href: "/assessments",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "AI 对话",
    description: "与思维教练对话",
    icon: "💬",
    href: "/chat",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "记录实践",
    description: "记录你的思维转变",
    icon: "✍️",
    href: "/practice/new",
    color: "from-green-500 to-green-600",
  },
  {
    title: "今日任务",
    description: "查看今天的练习任务",
    icon: "📝",
    href: "/tasks",
    color: "from-orange-500 to-orange-600",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} text-white mb-4`}>
                <span className="text-2xl">{action.icon}</span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
