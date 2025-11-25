-- 插入示例测试
INSERT INTO public.assessments (id, title, description, category, difficulty, estimated_minutes, is_published)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    '认知偏差自我评估',
    '这个测试将帮助你了解自己在日常思维中可能存在的认知偏差倾向',
    'cognition',
    3,
    10,
    true
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    '决策风格测试',
    '了解你在面对选择时的决策模式和偏好',
    'decision',
    2,
    8,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 为"认知偏差自我评估"插入题目
INSERT INTO public.questions (id, assessment_id, order_num, type, question_text)
VALUES
  (
    '650e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    1,
    'single',
    '当你在网上看到一篇文章，标题符合你的观点时，你通常会？'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    2,
    'single',
    '你的朋友告诉你一个投资机会，他说已经赚了不少钱，你会？'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    3,
    'single',
    '在讨论中，当有人提出与你相反的观点时，你的第一反应是？'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    4,
    'single',
    '你倾向于记住哪些事情？'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440001',
    5,
    'single',
    '面对一个复杂问题时，你通常会？'
  )
ON CONFLICT DO NOTHING;

-- 为第1题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440001', '直接点进去阅读，因为这正是我想了解的', 1, 3, 'confirmation'),
  ('650e8400-e29b-41d4-a716-446655440001', '先看看作者和来源是否可靠', 2, 1, 'confirmation'),
  ('650e8400-e29b-41d4-a716-446655440001', '同时搜索相反观点的文章来对比', 3, 0, 'confirmation'),
  ('650e8400-e29b-41d4-a716-446655440001', '分享给朋友，让他们也看看', 4, 2, 'confirmation')
ON CONFLICT DO NOTHING;

-- 为第2题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440002', '立即投资，朋友赚钱了说明这是好机会', 1, 3, 'availability'),
  ('650e8400-e29b-41d4-a716-446655440002', '询问更多细节，但主要相信朋友的判断', 2, 2, 'availability'),
  ('650e8400-e29b-41d4-a716-446655440002', '自己研究这个投资，不只看朋友的经验', 3, 0, 'availability'),
  ('650e8400-e29b-41d4-a716-446655440002', '完全不考虑，因为听起来太好了不像真的', 4, 1, 'availability')
ON CONFLICT DO NOTHING;

-- 为第3题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440003', '寻找对方观点的漏洞来反驳', 1, 3, 'confirmation'),
  ('650e8400-e29b-41d4-a716-446655440003', '倾听但内心坚持自己的看法', 2, 2, 'confirmation'),
  ('650e8400-e29b-41d4-a716-446655440003', '认真思考对方的观点是否有道理', 3, 0, 'confirmation'),
  ('650e8400-e29b-41d4-a716-446655440003', '避免深入讨论，转移话题', 4, 1, 'confirmation')
ON CONFLICT DO NOTHING;

-- 为第4题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440004', '符合我期望的结果', 1, 3, 'confirmation'),
  ('650e8400-e29b-41d4-a716-446655440004', '让我印象深刻的特殊案例', 2, 2, 'availability'),
  ('650e8400-e29b-41d4-a716-446655440004', '所有重要的事情，无论好坏', 3, 0, 'balanced'),
  ('650e8400-e29b-41d4-a716-446655440004', '主要是负面的经历', 4, 2, 'negativity')
ON CONFLICT DO NOTHING;

-- 为第5题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440005', '快速做出直觉判断', 1, 2, 'intuition'),
  ('650e8400-e29b-41d4-a716-446655440005', '寻找最简单的解决方案', 2, 2, 'simplification'),
  ('650e8400-e29b-41d4-a716-446655440005', '系统地分析所有因素', 3, 0, 'analytical'),
  ('650e8400-e29b-41d4-a716-446655440005', '询问他人的意见和经验', 4, 1, 'social')
ON CONFLICT DO NOTHING;

-- 为"决策风格测试"插入几个题目
INSERT INTO public.questions (id, assessment_id, order_num, type, question_text)
VALUES
  (
    '650e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440002',
    1,
    'single',
    '购买大件商品时，你会？'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440002',
    2,
    'single',
    '做重要决定时，你最依赖什么？'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440002',
    3,
    'single',
    '当有多个选项时，你倾向于？'
  )
ON CONFLICT DO NOTHING;

-- 为决策测试第1题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440006', '冲动购买，看中了就买', 1, 3, 'impulsive'),
  ('650e8400-e29b-41d4-a716-446655440006', '对比几个产品后快速决定', 2, 1, 'moderate'),
  ('650e8400-e29b-41d4-a716-446655440006', '详细研究，列出优缺点对比', 3, 0, 'analytical'),
  ('650e8400-e29b-41d4-a716-446655440006', '反复犹豫，很难做决定', 4, 2, 'indecisive')
ON CONFLICT DO NOTHING;

-- 为决策测试第2题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440007', '直觉和感觉', 1, 2, 'intuitive'),
  ('650e8400-e29b-41d4-a716-446655440007', '理性分析和数据', 2, 0, 'rational'),
  ('650e8400-e29b-41d4-a716-446655440007', '他人的建议和意见', 3, 1, 'social'),
  ('650e8400-e29b-41d4-a716-446655440007', '过往的经验', 4, 1, 'experiential')
ON CONFLICT DO NOTHING;

-- 为决策测试第3题插入选项
INSERT INTO public.question_options (question_id, option_text, order_num, score, dimension)
VALUES
  ('650e8400-e29b-41d4-a716-446655440008', '选择第一个看起来不错的', 1, 2, 'satisficing'),
  ('650e8400-e29b-41d4-a716-446655440008', '全部比较，找最优的', 2, 0, 'maximizing'),
  ('650e8400-e29b-41d4-a716-446655440008', '随机选一个，反正差不多', 3, 3, 'random'),
  ('650e8400-e29b-41d4-a716-446655440008', '让别人帮我决定', 4, 2, 'delegating')
ON CONFLICT DO NOTHING;
