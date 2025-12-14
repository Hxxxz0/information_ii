# 📱 在应用中设置 API Key 使用指南

## ✅ 是的！现在可以在应用内设置 API Key 了

您现在有**两种方式**配置 API Key：

---

## 方式 1: 在应用设置中配置（推荐）⭐

### 步骤：

1. **打开应用**
   - 访问 http://localhost:3000

2. **进入设置页面**
   - 点击右下角的 Dock 中的 **设置图标**
   - 或者在应用中找到 **Settings** 选项

3. **选择 AI 提供商**
   - 在 "AI 提供商" 部分
   - 选择 **Google Gemini** 或 **DeepSeek**

4. **输入 API Key**
   - 在 "API 密钥" 部分
   - 输入对应的 API key
   - Gemini: 从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取
   - DeepSeek: 从 [DeepSeek Platform](https://platform.deepseek.com/api_keys) 获取

5. **保存设置**
   - 点击 **"保存设置"** 按钮
   - 会提示 "API Key 已保存！请刷新页面以应用新的配置。"
   - 页面会自动刷新

6. **开始使用**
   - 刷新后，您的 API key 就会生效
   - 可以开始使用 AI 功能了！

---

## 方式 2: 使用 .env.local 文件

如果您更喜欢传统方式，也可以创建 `.env.local` 文件：

```bash
GEMINI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
```

---

## 🔄 API Key 优先级

系统会按以下顺序查找 API Key：

1. **localStorage**（在设置中配置的）- 优先级最高
2. **环境变量**（.env.local 文件中的）- 备用方案

这意味着：
- ✅ 在设置中配置的 API key 会覆盖 .env.local 中的
- ✅ 如果设置中没有配置，会使用 .env.local 中的
- ✅ 两者都可以使用，互不冲突

---

## 💾 数据存储位置

### 在设置中配置的 API Key 存储在：
- **浏览器 localStorage**
- 只在您的浏览器中存储
- 不会上传到服务器
- 清除浏览器数据会删除

### 存储的内容：
```javascript
localStorage.setItem('geminiApiKey', 'your_key');
localStorage.setItem('deepseekApiKey', 'your_key');
localStorage.setItem('aiProvider', 'gemini'); // 或 'deepseek'
```

---

## 🔍 如何查看已保存的设置

### 方法 1: 在设置页面查看
- 打开设置页面
- API key 输入框会显示已保存的值（以密码形式）

### 方法 2: 在浏览器控制台查看
1. 按 `F12` 打开开发者工具
2. 进入 **Console** 标签
3. 输入：
```javascript
console.log('Gemini Key:', localStorage.getItem('geminiApiKey'));
console.log('DeepSeek Key:', localStorage.getItem('deepseekApiKey'));
console.log('Current Provider:', localStorage.getItem('aiProvider'));
```

---

## 🔄 切换 AI 提供商

### 在设置中切换：
1. 打开设置页面
2. 在 "AI 提供商" 部分选择不同的提供商
3. 点击 "保存设置"
4. 页面会自动刷新并应用新的提供商

### 当前使用的提供商会显示：
- ✅ 蓝色边框高亮
- ✅ "当前选择" 标记
- ✅ API key 输入框旁边显示 "(当前使用)"

---

## 🗑️ 清除 API Key

### 方法 1: 在设置中清除
1. 打开设置页面
2. 清空 API key 输入框
3. 点击 "保存设置"

### 方法 2: 在浏览器控制台清除
```javascript
localStorage.removeItem('geminiApiKey');
localStorage.removeItem('deepseekApiKey');
localStorage.removeItem('aiProvider');
```

### 方法 3: 清除所有设置
```javascript
localStorage.clear();
```

---

## ⚠️ 安全提示

### 当前实现的安全性：

**优点：**
- ✅ 不需要创建 .env.local 文件
- ✅ 可以随时在应用中更改
- ✅ 不会提交到 Git

**缺点：**
- ❌ 存储在浏览器 localStorage 中
- ❌ 任何人都可以在开发者工具中查看
- ❌ 仅适合个人使用和开发环境

**生产环境建议：**
- 🔒 使用后端代理服务器
- 🔒 使用 Serverless Functions
- 🔒 在 AI 提供商平台设置 API key 限制

---

## 🎯 完整使用流程示例

### 场景：首次使用 Gemini

1. **打开应用** → http://localhost:3000
2. **点击设置图标** → 进入设置页面
3. **选择 AI 提供商** → 点击 "Google Gemini"
4. **获取 API Key** → 访问 https://aistudio.google.com/app/apikey
5. **复制 API Key** → 在 Google AI Studio 创建并复制
6. **粘贴到应用** → 在 "Gemini API 密钥" 输入框粘贴
7. **保存设置** → 点击 "保存设置" 按钮
8. **等待刷新** → 页面自动刷新
9. **开始使用** → 打开 "作业助手" 或 "魔法盒子"
10. **测试功能** → 发送消息或生成考试题目

### 场景：切换到 DeepSeek

1. **进入设置** → 打开设置页面
2. **选择 DeepSeek** → 点击 "DeepSeek" 卡片
3. **输入 API Key** → 在 "DeepSeek API 密钥" 输入框输入
4. **保存设置** → 点击 "保存设置"
5. **刷新完成** → 现在使用 DeepSeek 模型

---

## 🔧 故障排除

### 问题 1: 保存后仍显示"演示模式"
**解决方案：**
- 确保点击了 "保存设置" 按钮
- 确保页面已刷新
- 检查 API key 是否正确（无多余空格）
- 在控制台检查是否保存成功

### 问题 2: API key 没有保存
**解决方案：**
- 检查浏览器是否允许 localStorage
- 尝试在无痕模式下测试
- 清除浏览器缓存后重试

### 问题 3: 切换提供商无效
**解决方案：**
- 确保两个提供商的 API key 都已配置
- 保存设置后等待页面刷新
- 检查控制台是否有错误信息

---

## 📊 功能对比

| 功能 | 设置页面配置 | .env.local 配置 |
|------|-------------|----------------|
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 灵活性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 安全性 | ⭐⭐ | ⭐⭐⭐ |
| 需要重启 | ❌ 自动刷新 | ✅ 需要重启 |
| 适用场景 | 个人开发 | 团队开发 |

---

## 💡 最佳实践

1. **开发环境**：使用设置页面配置，方便快速切换
2. **团队协作**：使用 .env.local，避免泄露个人 API key
3. **生产环境**：使用后端代理，保护 API key
4. **定期更换**：定期更换 API key，提高安全性
5. **监控使用**：在 AI 提供商平台监控 API 使用情况

---

## 🎉 总结

**是的！现在您可以直接在应用的设置页面中配置 API Key，无需手动创建 .env.local 文件！**

这使得配置更加简单和直观，特别适合：
- ✅ 首次使用的用户
- ✅ 需要频繁切换 AI 提供商的用户
- ✅ 不熟悉环境变量配置的用户

开始使用吧！🚀
