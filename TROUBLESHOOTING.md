# 🔧 API Key 配置故障排除指南

## ❌ 问题：添加 API Key 后仍然无法对话

### 症状
- 在设置中输入了 API Key
- 点击了"保存设置"
- 页面已刷新
- 但聊天时仍显示"演示模式"提示

---

## ✅ 解决方案

### 方法 1: 完整刷新（推荐）⭐

1. **硬刷新浏览器**
   - **Mac**: `Cmd + Shift + R`
   - **Windows/Linux**: `Ctrl + Shift + R`
   - 或者按 `Ctrl/Cmd + F5`

2. **清除缓存并刷新**
   - 按 `F12` 打开开发者工具
   - 右键点击刷新按钮
   - 选择"清空缓存并硬性重新加载"

### 方法 2: 验证 API Key 是否保存

1. **打开浏览器控制台**
   - 按 `F12` 或 `Cmd/Ctrl + Option + I`

2. **检查 localStorage**
   ```javascript
   // 在 Console 标签中输入：
   console.log('Gemini Key:', localStorage.getItem('geminiApiKey'));
   console.log('DeepSeek Key:', localStorage.getItem('deepseekApiKey'));
   console.log('AI Provider:', localStorage.getItem('aiProvider'));
   ```

3. **如果显示 null**
   - API Key 没有保存成功
   - 重新在设置中输入并保存

### 方法 3: 手动设置 API Key（临时测试）

在浏览器控制台中直接设置：

```javascript
// 设置 Gemini API Key
localStorage.setItem('geminiApiKey', 'your_actual_gemini_key_here');

// 或设置 DeepSeek API Key
localStorage.setItem('deepseekApiKey', 'your_actual_deepseek_key_here');

// 设置使用的提供商
localStorage.setItem('aiProvider', 'gemini'); // 或 'deepseek'

// 刷新页面
location.reload();
```

### 方法 4: 使用 .env.local 文件（备用方案）

如果应用内设置一直有问题，可以使用传统方式：

1. **在项目根目录创建 `.env.local` 文件**
   ```bash
   GEMINI_API_KEY=your_gemini_key_here
   DEEPSEEK_API_KEY=your_deepseek_key_here
   ```

2. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl + C)
   # 重新启动
   npm run dev
   ```

---

## 🔍 诊断步骤

### 步骤 1: 检查 API Key 格式

**正确格式：**
- Gemini: 通常以 `AIza` 开头
- DeepSeek: 通常是一串随机字符

**常见错误：**
- ❌ 包含多余的空格
- ❌ 复制时包含了引号
- ❌ 不完整的 key

**验证方法：**
```javascript
// 在控制台检查 key 的长度和格式
const key = localStorage.getItem('geminiApiKey');
console.log('Key length:', key?.length);
console.log('Key starts with:', key?.substring(0, 5));
console.log('Has spaces:', key?.includes(' '));
```

### 步骤 2: 检查 API Key 是否有效

1. **访问 AI 提供商平台**
   - Gemini: https://aistudio.google.com/app/apikey
   - DeepSeek: https://platform.deepseek.com/api_keys

2. **验证 API Key 状态**
   - 是否已启用
   - 是否有配额
   - 是否有域名限制

### 步骤 3: 检查网络请求

1. **打开开发者工具**
   - 按 `F12`
   - 进入 **Network** 标签

2. **发送一条消息**
   - 在聊天框输入 "hello"
   - 观察是否有 API 请求

3. **检查请求状态**
   - ✅ 200: 成功
   - ❌ 401: API Key 无效
   - ❌ 403: 权限不足
   - ❌ 429: 超出配额

### 步骤 4: 查看控制台错误

1. **打开 Console 标签**
2. **查找错误信息**
   - 红色的错误消息
   - API 相关的警告

3. **常见错误：**
   ```
   "No API Key, skipping AI generation"
   → API Key 未正确读取

   "演示模式：请在环境中配置您的 API_KEY"
   → API Key 为空

   "DeepSeek API Error: 401"
   → API Key 无效
   ```

---

## 🎯 完整测试流程

### 测试 Gemini

1. **设置 API Key**
   ```javascript
   localStorage.setItem('geminiApiKey', 'your_key');
   localStorage.setItem('aiProvider', 'gemini');
   location.reload();
   ```

2. **测试对话**
   - 打开"作业助手"或"魔法盒子"
   - 发送消息："你好"
   - 应该收到 AI 回复（不是"演示模式"）

3. **测试考试生成**
   - 发送："给我3道关于OFDM的练习题"
   - 应该生成考试题目

### 测试 DeepSeek

1. **设置 API Key**
   ```javascript
   localStorage.setItem('deepseekApiKey', 'your_key');
   localStorage.setItem('aiProvider', 'deepseek');
   location.reload();
   ```

2. **测试对话**
   - 发送消息
   - 检查是否收到回复

---

## 📋 检查清单

在报告问题之前，请确认：

- [ ] API Key 已在设置中输入
- [ ] 点击了"保存设置"按钮
- [ ] 页面已刷新（或手动刷新）
- [ ] localStorage 中有 API Key（用控制台检查）
- [ ] 选择了正确的 AI 提供商
- [ ] API Key 在提供商平台是有效的
- [ ] 浏览器允许 localStorage
- [ ] 没有浏览器扩展阻止 localStorage

---

## 🐛 已知问题

### 问题 1: 保存后需要手动刷新
**原因**: 自动刷新可能被浏览器阻止

**解决**: 
- 保存后手动刷新页面
- 或使用 `Cmd/Ctrl + Shift + R` 硬刷新

### 问题 2: 无痕模式下无法保存
**原因**: 无痕模式限制 localStorage

**解决**: 
- 使用普通浏览器窗口
- 或使用 .env.local 文件

### 问题 3: 多个标签页冲突
**原因**: localStorage 在标签页间共享

**解决**: 
- 关闭其他标签页
- 只在一个标签页中操作

---

## 💡 快速修复命令

### 重置所有设置
```javascript
// 清除所有 localStorage
localStorage.clear();
location.reload();
```

### 重新设置 Gemini
```javascript
localStorage.setItem('geminiApiKey', 'YOUR_ACTUAL_KEY');
localStorage.setItem('aiProvider', 'gemini');
location.reload();
```

### 重新设置 DeepSeek
```javascript
localStorage.setItem('deepseekApiKey', 'YOUR_ACTUAL_KEY');
localStorage.setItem('aiProvider', 'deepseek');
location.reload();
```

### 查看当前配置
```javascript
console.log({
  geminiKey: localStorage.getItem('geminiApiKey') ? '已配置' : '未配置',
  deepseekKey: localStorage.getItem('deepseekApiKey') ? '已配置' : '未配置',
  provider: localStorage.getItem('aiProvider'),
});
```

---

## 🆘 仍然无法工作？

### 最后的解决方案

1. **完全清除并重新开始**
   ```bash
   # 1. 清除浏览器所有数据
   # 在浏览器设置中清除网站数据
   
   # 2. 停止开发服务器
   # Ctrl + C
   
   # 3. 清除 node_modules
   rm -rf node_modules
   
   # 4. 重新安装
   npm install
   
   # 5. 重新启动
   npm run dev
   ```

2. **使用 .env.local 文件**
   - 创建 `.env.local`
   - 添加 API Key
   - 重启服务器

3. **检查浏览器兼容性**
   - 使用最新版 Chrome/Firefox/Edge
   - 确保 JavaScript 已启用
   - 禁用可能冲突的扩展

---

## 📞 获取帮助

如果以上方法都不行，请提供以下信息：

1. **浏览器信息**
   - 浏览器类型和版本
   - 操作系统

2. **控制台输出**
   ```javascript
   // 运行这个并复制结果
   console.log({
     geminiKey: localStorage.getItem('geminiApiKey')?.substring(0, 10) + '...',
     deepseekKey: localStorage.getItem('deepseekApiKey')?.substring(0, 10) + '...',
     provider: localStorage.getItem('aiProvider'),
     localStorage: typeof localStorage !== 'undefined',
   });
   ```

3. **错误信息**
   - Console 中的错误
   - Network 中的失败请求

---

## ✅ 成功标志

当一切正常时，您应该看到：

1. **聊天界面**
   - 不显示"演示模式"
   - 发送消息后收到 AI 回复
   - 回复内容有意义（不是模拟回复）

2. **控制台**
   ```
   🤖 AI Provider switched to: gemini
   (或 deepseek)
   ```

3. **设置页面**
   - API Key 输入框显示密码点
   - 当前使用的提供商有蓝色边框
   - 保存后显示"已保存"

祝您使用愉快！🎉
