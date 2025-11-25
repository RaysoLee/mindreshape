# MindReShape 部署指南

## 📋 部署前准备

### 1. 完成数据库迁移

在 Supabase Dashboard 的 SQL Editor 中**按顺序**运行以下迁移脚本：

```sql
-- 1. 添加测试题目表
-- 内容：supabase/migrations/20241125_add_questions.sql

-- 2. 插入示例测试数据
-- 内容：supabase/migrations/20241125_sample_data.sql

-- 3. 添加 AI 对话表
-- 内容：supabase/migrations/20241125_add_chat.sql

-- 4. 插入示例任务数据
-- 内容：supabase/migrations/20241125_sample_tasks.sql

-- 5. 添加积分系统函数
-- 内容：supabase/migrations/20241125_add_points_function.sql
```

**验证迁移成功**：
- 在 Supabase Table Editor 中检查所有表是否已创建
- 确认 `assessments` 表有 2 条测试数据
- 确认 `questions` 表有 8 条题目
- 确认 `tasks` 表有 10 条任务数据

### 2. 准备环境变量

创建 `.env.production` 文件（或在 Vercel 中配置）：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的Supabase服务角色密钥

# Anthropic Claude API（可选，不配置则AI对话功能不可用）
ANTHROPIC_API_KEY=你的Anthropic_API密钥
```

**获取 Supabase 密钥**：
1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 点击左侧 Settings → API
4. 复制 `Project URL` 和 `anon public` 密钥

**获取 Anthropic API Key**（可选）：
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账号
3. 创建 API Key

---

## 🚀 方式一：部署到 Vercel（推荐）

### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: MindReShape project"

# 连接远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/mindreshape.git

# 推送到 GitHub
git push -u origin main
```

### 步骤 2: 在 Vercel 中导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库 `mindreshape`
4. 点击 "Import"

### 步骤 3: 配置环境变量

在 Vercel 项目设置中：

1. 进入 "Settings" → "Environment Variables"
2. 添加以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`（可选）

3. 确保所有环境变量都选择 "Production", "Preview", "Development"

### 步骤 4: 部署设置

在 "Settings" → "General" 中确认：

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm install --legacy-peer-deps`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x 或 20.x

### 步骤 5: 触发部署

1. 点击 "Deployments" 标签
2. 点击 "Redeploy" 或等待自动部署
3. 等待构建完成（约 2-5 分钟）

### 步骤 6: 验证部署

部署成功后：

1. 访问 Vercel 提供的域名（例如：`mindreshape.vercel.app`）
2. 测试注册功能
3. 完成一个测试
4. 检查所有页面是否正常工作

---

## 🌐 方式二：自定义域名（可选）

### 在 Vercel 中配置自定义域名

1. 在项目中点击 "Settings" → "Domains"
2. 添加你的域名（例如：`mindreshape.com`）
3. 按照提示配置 DNS 记录：
   - **A 记录**：指向 Vercel 提供的 IP
   - **CNAME 记录**：`www` 指向你的 Vercel 域名

4. 等待 DNS 生效（可能需要几分钟到几小时）
5. Vercel 会自动配置 SSL 证书

---

## 🐳 方式三：Docker 部署（高级）

### 创建 Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t mindreshape .

# 运行容器
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=你的URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=你的KEY \
  mindreshape
```

---

## ✅ 部署后检查清单

- [ ] 所有数据库迁移已运行
- [ ] 环境变量已正确配置
- [ ] 用户可以注册和登录
- [ ] 测试列表页面显示 2 个测试
- [ ] 可以完成测试并查看结果
- [ ] 实践记录功能正常
- [ ] 任务列表显示 10 个任务
- [ ] 可以添加任务到今日并打卡
- [ ] AI 对话功能正常（如果配置了 API key）
- [ ] 所有页面响应式设计正常（移动端测试）

---

## 🔧 常见问题

### 1. 构建失败：依赖冲突

**解决方案**：
在 Vercel 项目设置中，将 Install Command 改为：
```bash
npm install --legacy-peer-deps
```

### 2. 数据库连接失败

**检查**：
- Supabase URL 和 Key 是否正确
- 环境变量名称是否完全匹配
- 是否在 Vercel 的所有环境（Production/Preview/Development）中都配置了

### 3. API 路由 404

**确认**：
- `src/app/api` 目录结构正确
- Next.js 版本是 14.x
- 没有冲突的中间件

### 4. Supabase RLS 策略问题

**确认**：
- 所有表都启用了 RLS
- 策略正确配置
- 使用正确的 Supabase 客户端（browser vs server）

### 5. Node.js 版本警告

**解决**：
- 推荐使用 Node.js 20.x
- 在 Vercel 中设置 Node.js 版本为 20.x
- 本地开发也升级到 Node.js 20+

---

## 📊 性能优化建议（可选）

### 1. 启用图片优化

在 `next.config.mjs` 中配置：
```javascript
images: {
  domains: ['your-supabase-url.supabase.co'],
}
```

### 2. 启用增量静态生成

对于不常变化的页面：
```typescript
export const revalidate = 3600; // 每小时重新生成
```

### 3. 配置 CDN 缓存

Vercel 已自动配置，但可以自定义缓存策略。

---

## 🎉 部署成功！

访问你的网站开始使用 MindReShape！

如有问题，请查看：
- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
