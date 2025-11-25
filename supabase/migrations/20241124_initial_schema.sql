-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 创建 profiles 表（用户资料扩展）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 user_stats 表（用户统计）
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_assessments INT DEFAULT 0,
  total_practice_logs INT DEFAULT 0,
  total_tasks_completed INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_points INT DEFAULT 0,
  last_active_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 assessments 表（测试/量表）
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  difficulty INT CHECK (difficulty BETWEEN 1 AND 5),
  estimated_minutes INT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  version INT DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 practice_logs 表（实践记录）
CREATE TABLE IF NOT EXISTS public.practice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  situation TEXT NOT NULL,
  original_thought TEXT NOT NULL,
  bias_types TEXT[],
  reframed_thought TEXT,
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
  category VARCHAR(50),
  tags TEXT[],
  image_urls TEXT[],
  notes TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 tasks 表（任务模板）
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) CHECK (type IN ('daily', 'weekly', 'custom')),
  category VARCHAR(50),
  difficulty INT CHECK (difficulty BETWEEN 1 AND 3),
  estimated_minutes INT,
  steps JSONB,
  tips TEXT[],
  resources JSONB,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 user_tasks 表（用户任务）
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id, assigned_date)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_practice_logs_user ON public.practice_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_logs_occurred ON public.practice_logs(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_category ON public.assessments(category);
CREATE INDEX IF NOT EXISTS idx_assessments_published ON public.assessments(is_published);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user ON public.user_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tasks_date ON public.user_tasks(assigned_date DESC);

-- 启用 Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

-- RLS 策略：profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS 策略：user_stats
CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS 策略：assessments（已发布的所有人可见）
CREATE POLICY "Published assessments are viewable by all authenticated users"
  ON public.assessments FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);

-- RLS 策略：practice_logs
CREATE POLICY "Users can manage their own practice logs" ON public.practice_logs
  FOR ALL USING (auth.uid() = user_id);

-- RLS 策略：tasks（所有人可读，但不能修改）
CREATE POLICY "Tasks are viewable by all authenticated users"
  ON public.tasks FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);

-- RLS 策略：user_tasks
CREATE POLICY "Users can manage their own tasks" ON public.user_tasks
  FOR ALL USING (auth.uid() = user_id);

-- 创建触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_logs_updated_at
  BEFORE UPDATE ON public.practice_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建函数：初始化用户统计
CREATE OR REPLACE FUNCTION init_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 当用户注册时自动创建统计记录
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION init_user_stats();
