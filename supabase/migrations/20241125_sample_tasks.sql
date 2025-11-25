-- 插入示例任务数据

-- 每日任务
INSERT INTO public.tasks (id, title, description, type, category, difficulty, estimated_minutes, steps, tips, resources, tags)
VALUES
  (
    '750e8400-e29b-41d4-a716-446655440001',
    '三个角度思考练习',
    '选择今天遇到的一个情境，从三个不同角度进行思考，培养多元视角',
    'daily',
    'thinking',
    1,
    10,
    '[
      {"order": 1, "title": "选择一个情境", "description": "回想今天让你有强烈感受的一件事"},
      {"order": 2, "title": "记录第一反应", "description": "写下你的第一想法和感受"},
      {"order": 3, "title": "换位思考", "description": "从对方或第三者角度思考这件事"},
      {"order": 4, "title": "事实检查", "description": "区分哪些是事实，哪些是你的解读"},
      {"order": 5, "title": "总结收获", "description": "记录通过多角度思考得到的新认识"}
    ]'::jsonb,
    ARRAY['保持开放心态', '不要急于下结论', '尝试理解而非评判'],
    '[
      {"type": "article", "title": "批判性思维入门", "url": "#"},
      {"type": "video", "title": "如何培养多元视角", "url": "#"}
    ]'::jsonb,
    ARRAY['批判性思维', '认知训练', '每日练习']
  ),
  (
    '750e8400-e29b-41d4-a716-446655440002',
    '证据收集练习',
    '针对一个观点或决定，主动寻找支持和反对的证据',
    'daily',
    'thinking',
    2,
    15,
    '[
      {"order": 1, "title": "确定观点", "description": "选择一个你最近形成的观点或要做的决定"},
      {"order": 2, "title": "列出支持证据", "description": "找出3-5个支持这个观点的理由或证据"},
      {"order": 3, "title": "寻找反对证据", "description": "主动寻找3-5个反对或质疑的理由"},
      {"order": 4, "title": "评估证据质量", "description": "判断哪些是客观事实，哪些是主观臆断"},
      {"order": 5, "title": "得出结论", "description": "基于证据重新评估你的观点是否需要调整"}
    ]'::jsonb,
    ARRAY['主动寻找相反意见', '区分事实和观点', '保持理性客观'],
    '[
      {"type": "article", "title": "证据思维方法", "url": "#"},
      {"type": "book", "title": "《思考，快与慢》", "author": "丹尼尔·卡尼曼"}
    ]'::jsonb,
    ARRAY['证据思维', '理性决策', '认知训练']
  ),
  (
    '750e8400-e29b-41d4-a716-446655440003',
    '情绪日记',
    '记录并分析一天中的情绪波动，识别情绪背后的想法',
    'daily',
    'emotion',
    1,
    15,
    '[
      {"order": 1, "title": "回顾一天", "description": "想想今天有哪些情绪起伏"},
      {"order": 2, "title": "选择一个情绪", "description": "选择最强烈的一个情绪（积极或消极）"},
      {"order": 3, "title": "描述情境", "description": "什么事情引发了这个情绪？"},
      {"order": 4, "title": "识别想法", "description": "当时脑海中闪过什么想法？"},
      {"order": 5, "title": "检查偏差", "description": "这些想法中有认知偏差吗？"},
      {"order": 6, "title": "重新框架", "description": "用更客观的方式重新思考"}
    ]'::jsonb,
    ARRAY['情绪是想法的产物', '观察而不评判', '耐心记录'],
    '[
      {"type": "article", "title": "情绪ABC理论", "url": "#"},
      {"type": "tool", "title": "情绪记录表", "url": "#"}
    ]'::jsonb,
    ARRAY['情绪管理', '自我觉察', '认知重构']
  );

