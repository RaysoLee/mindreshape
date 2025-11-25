-- 创建 questions 表（题目）
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  order_num INT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('single', 'multiple', 'text')),
  question_text TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, order_num)
);

-- 创建 question_options 表（选项）
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  order_num INT NOT NULL,
  score INT DEFAULT 0,
  dimension VARCHAR(50), -- 维度标签（用于多维度评分）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, order_num)
);

-- 创建 user_assessment_sessions 表（答题会话）
CREATE TABLE IF NOT EXISTS public.user_assessment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id),
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_data JSONB, -- 存储答题进度
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建 user_answers 表（用户答案）
CREATE TABLE IF NOT EXISTS public.user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.user_assessment_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id),
  answer_data JSONB NOT NULL, -- { "option_ids": [...], "text": "..." }
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- 创建 assessment_results 表（测试结果）
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.user_assessment_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id),
  total_score INT NOT NULL,
  max_score INT NOT NULL,
  dimension_scores JSONB, -- { "认知": 80, "情绪": 75, ... }
  insights JSONB, -- AI 生成的洞察
  action_plan JSONB, -- 行动建议
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON public.questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_options_question ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.user_assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_assessment ON public.user_assessment_sessions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_answers_session ON public.user_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_results_user ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_assessment ON public.assessment_results(assessment_id);

-- 启用 Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS 策略：questions（随 assessment 可见）
CREATE POLICY "Questions are viewable with published assessment" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.assessments
      WHERE assessments.id = questions.assessment_id
      AND assessments.is_published = true
    )
  );

-- RLS 策略：question_options（随 question 可见）
CREATE POLICY "Options are viewable with question" ON public.question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.assessments a ON a.id = q.assessment_id
      WHERE q.id = question_options.question_id
      AND a.is_published = true
    )
  );

-- RLS 策略：user_assessment_sessions
CREATE POLICY "Users can view their own sessions" ON public.user_assessment_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON public.user_assessment_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.user_assessment_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS 策略：user_answers
CREATE POLICY "Users can manage their own answers" ON public.user_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_assessment_sessions
      WHERE user_assessment_sessions.id = user_answers.session_id
      AND user_assessment_sessions.user_id = auth.uid()
    )
  );

-- RLS 策略：assessment_results
CREATE POLICY "Users can view their own results" ON public.assessment_results
  FOR SELECT USING (auth.uid() = user_id);

-- 触发器：自动更新 updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
