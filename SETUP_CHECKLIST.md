# Supabase 设置检查清单

请按照以下步骤完成 Supabase 设置：

## ✅ 步骤 1: 创建 Supabase 项目

- [ ] 1. 访问 https://supabase.com
- [ ] 2. 注册/登录账号
- [ ] 3. 点击 "New Project"
- [ ] 4. 填写项目信息：
  - Name: `mindreshape`
  - Database Password: **请记住你设置的密码**
  - Region: Northeast Asia (Tokyo)
  - Plan: Free
- [ ] 5. 等待项目初始化完成（2-3 分钟）

## ✅ 步骤 2: 获取 API 密钥

在 Supabase Dashboard 中：

- [ ] 1. 左侧菜单 → Settings (齿轮图标)
- [ ] 2. 点击 "API"
- [ ] 3. 复制以下三个值到 `.env.local`：

```
项目 URL (Project URL):
__________________________________________________

anon public key:
__________________________________________________

service_role key:
__________________________________________________
```

### 如何更新 .env.local

编辑文件 `/Users/raysolee/Documents/ai-products/mindreshape/.env.local`

替换为你的实际值：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...（很长的字符串）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...（很长的字符串）
```

## ✅ 步骤 3: 测试连接

完成配置后，在终端运行：

```bash
cd /Users/raysolee/Documents/ai-products/mindreshape
node scripts/test-supabase.js
```

**期望结果**：
```
🔍 测试 Supabase 连接...

1️⃣ 测试数据库连接...
⚠️  数据库表尚未创建
   请运行数据库迁移脚本

2️⃣ 测试认证服务...
✅ 认证服务正常！
```

如果看到上面的输出，说明连接成功！现在进入步骤 4。

## ✅ 步骤 4: 创建数据库表

### 方法 A: 使用 Supabase SQL 编辑器（推荐）

- [ ] 1. 在 Supabase Dashboard，点击左侧 "SQL Editor"
- [ ] 2. 点击 "New query"
- [ ] 3. 打开文件：`supabase/migrations/20241124_initial_schema.sql`
- [ ] 4. 复制**全部内容**到 SQL 编辑器
- [ ] 5. 点击 "Run" 执行
- [ ] 6. 等待执行完成（应该显示 "Success"）

### 验证数据库表

- [ ] 1. 点击左侧 "Table Editor"
- [ ] 2. 确认看到以下表：
  - ✅ profiles
  - ✅ user_stats
  - ✅ assessments
  - ✅ practice_logs
  - ✅ tasks
  - ✅ user_tasks

## ✅ 步骤 5: 配置认证设置

- [ ] 1. 左侧菜单 → "Authentication"
- [ ] 2. 点击 "Providers"
- [ ] 3. 确保 "Email" 已启用
- [ ] 4. 点击 "Email" 进入设置
- [ ] 5. 配置以下内容：

**Site URL (开发环境):**
```
http://localhost:3000
```

**Redirect URLs:**
```
http://localhost:3000/auth/callback
```

- [ ] 6. 点击 "Save" 保存

## ✅ 步骤 6: 重新测试连接

运行测试脚本：

```bash
node scripts/test-supabase.js
```

**期望结果**（数据库表已创建）：
```
🔍 测试 Supabase 连接...

1️⃣ 测试数据库连接...
✅ 数据库连接成功！

2️⃣ 测试认证服务...
✅ 认证服务正常！

🎉 所有测试通过！Supabase 配置正确。
```

## ✅ 步骤 7: 测试应用

重启开发服务器：

```bash
# 如果服务器还在运行，先停止（Ctrl+C）
npm run dev
```

**测试流程：**

1. 访问 http://localhost:3000
2. 点击"注册"
3. 填写信息：
   - 用户名: test
   - 邮箱: test@example.com
   - 密码: test123
4. 点击"注册"
5. 应该自动跳转到仪表板

**检查数据库：**

在 Supabase Dashboard：
- [ ] Table Editor → profiles → 看到新建的用户
- [ ] Table Editor → user_stats → 看到自动创建的统计记录

## 🎉 完成！

如果所有步骤都完成，你现在拥有：

✅ Supabase 项目已配置
✅ 数据库表已创建
✅ 认证系统可用
✅ 应用可以注册/登录

---

## ❓ 遇到问题？

### 问题 1: 连接失败
- 检查 .env.local 中的 URL 和密钥是否正确
- 确保没有多余的空格或引号
- 确保 Supabase 项目已完成初始化

### 问题 2: SQL 执行失败
- 确保复制了完整的 SQL 脚本
- 检查是否有错误提示
- 可以尝试分段执行

### 问题 3: 注册后没有跳转
- 检查浏览器控制台是否有错误
- 确保 RLS 策略已正确创建
- 检查认证设置中的 Redirect URLs

### 问题 4: 用户注册后 profile 未创建
- 检查触发器 `on_auth_user_created` 是否存在
- 在 SQL 编辑器中运行：
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

---

**准备好了吗？** 告诉我你完成到哪一步了！