-- 每周任务
INSERT INTO public.tasks (id, title, description, type, category, difficulty, estimated_minutes, steps, tips, resources, tags)
VALUES
  (
    '750e8400-e29b-41d4-a716-446655440004',
    '一周回顾与反思',
    '回顾本周的思维记录，识别模式和进步',
    'weekly',
    'reflection',
    2,
    30,
    '[
      {"order": 1, "title": "整理记录", "description": "查看本周的实践记录和测试结果"},
      {"order": 2, "title": "识别模式", "description": "找出重复出现的思维模式或认知偏差"},
      {"order": 3, "title": "庆祝进步", "description": "记录哪些方面有了改善"},
      {"order": 4, "title": "找出挑战", "description": "哪些认知偏差最难克服？"},
      {"order": 5, "title": "制定计划", "description": "下周重点关注哪个方面？"}
    ]'::jsonb,
    ARRAY['诚实面对自己', '关注进步不完美', '设定可行目标'],
    '[
      {"type": "template", "title": "周回顾模板", "url": "#"},
      {"type": "article", "title": "如何做有效回顾", "url": "#"}
    ]'::jsonb,
    ARRAY['周回顾', '自我反思', '持续改进']
  ),
  (
    '750e8400-e29b-41d4-a716-446655440005',
    '偏见挑战周',
    '选择一个认知偏差，一周内刻意练习克服它',
    'weekly',
    'challenge',
    3,
    20,
    '[
      {"order": 1, "title": "选择偏差", "description": "从测试结果中选择一个要克服的认知偏差"},
      {"order": 2, "title": "学习了解", "description": "深入了解这个偏差的表现和影响"},
      {"order": 3, "title": "设定目标", "description": "每天至少识别一次这个偏差"},
      {"order": 4, "title": "应用策略", "description": "使用针对性的方法来对抗这个偏差"},
      {"order": 5, "title": "记录过程", "description": "每天记录练习情况和感受"},
      {"order": 6, "title": "评估效果", "description": "周末评估这周的练习效果"}
    ]'::jsonb,
    ARRAY['选择最影响你的偏差', '每天坚持练习', '不要过于苛求自己'],
    '[
      {"type": "guide", "title": "各类认知偏差应对指南", "url": "#"},
      {"type": "community", "title": "加入讨论小组", "url": "#"}
    ]'::jsonb,
    ARRAY['深度练习', '认知重塑', '行为改变']
  ),
  (
    '750e8400-e29b-41d4-a716-446655440006',
    '决策复盘',
    '回顾本周做的重要决定，分析决策过程',
    'weekly',
    'decision',
    2,
    25,
    '[
      {"order": 1, "title": "列出决策", "description": "本周做了哪些重要决定？"},
      {"order": 2, "title": "还原过程", "description": "当时是如何思考和决定的？"},
      {"order": 3, "title": "识别影响因素", "description": "哪些因素影响了你的决定？"},
      {"order": 4, "title": "检查偏差", "description": "决策过程中有认知偏差吗？"},
      {"order": 5, "title": "评估结果", "description": "目前看来决策效果如何？"},
      {"order": 6, "title": "总结经验", "description": "下次可以如何改进决策过程？"}
    ]'::jsonb,
    ARRAY['关注过程而非结果', '结果好不代表决策好', '保持学习心态'],
    '[
      {"type": "article", "title": "理性决策框架", "url": "#"},
      {"type": "checklist", "title": "决策检查清单", "url": "#"}
    ]'::jsonb,
    ARRAY['决策分析', '反思复盘', '持续优化']
  );

