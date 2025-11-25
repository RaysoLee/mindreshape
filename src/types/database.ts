export interface User {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  estimated_minutes: number;
  tags: string[];
}

export interface Question {
  id: string;
  assessment_id: string;
  order_num: number;
  type: "single" | "multiple" | "text";
  question_text: string;
  description?: string;
  image_url?: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  order_num: number;
}

export interface PracticeLog {
  id: string;
  user_id: string;
  title: string;
  situation: string;
  original_thought: string;
  bias_types: string[];
  reframed_thought?: string;
  mood_score?: number;
  category?: string;
  tags: string[];
  image_urls: string[];
  notes?: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "custom";
  category: string;
  difficulty: number;
  estimated_minutes: number;
  steps: TaskStep[];
  tips: string[];
  resources: Resource[];
}

export interface TaskStep {
  title: string;
  description: string;
}

export interface Resource {
  title: string;
  url: string;
  type: "article" | "video" | "tool";
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface UserStats {
  total_assessments: number;
  total_practice_logs: number;
  total_tasks_completed: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
}
