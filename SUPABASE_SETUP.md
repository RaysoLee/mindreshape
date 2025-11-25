# Supabase 设置指南

## 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 注册/登录
3. 创建新组织（如果还没有）
4. 点击 "New Project"
5. 填写项目信息：
   - **Name**: mindreshape
   - **Database Password**: 设置一个强密码（请保存好）
   - **Region**: 选择最近的区域（如 Northeast Asia (Tokyo)）
   - **Pricing Plan**: Free（免费层）
6. 点击 "Create new project"，等待几分钟初始化

## 2. 获取 API 密钥

项目创建完成后：

1. 进入项目设置：左侧菜单 → Settings → API
2. 复制以下信息到 `.env.local`：
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: `SUPABASE_SERVICE_ROLE_KEY`（谨慎使用）

## 3. 创建数据库表

### 方式一：使用 SQL 编辑器（推荐）

1. 在 Supabase 仪表板，进入 "SQL Editor"
2. 点击 "New query"
3. 复制 `supabase/migrations/20241124_initial_schema.sql` 的内容
4. 粘贴到编辑器中
5. 点击 "Run" 执行

### 方式二：使用 Supabase CLI

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接到你的项目
supabase link --project-ref <your-project-ref>

# 运行迁移
supabase db push
```

## 4. 配置认证设置

1. 进入 Authentication → Providers
2. **Email** 提供商：
   - 启用 Email provider
   - 确认 "Enable email confirmations" 已启用
   - 设置 "Site URL": `http://localhost:3000`（开发环境）
   - 设置 "Redirect URLs":
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`（生产环境）

3. **（可选）配置 OAuth**：
   - Google: 需要 Google Cloud Console 创建 OAuth 客户端
   - GitHub: 需要 GitHub OAuth App

## 5. 验证安装

在 Supabase 仪表板的 "Table Editor" 中，你应该看到以下表：

- ✅ profiles
- ✅ user_stats
- ✅ assessments
- ✅ practice_logs
- ✅ tasks
- ✅ user_tasks

## 6. 测试连接

在项目根目录创建 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

重启开发服务器：

```bash
npm run dev
```

## 7. 插入示例数据（可选）

在 SQL 编辑器中运行：

```sql
-- 插入示例测试
INSERT INTO public.assessments (title, description, category, difficulty, is_published)
VALUES
  ('认知偏差测试', '评估你的认知偏差倾向', 'cognition', 3, true),
  ('决策模式评估', '了解你的决策风格', 'decision', 2, true);

-- 插入示例任务
INSERT INTO public.tasks (title, description, type, category, difficulty, steps)
VALUES
  (
    '识别确认偏差',
    '在日常对话中识别确认偏差的3个实例',
    'daily',
    'awareness',
    1,
    '[{"title": "观察", "description": "留意自己只寻找支持观点的证据"}]'::jsonb
  ),
  (
    '挑战负面思维',
    '记录并重构3个负面想法',
    'daily',
    'reframing',
    2,
    '[{"title": "记录", "description": "写下负面想法"}, {"title": "挑战", "description": "寻找替代解释"}]'::jsonb
  );
```

## 8. 启用实时订阅（可选）

如果需要实时功能：

1. 进入 Database → Replication
2. 选择要启用实时的表
3. 点击 "Enable Replication"

## 9. 配置存储桶（可选）

如果需要文件上传功能：

1. 进入 Storage
2. 创建新桶：`avatars`, `practice-images`
3. 设置访问策略（Public/Private）

## 10. 安全检查清单

- [ ] 启用了 Row Level Security (RLS)
- [ ] 配置了正确的 RLS 策略
- [ ] service_role_key 只在服务端使用
- [ ] 生产环境使用 HTTPS
- [ ] 配置了正确的 redirect URLs
- [ ] 数据库密码足够强

## 常见问题

### Q: 注册后没有创建 profile？
A: 检查 `init_user_stats()` 函数和触发器是否正确创建。

### Q: RLS 阻止了我的查询？
A: 确保你的 RLS 策略正确，使用 `auth.uid()` 而不是 `current_user_id()`。

### Q: 邮件验证链接无效？
A: 检查 Authentication → Settings 中的 Site URL 和 Redirect URLs 配置。

## 下一步

- 阅读 [Supabase 文档](https://supabase.com/docs)
- 了解 [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- 探索 [Supabase CLI](https://supabase.com/docs/guides/cli)

---

**设置完成后，你就可以开始使用认证和数据库功能了！** 🎉