-- 自定义任务
INSERT INTO public.tasks (id, title, description, type, category, difficulty, estimated_minutes, steps, tips, resources, tags)
VALUES
  (
    '750e8400-e29b-41d4-a716-446655440007',
    '阅读认知心理学书籍',
    '选择一本认知心理学相关书籍，系统学习思维规律',
    'custom',
    'learning',
    3,
    120,
    '[
      {"order": 1, "title": "选择书籍", "description": "从推荐书单中选择感兴趣的书"},
      {"order": 2, "title": "制定计划", "description": "设定阅读进度和时间安排"},
      {"order": 3, "title": "主动阅读", "description": "边读边思考，做笔记和标注"},
      {"order": 4, "title": "联系实际", "description": "想想书中内容如何应用到生活中"},
      {"order": 5, "title": "分享交流", "description": "与他人讨论你的收获"}
    ]'::jsonb,
    ARRAY['选择适合自己水平的书', '不要追求速度', '重在理解和应用'],
    '[
      {"type": "book", "title": "《思考，快与慢》", "author": "丹尼尔·卡尼曼"},
      {"type": "book", "title": "《清醒思考的艺术》", "author": "罗尔夫·多贝里"},
      {"type": "book", "title": "《超越智商》", "author": "基思·斯坦诺维奇"}
    ]'::jsonb,
    ARRAY['深度学习', '认知科学', '自我提升']
  ),
  (
    '750e8400-e29b-41d4-a716-446655440008',
    '与朋友讨论认知偏差',
    '找一位朋友，分享你学到的认知偏差知识',
    'custom',
    'social',
    2,
    45,
    '[
      {"order": 1, "title": "准备材料", "description": "整理你想分享的认知偏差实例"},
      {"order": 2, "title": "选择时机", "description": "找一个合适的轻松环境"},
      {"order": 3, "title": "分享案例", "description": "用生活中的例子解释认知偏差"},
      {"order": 4, "title": "倾听反馈", "description": "听听对方的想法和经历"},
      {"order": 5, "title": "互相学习", "description": "一起探讨如何应对这些偏差"}
    ]'::jsonb,
    ARRAY['选择感兴趣的朋友', '用通俗语言解释', '重在交流不在说教'],
    '[
      {"type": "guide", "title": "如何向他人介绍认知偏差", "url": "#"}
    ]'::jsonb,
    ARRAY['社交学习', '知识分享', '互助成长']
  ),
  (
    '750e8400-e29b-41d4-a716-446655440009',
    '冥想与正念练习',
    '通过冥想培养觉察力，更好地观察自己的思维',
    'custom',
    'mindfulness',
    2,
    20,
    '[
      {"order": 1, "title": "找安静环境", "description": "选择一个不受打扰的地方"},
      {"order": 2, "title": "设定时间", "description": "初学者从5-10分钟开始"},
      {"order": 3, "title": "关注呼吸", "description": "将注意力放在呼吸上"},
      {"order": 4, "title": "观察想法", "description": "当思绪出现，不评判地观察它"},
      {"order": 5, "title": "回到呼吸", "description": "温和地将注意力带回呼吸"},
      {"order": 6, "title": "逐步延长", "description": "随着练习增加时长"}
    ]'::jsonb,
    ARRAY['规律练习比时长重要', '走神是正常的', '耐心和温柔对待自己'],
    '[
      {"type": "app", "title": "冥想APP推荐", "url": "#"},
      {"type": "video", "title": "正念冥想入门", "url": "#"},
      {"type": "guide", "title": "冥想初学者指南", "url": "#"}
    ]'::jsonb,
    ARRAY['正念', '冥想', '觉察力']
  ),
  (
    '750e8400-e29b-41d4-a716-446655440010',
    '信息来源多元化',
    '有意识地接触不同观点的信息源，打破信息茧房',
    'custom',
    'information',
    2,
    30,
    '[
      {"order": 1, "title": "审视现状", "description": "列出你常用的信息来源"},
      {"order": 2, "title": "识别倾向", "description": "这些信息源有相似的立场吗？"},
      {"order": 3, "title": "寻找多样性", "description": "找出持不同观点的优质信息源"},
      {"order": 4, "title": "平衡接收", "description": "每周至少阅读一篇不同观点的内容"},
      {"order": 5, "title": "批判思考", "description": "对所有信息保持质疑和思考"}
    ]'::jsonb,
    ARRAY['多样不等于极端', '质量比数量重要', '保持开放但理性'],
    '[
      {"type": "article", "title": "如何打破信息茧房", "url": "#"},
      {"type": "guide", "title": "信息素养提升指南", "url": "#"}
    ]'::jsonb,
    ARRAY['信息素养', '多元视角', '确认偏差']
  );
