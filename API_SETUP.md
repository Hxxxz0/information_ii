# 🔑 API 配置指南

本应用支持两种 AI 提供商：**Google Gemini** 和 **DeepSeek**。您可以在设置中选择使用哪个提供商。

## 📋 支持的 AI 提供商

### 1. Google Gemini
- **模型**: gemini-2.5-flash
- **优势**: 多模态理解、快速响应
- **获取 API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. DeepSeek
- **模型**: deepseek-chat
- **优势**: 高性能中文支持、深度推理
- **获取 API Key**: [DeepSeek Platform](https://platform.deepseek.com/api_keys)

## 🚀 快速开始

### 步骤 1: 获取 API Key

#### Gemini API Key
1. 访问 https://aistudio.google.com/app/apikey
2. 使用 Google 账号登录
3. 点击 "Create API Key"
4. 复制生成的 API key

#### DeepSeek API Key
1. 访问 https://platform.deepseek.com/api_keys
2. 注册/登录账号
3. 创建新的 API key
4. 复制生成的 API key

### 步骤 2: 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# Gemini API Key (可选)
GEMINI_API_KEY=your_gemini_api_key_here

# DeepSeek API Key (可选)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**注意**: 至少配置一个 API key，应用才能正常工作。

### 步骤 3: 安装依赖并运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

### 步骤 4: 在应用中选择 AI 提供商

1. 启动应用后，打开 **设置** (Settings)
2. 在 "AI 提供商" 部分选择您想使用的提供商
3. 确认对应的 API key 已配置
4. 点击 "保存设置"

## 🔐 安全性说明

### ⚠️ 当前实现（开发/演示）

当前应用是**纯前端应用**，API key 会被打包到前端代码中。这意味着：

- ❌ API key 可以在浏览器开发者工具中查看
- ❌ 任何人都可以复制您的 API key
- ⚠️ 仅适合开发和演示环境

### ✅ 生产环境建议

为了保护您的 API key，生产环境应该使用以下方案之一：

#### 方案 1: 后端代理服务器
创建一个后端服务器来代理 API 请求：
- API key 只存储在服务器端
- 前端通过您的服务器调用 AI API
- 可以添加速率限制和用户认证

#### 方案 2: Serverless Functions
使用 Vercel/Netlify Functions：
- 无需管理服务器
- API key 存储在环境变量中
- 自动扩展

#### 方案 3: API Key 限制
在 AI 提供商平台设置限制：
- 限制允许的域名
- 设置请求频率限制
- 设置使用配额

## 📊 API 使用说明

### Gemini API
```typescript
// 聊天对话
await aiService.sendMessage("你的问题");

// 生成考试题目
await aiService.generateExamQuestions("主题", 3);
```

### DeepSeek API
```typescript
// 使用相同的接口
await aiService.sendMessage("你的问题");
await aiService.generateExamQuestions("主题", 3);
```

### 切换 AI 提供商
```typescript
// 在代码中切换
import { aiService } from './services/aiService';

aiService.setProvider('gemini');  // 使用 Gemini
aiService.setProvider('deepseek'); // 使用 DeepSeek
```

## 🛠️ 故障排除

### 问题: "演示模式" 提示
**原因**: API key 未正确配置

**解决方案**:
1. 检查 `.env.local` 文件是否存在
2. 确认 API key 格式正确（无多余空格）
3. 重启开发服务器 (`npm run dev`)

### 问题: API 调用失败
**原因**: API key 无效或网络问题

**解决方案**:
1. 验证 API key 是否有效
2. 检查 API 配额是否用完
3. 查看浏览器控制台错误信息

### 问题: 无法切换 AI 提供商
**原因**: 未保存设置

**解决方案**:
1. 在设置页面选择提供商后点击 "保存设置"
2. 刷新页面

## 📝 环境变量说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `GEMINI_API_KEY` | 可选* | Google Gemini API 密钥 |
| `DEEPSEEK_API_KEY` | 可选* | DeepSeek API 密钥 |

\* 至少需要配置一个

## 🔗 相关链接

- [Google AI Studio](https://aistudio.google.com/)
- [DeepSeek Platform](https://platform.deepseek.com/)
- [项目文档](./TECHNICAL_DOCUMENTATION.md)

## 💡 最佳实践

1. **不要提交 API key 到 Git**: `.env.local` 已在 `.gitignore` 中
2. **定期轮换 API key**: 定期更新您的 API key
3. **监控使用量**: 在提供商平台监控 API 使用情况
4. **设置预算警报**: 避免意外的高额费用
