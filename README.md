# MindReShape - 思维模式探索与重塑平台

基于 AI 的思维模式探索与重塑 Web 应用。

## 🚀 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL + pgvector)
- **认证**: Supabase Auth
- **AI**: OpenAI + LangChain
- **文件存储**: Cloudflare R2
- **状态管理**: Zustand + TanStack Query
- **表单**: React Hook Form + Zod

## 📦 安装

```bash
# 克隆项目
git clone <your-repo-url>

# 进入项目目录
cd mindreshape

# 安装依赖
npm install --legacy-peer-deps

# 配置环境变量
cp .env.example .env.local
# 然后编辑 .env.local 填入你的配置
```

## 🔧 环境变量配置

在 `.env.local` 中配置以下环境变量：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-key

# Cloudflare R2 (可选)
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CLOUDFLARE_R2_BUCKET_NAME=mindreshape
CLOUDFLARE_R2_PUBLIC_URL=https://your-r2-public-url
```

## 🏃 运行

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start
```

访问 http://localhost:3000

## 📁 项目结构

```
mindreshape/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   ├── components/          # React 组件
│   │   ├── ui/             # shadcn/ui 组件
│   │   ├── auth/           # 认证组件
│   │   ├── dashboard/      # 仪表板组件
│   │   ├── chat/           # AI 聊天组件
│   │   ├── practice/       # 实践记录组件
│   │   └── tasks/          # 任务组件
│   ├── lib/                # 工具库
│   │   ├── supabase/       # Supabase 客户端
│   │   ├── ai/             # AI 相关工具
│   │   └── utils.ts        # 通用工具函数
│   ├── hooks/              # 自定义 Hooks
│   ├── types/              # TypeScript 类型定义
│   └── services/           # API 服务
├── public/                 # 静态资源
└── docs/                   # 文档
```

## 🎯 当前进度

### ✅ 已完成
- [x] 项目初始化和配置
- [x] Next.js + TypeScript 搭建
- [x] Tailwind CSS 配置
- [x] Supabase 客户端配置
- [x] 基础目录结构
- [x] 首页设计

### 🚧 进行中
- [ ] shadcn/ui 组件安装
- [ ] 认证系统实现
- [ ] 仪表板页面

### 📋 待开发
- [ ] 测试模块
- [ ] AI 聊天功能
- [ ] 实践记录功能
- [ ] 任务系统
- [ ] 数据可视化

## 📝 开发文档

详细的设计文档在 `/Users/raysolee/Documents/ai-products/` 目录下：

- `MindReShape_Web_Architecture.md` - 整体架构设计
- `MindReShape_TaskList.md` - 开发任务清单
- `MindReShape_DataAPI_Design.md` - 数据库和 API 设计
- `MindReShape_CodeExamples.md` - 代码示例

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT
