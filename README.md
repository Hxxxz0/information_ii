<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 运行和部署您的 AI Studio 应用

这里包含了在本地运行应用所需的一切。

在 AI Studio 中查看您的应用：https://ai.studio/apps/drive/1TAoHRUQc6lImrNtNP33Nz34ELWAeLskh

## 本地运行

**前置要求：** Node.js

### 快速开始

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **配置 API Key**：
   
   复制环境变量示例文件：
   ```bash
   cp .env.local.example .env.local
   ```
   
   然后编辑 `.env.local` 文件，添加您的 API key：
   ```bash
   # 选择一个或两个都配置
   GEMINI_API_KEY=your_gemini_api_key_here
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```
   
   **获取 API Key**:
   - **Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **DeepSeek**: [DeepSeek Platform](https://platform.deepseek.com/api_keys)

3. **运行应用**：
   ```bash
   npm run dev
   ```

4. **选择 AI 提供商**：
   - 打开应用后，进入 **设置** 页面
   - 在 "AI 提供商" 部分选择 Gemini 或 DeepSeek
   - 保存设置

### 📖 详细配置指南

查看 [API_SETUP.md](./API_SETUP.md) 获取完整的配置说明和安全建议。

## 🤖 支持的 AI 模型

本应用支持两种 AI 提供商：

| 提供商 | 模型 | 特点 |
|--------|------|------|
| **Google Gemini** | gemini-2.5-flash | 多模态理解、快速响应 |
| **DeepSeek** | deepseek-chat | 高性能中文支持、深度推理 |

您可以在应用设置中随时切换。

