"use client";

import Link from "next/link";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
  context_type?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">暂无对话历史</p>
        <p className="text-xs text-gray-400 mt-1">开始新对话来探索你的思维模式</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "今天";
    } else if (days === 1) {
      return "昨天";
    } else if (days < 7) {
      return `${days} 天前`;
    } else {
      return date.toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getContextIcon = (contextType?: string) => {
    switch (contextType) {
      case "assessment_analysis":
        return "📊";
      case "practice_reflection":
        return "📝";
      default:
        return "💬";
    }
  };

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`/chat/${conversation.id}`}
          className="block"
        >
          <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
            <div className="flex items-start">
              <span className="text-xl mr-2 flex-shrink-0">
                {getContextIcon(conversation.context_type)}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {conversation.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(conversation.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
