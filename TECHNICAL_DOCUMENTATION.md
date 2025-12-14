# 电信AI智能教育助手 - 技术文档

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [环境配置](#环境配置)
5. [安装与运行](#安装与运行)
6. [代码结构详解](#代码结构详解)
7. [核心组件说明](#核心组件说明)
8. [服务层说明](#服务层说明)
9. [类型定义](#类型定义)
10. [常量配置](#常量配置)
11. [API使用指南](#api使用指南)
12. [开发指南](#开发指南)
13. [部署说明](#部署说明)
14. [常见问题](#常见问题)

---

## 项目概述

### 项目简介

电信AI智能教育助手（TelecomAI Intelligent Education Agent）是一个基于React和TypeScript构建的现代化教育平台，专门为电信工程专业的学生和教师设计。该平台集成了Google Gemini AI，提供智能化的学习辅助、考试生成、误解分析和可视化学习工具。

### 核心功能

1. **智能学习助手**：基于Gemini AI的对话式学习助手，支持问题解答和概念解释
2. **考试管理系统**：支持创建、管理和完成考试，包含自动评分功能
3. **误解分析**：AI驱动的学习误解识别和补救建议
4. **数据可视化**：学习进度、知识掌握度雷达图、周表现趋势等
5. **波束成形实验室**：基于MediaPipe的手势控制相控阵模拟器
6. **角色切换**：支持学生和教师两种角色，提供不同的功能视图

### 项目特点

- 🎨 现代化UI设计，采用玻璃态（Glassmorphism）设计风格
- 🤖 集成Google Gemini 2.5 Flash AI模型
- 📊 丰富的数据可视化（Recharts）
- 🎯 完整的TypeScript类型支持
- 📱 响应式设计，适配多种屏幕尺寸
- 🎮 交互式3D可视化学习工具

---

## 技术栈

### 前端框架

- **React 19.2.0**：现代化的UI框架
- **TypeScript 5.8.2**：类型安全的JavaScript超集
- **Vite 6.2.0**：快速的前端构建工具

### UI库与样式

- **Tailwind CSS**：通过CDN引入的实用优先CSS框架
- **Lucide React 0.554.0**：现代化的图标库
- **Recharts 3.4.1**：基于React的图表库

### AI服务

- **@google/genai 1.30.0**：Google Gemini AI SDK

### 其他依赖

- **MediaPipe**：用于手势识别的机器学习框架（通过CDN引入）

### 开发工具

- **@vitejs/plugin-react**：Vite的React插件
- **@types/node**：Node.js类型定义

---

## 项目结构

```
telecomai---intelligent-education-agent/
├── App.tsx                      # 主应用组件（桌面界面）
├── index.tsx                    # 应用入口文件
├── index.html                   # HTML模板
├── types.ts                     # TypeScript类型定义
├── constants.ts                 # 常量配置（知识点、题目、误解等）
├── vite.config.ts              # Vite构建配置
├── tsconfig.json               # TypeScript配置
├── package.json                 # 项目依赖配置
├── README.md                    # 项目说明文档
├── TECHNICAL_DOCUMENTATION.md  # 本技术文档
│
├── components/                  # React组件目录
│   ├── TelecomApp.tsx          # 主应用容器组件
│   ├── Dashboard.tsx           # 仪表板组件
│   ├── Sidebar.tsx             # 侧边栏导航组件
│   ├── ChatAgent.tsx           # AI聊天助手组件
│   ├── ExamView.tsx            # 考试视图组件
│   ├── MisconceptionView.tsx   # 误解分析视图组件
│   ├── ErrorBoundary.tsx       # 错误边界组件
│   ├── BeamformingLab.tsx      # 波束成形实验室组件
│   │
│   └── OS/                      # 操作系统风格组件
│       ├── MenuBar.tsx         # 菜单栏组件
│       ├── Dock.tsx            # 停靠栏组件
│       └── Window.tsx          # 窗口组件
│
└── services/                    # 服务层
    └── geminiService.ts        # Gemini AI服务封装
```

---

## 环境配置

### 系统要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **yarn**: >= 1.22.0
- **现代浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 环境变量配置

创建 `.env.local` 文件（如果不存在）：

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**获取API密钥**：
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录Google账号
3. 创建新的API密钥
4. 将密钥复制到 `.env.local` 文件中

---

## 安装与运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd telecomai---intelligent-education-agent
```

### 2. 安装依赖

```bash
npm install
```

或使用yarn：

```bash
yarn install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 5. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 6. 预览生产构建

```bash
npm run preview
```

---

## 代码结构详解

### 入口文件

#### `index.tsx`

应用的主入口文件，负责初始化React应用并挂载到DOM。

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**功能**：
- 获取DOM根元素
- 创建React根节点
- 在严格模式下渲染主应用组件

#### `index.html`

HTML模板文件，包含：
- Meta标签配置
- Tailwind CSS CDN链接
- MediaPipe依赖脚本
- React和相关库的import map配置
- 自定义样式定义

---

## 核心组件说明

### 1. App.tsx - 主应用组件

**路径**: `App.tsx`

**功能**: 桌面操作系统风格的主界面，包含：
- 3D头像展示
- 学习计划时间线
- 功能卡片（作业助手、魔法盒子、信号实验室、复习小屋）
- 窗口管理系统

**主要状态**:
```typescript
const [appState, setAppState] = useState({
  telecomOpen: false,    // 电信应用窗口是否打开
  signalLabOpen: false, // 信号实验室窗口是否打开
});
```

**关键功能**:
- `openTelecomApp()`: 打开主应用窗口
- `closeTelecomApp()`: 关闭主应用窗口
- `openSignalLab()`: 打开信号实验室窗口
- `closeSignalLab()`: 关闭信号实验室窗口

**子组件**:
- `MenuBar`: 顶部菜单栏
- `Dock`: 底部停靠栏
- `Window`: 窗口容器（包含TelecomApp和BeamformingLab）

---

### 2. TelecomApp.tsx - 主应用容器

**路径**: `components/TelecomApp.tsx`

**功能**: 核心应用容器，管理角色切换和标签页导航

**主要状态**:
```typescript
const [currentRole, setCurrentRole] = useState<Role>(Role.STUDENT);
const [activeTab, setActiveTab] = useState('dashboard');
const [generatedExams, setGeneratedExams] = useState<Exam[]>([]);
```

**核心方法**:

1. **`toggleRole()`**: 在学生和教师角色之间切换
2. **`handleGenerateExam(topic, questions)`**: 处理AI生成的考试
3. **`handlePracticeMisconception(topic)`**: 处理误解练习请求
4. **`handleCompleteExam(examId, score)`**: 处理考试完成事件
5. **`renderContent()`**: 根据当前标签页渲染对应组件

**标签页映射**:
- `dashboard` → `Dashboard` 组件
- `agent` → `ChatAgent` 组件
- `exams` / `practice` → `ExamView` 组件
- `misconceptions` → `MisconceptionView` 组件

---

### 3. Dashboard.tsx - 仪表板组件

**路径**: `components/Dashboard.tsx`

**功能**: 显示学习数据概览和可视化图表

**Props**:
```typescript
interface DashboardProps {
  role: Role;  // 当前用户角色
}
```

**显示内容**:

1. **关键指标卡片**（4个）:
   - 平均准确率 / 班级平均
   - 学习时间 / 待审核
   - 薄弱环节 / 风险提醒
   - 已完成练习数

2. **知识掌握地图**:
   - 使用Recharts的RadarChart组件
   - 显示各知识点的掌握度

3. **每周表现趋势**:
   - 使用Recharts的BarChart组件
   - 显示周一到周日的学习表现

**数据来源**:
- `KNOWLEDGE_POINTS`: 从 `constants.ts` 导入
- `performanceData`: 组件内部定义的模拟数据

---

### 4. Sidebar.tsx - 侧边栏组件

**路径**: `components/Sidebar.tsx`

**功能**: 提供导航菜单和角色切换功能

**Props**:
```typescript
interface SidebarProps {
  role: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleRole: () => void;
}
```

**菜单项**:
- 仪表板
- AI助手
- 考试创建器 / 我的考试（根据角色）
- 误解分析
- 智能练习（仅学生角色）

**功能**:
- 高亮当前活动标签页
- 显示当前角色
- 提供角色切换按钮
- 设置按钮（占位）

---

### 5. ChatAgent.tsx - AI聊天助手组件

**路径**: `components/ChatAgent.tsx`

**功能**: 与Gemini AI进行对话，支持智能意图识别和考试生成

**Props**:
```typescript
interface ChatAgentProps {
  role: Role;
  onGenerateExam?: (topic: string, questions: Question[]) => void;
}
```

**主要状态**:
```typescript
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [messages, setMessages] = useState<ChatMessage[]>([]);
```

**核心功能**:

1. **意图识别**:
   - 检测关键词：'exam', 'quiz', 'test', 'questions', 'practice'
   - 如果检测到考试请求，调用 `geminiService.generateExamQuestions()`

2. **消息处理**:
   - `handleSend()`: 发送用户消息并获取AI回复
   - `handleKeyDown()`: 支持Enter键发送

3. **UI特性**:
   - 自动滚动到底部
   - 加载状态显示
   - 清除历史记录功能
   - 角色特定的占位符文本

**消息格式**:
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
```

---

### 6. ExamView.tsx - 考试视图组件

**路径**: `components/ExamView.tsx`

**功能**: 显示考试列表和考试答题界面

**Props**:
```typescript
interface ExamViewProps {
  role: Role;
  exams: Exam[];
  onStartExam?: (examId: string) => void;
  onCompleteExam?: (examId: string, score: number) => void;
}
```

**主要状态**:
```typescript
const [activeExamId, setActiveExamId] = useState<string | null>(null);
const [answers, setAnswers] = useState<Record<string, string>>({});
const [showResults, setShowResults] = useState(false);
const [score, setScore] = useState(0);
```

**核心功能**:

1. **翻译函数**:
   - `translateQuestionType()`: 将问题类型翻译为中文
   - `translateExamStatus()`: 将考试状态翻译为中文

2. **考试处理**:
   - `handleStartExam()`: 开始考试
   - `handleAnswerChange()`: 处理答案变更
   - `handleSubmitExam()`: 提交考试并计算分数

3. **评分逻辑**:
   - 简单字符串匹配（演示用）
   - 每题平均分配分数
   - 显示正确答案和解释

**问题类型支持**:
- 选择题（Choice）：单选按钮
- 填空题（Fill-in）：文本输入
- 计算题（Calculation）：文本输入
- 综合题（Comprehensive）：文本输入

**UI模式**:
- **列表模式**: 显示所有考试
- **答题模式**: 显示单个考试的题目
- **结果模式**: 显示考试结果和正确答案

---

### 7. MisconceptionView.tsx - 误解分析视图

**路径**: `components/MisconceptionView.tsx`

**功能**: 显示学习误解模式和补救建议

**Props**:
```typescript
interface MisconceptionViewProps {
  role: Role;
  onPracticeMisconception?: (topic: string) => void;
}
```

**显示内容**:
- 误解卡片网格（3列）
- 每个卡片包含：
  - 误解标题
  - 描述
  - 频率百分比
  - 补救策略
  - 练习按钮

**数据来源**:
- `MISCONCEPTIONS`: 从 `constants.ts` 导入

**功能**:
- `handlePractice()`: 触发误解练习，生成相关题目

---

### 8. BeamformingLab.tsx - 波束成形实验室

**路径**: `components/BeamformingLab.tsx`

**功能**: 基于MediaPipe手势控制的相控阵波束成形模拟器

**技术实现**:
- MediaPipe Hands用于手势识别
- Canvas 2D API用于绘制
- 实时物理模拟

**主要状态**:
```typescript
const [simulationState, setSimulationState] = useState({
  steeringAngle: 0,      // 转向角度（度）
  antennaCount: 8,       // 天线数量
  gain: 0,               // 增益
  handDetected: false,   // 是否检测到手
  mode: 'SCANNING'       // 模式：SCANNING / PRECISION_LOCK / WIDE_SCAN
});
```

**交互控制**:
- **左右移动手**: 控制波束转向角度（-80° 到 +80°）
- **握拳/捏合**: 切换天线数量（4或16）
- **张开手**: 宽扫描模式（2个天线）
- **握拳**: 精确锁定模式（16个天线）

**物理模拟**:
- 使用相控阵波束成形公式
- 计算阵列因子（Array Factor）
- 可视化辐射模式

**UI元素**:
- HUD显示：转向角度、天线数量、模式
- 实时输入摄像头预览
- 控制提示
- 全屏按钮

---

### 9. OS组件系列

#### MenuBar.tsx - 菜单栏

**路径**: `components/OS/MenuBar.tsx`

**功能**: 显示时间、天气、快捷按钮和搜索

**显示内容**:
- 当前时间（大字体）
- 天气信息（晴天、温度）
- 当前日期（中文格式）
- 金币/积分显示
- 快捷按钮（指南、消息、个人）
- 搜索图标

#### Dock.tsx - 停靠栏

**路径**: `components/OS/Dock.tsx`

**功能**: 底部应用图标停靠栏

**应用图标**:
- 计划、训练、能量、心情、留言板、海洋、首页

**特性**:
- 悬停动画效果
- 标签显示

#### Window.tsx - 窗口组件

**路径**: `components/OS/Window.tsx`

**功能**: 可拖拽的窗口容器

**Props**:
```typescript
interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'immersive';
}
```

**变体**:
- `default`: 标准白色窗口
- `immersive`: 沉浸式黑色窗口（用于BeamformingLab）

---

### 10. ErrorBoundary.tsx - 错误边界

**路径**: `components/ErrorBoundary.tsx`

**功能**: React错误边界，捕获组件树中的错误

**实现**:
- 类组件实现 `componentDidCatch`
- 显示友好的错误信息
- 提供重启应用按钮

---

## 服务层说明

### geminiService.ts - Gemini AI服务

**路径**: `services/geminiService.ts`

**功能**: 封装与Google Gemini AI的交互

**类结构**:
```typescript
export class GeminiService {
  private chatSession: Chat | null = null;
  private ai: GoogleGenAI | null = null;
  private apiKey: string = '';
}
```

**主要方法**:

#### 1. `initChat()`
初始化聊天会话

```typescript
async initChat(): Promise<void>
```

**功能**:
- 创建Gemini聊天实例
- 设置系统指令
- 配置温度参数（0.7）

#### 2. `sendMessage(message: string)`
发送消息并获取AI回复

```typescript
async sendMessage(message: string): Promise<string>
```

**参数**:
- `message`: 用户输入的消息

**返回**:
- AI生成的回复文本

**错误处理**:
- API密钥未配置：返回演示模式消息
- 初始化失败：返回错误消息
- API错误：返回连接错误消息

#### 3. `generateExamQuestions(topic: string, count: number)`
生成考试题目

```typescript
async generateExamQuestions(
  topic: string, 
  count: number = 3
): Promise<Question[]>
```

**参数**:
- `topic`: 考试主题
- `count`: 题目数量（默认3）

**返回**:
- `Question[]`: 生成的题目数组

**实现细节**:
- 使用JSON Schema模式确保结构化输出
- 要求AI生成中文内容
- 自动生成题目ID
- 支持选择题、填空题、计算题

**提示词模板**:
```
创建一个电信工程考试。
主题："${topic}"。
数量：${count} 道题。
包含选择题和简答题的混合。
确保适合大学生的学术标准。
所有问题、选项、答案和解释都必须使用中文。
```

**JSON Schema**:
```typescript
{
  type: "array",
  items: {
    type: "object",
    properties: {
      content: { type: "string" },
      options: { type: "array", items: { type: "string" } },
      correctAnswer: { type: "string" },
      type: { type: "string", enum: ["Choice", "Fill-in", "Calculation"] },
      difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
      explanation: { type: "string" }
    }
  }
}
```

**API密钥获取**:
- 从环境变量 `GEMINI_API_KEY` 读取
- 支持浏览器和Node.js环境

---

## 类型定义

### types.ts

**路径**: `types.ts`

包含所有TypeScript类型和接口定义。

#### 枚举类型

**Role** - 用户角色
```typescript
enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}
```

**Difficulty** - 题目难度
```typescript
enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXPERT = 'Expert'
}
```

**QuestionType** - 题目类型
```typescript
enum QuestionType {
  CHOICE = 'Choice',           // 选择题
  FILL_IN = 'Fill-in',         // 填空题
  CALCULATION = 'Calculation', // 计算题
  COMPREHENSIVE = 'Comprehensive' // 综合题
}
```

#### 接口类型

**KnowledgePoint** - 知识点
```typescript
interface KnowledgePoint {
  id: string;           // 唯一标识
  name: string;         // 知识点名称
  course: string;       // 所属课程
  mastery: number;      // 掌握度（0-100）
  description: string;  // 描述
}
```

**Question** - 题目
```typescript
interface Question {
  id: string;                    // 唯一标识
  content: string;                // 题目内容
  options?: string[];             // 选项（仅选择题）
  correctAnswer: string;          // 正确答案
  type: QuestionType;             // 题目类型
  difficulty: Difficulty;        // 难度
  knowledgePoints: string[];      // 关联知识点ID
  explanation: string;            // 解释说明
}
```

**Exam** - 考试
```typescript
interface Exam {
  id: string;                    // 唯一标识
  title: string;                  // 考试标题
  totalScore: number;             // 总分
  durationMinutes: number;        // 时长（分钟）
  questions: Question[];           // 题目列表
  status: 'draft' | 'published' | 'completed'; // 状态
  targetAudience?: string;        // 目标受众
  score?: number;                 // 得分（完成时）
}
```

**MisconceptionPattern** - 误解模式
```typescript
interface MisconceptionPattern {
  id: string;                     // 唯一标识
  title: string;                   // 误解标题
  description: string;             // 描述
  frequency: number;                // 频率（百分比）
  affectedKnowledgePoints: string[]; // 受影响知识点
  remediationAdvice: string;       // 补救建议
}
```

**ChatMessage** - 聊天消息
```typescript
interface ChatMessage {
  id: string;                      // 唯一标识
  role: 'user' | 'model';          // 角色
  text: string;                    // 消息文本
  timestamp: number;                // 时间戳
  isLoading?: boolean;             // 是否加载中
  action?: {                       // 动作（可选）
    type: 'EXAM_GENERATED' | 'MISCONCEPTION_ANALYSIS';
    payload: any;
  };
}
```

---

## 常量配置

### constants.ts

**路径**: `constants.ts`

包含应用的所有常量数据。

#### KNOWLEDGE_POINTS

知识点数组，包含6个电信工程核心知识点：

1. **采样定理** (Sampling Theorem)
   - 课程：通信原理
   - 掌握度：85%
   - 描述：奈奎斯特速率，混叠

2. **信号带宽** (Signal Bandwidth)
   - 课程：通信原理
   - 掌握度：60%
   - 描述：傅里叶变换，能量谱密度

3. **QAM调制** (QAM Modulation)
   - 课程：数字通信
   - 掌握度：45%
   - 描述：星座图，符号错误率

4. **OFDM** (Orthogonal Frequency Division Multiplexing)
   - 课程：移动通信
   - 掌握度：40%
   - 描述：正交性，循环前缀，FFT

5. **香农容量** (Shannon Capacity)
   - 课程：信息论
   - 掌握度：90%
   - 描述：信道容量，信噪比限制

6. **MIMO** (Multiple Input Multiple Output)
   - 课程：移动通信
   - 掌握度：55%
   - 描述：空间复用，分集增益

#### MOCK_QUESTIONS

模拟题目数组，包含4道示例题目：

1. **题目1** - 采样定理（选择题）
   - 难度：简单
   - 内容：关于4kHz信号的最小采样频率

2. **题目2** - QAM调制（选择题）
   - 难度：中等
   - 内容：16-QAM的比特数

3. **题目3** - 香农容量（计算题）
   - 难度：困难
   - 内容：计算信道容量

4. **题目4** - OFDM（综合题）
   - 难度：专家
   - 内容：解释循环前缀的作用

#### MISCONCEPTIONS

误解模式数组，包含3个常见误解：

1. **混淆带宽与最大频率**
   - 频率：35%
   - 描述：学生混淆采样定理的应用场景

2. **QAM星座图功率**
   - 频率：22%
   - 描述：对星座图功率的误解

3. **符号速率与比特速率**
   - 频率：48%
   - 描述：直接等同符号速率和比特速率

#### SYSTEM_INSTRUCTION

系统指令，用于配置Gemini AI的行为：

```
你是一位电信工程领域的专家AI导师，为大学生和教授提供服务。
你的能力包括：
1. 基于主题创建考试题目（采样、调制、编码等）。
2. 解释复杂概念（OFDM、MIMO、香农极限）。
3. 分析学生错误以找出误解。

当被要求创建考试时，作为有用的助手起草内容。
当被要求解释错误时，要鼓励但数学上严谨。
保持回答简洁和结构化。如需要，使用markdown格式表示数学公式。
```

---

## API使用指南

### Gemini AI API

#### 初始化

API密钥通过环境变量配置：

```env
GEMINI_API_KEY=your_api_key_here
```

#### 发送消息

```typescript
import { geminiService } from './services/geminiService';

const response = await geminiService.sendMessage("什么是OFDM？");
console.log(response);
```

#### 生成考试题目

```typescript
import { geminiService } from './services/geminiService';

const questions = await geminiService.generateExamQuestions(
  "OFDM循环前缀", 
  3
);
console.log(questions);
```

#### 错误处理

```typescript
try {
  const response = await geminiService.sendMessage("问题");
} catch (error) {
  console.error("API错误:", error);
  // 处理错误
}
```

---

## 开发指南

### 添加新组件

1. 在 `components/` 目录创建新文件
2. 使用TypeScript和React函数组件
3. 导出组件：

```typescript
export const NewComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 组件实现
};
```

### 添加新类型

在 `types.ts` 中添加：

```typescript
export interface NewType {
  id: string;
  // 其他属性
}
```

### 添加新常量

在 `constants.ts` 中添加：

```typescript
export const NEW_CONSTANT: Type[] = [
  // 数据
];
```

### 样式规范

- 使用Tailwind CSS类名
- 遵循现有的设计系统
- 响应式设计：使用 `md:`, `lg:` 等前缀

### 代码规范

- 使用TypeScript严格模式
- 组件使用函数式组件和Hooks
- 遵循React最佳实践
- 添加必要的类型注解

---

## 部署说明

### 构建生产版本

```bash
npm run build
```

### 部署到静态托管

构建产物在 `dist/` 目录，可以部署到：

- **Vercel**: 直接连接GitHub仓库
- **Netlify**: 拖拽 `dist/` 文件夹
- **GitHub Pages**: 使用GitHub Actions
- **AWS S3 + CloudFront**: 上传到S3并配置CDN

### 环境变量配置

在生产环境中，需要配置：

```env
GEMINI_API_KEY=your_production_api_key
```

**注意**: 在生产环境中，考虑使用服务器端代理来保护API密钥。

### 性能优化

1. **代码分割**: Vite自动处理
2. **资源压缩**: 构建时自动压缩
3. **CDN**: 使用CDN加速静态资源
4. **缓存策略**: 配置适当的缓存头

---

## 常见问题

### Q1: API密钥未配置

**问题**: 应用显示"演示模式"消息

**解决**:
1. 检查 `.env.local` 文件是否存在
2. 确认 `GEMINI_API_KEY` 变量已设置
3. 重启开发服务器

### Q2: MediaPipe无法加载

**问题**: BeamformingLab无法检测手势

**解决**:
1. 检查网络连接（需要加载CDN资源）
2. 确认浏览器支持WebRTC
3. 允许摄像头权限

### Q3: 构建失败

**问题**: `npm run build` 报错

**解决**:
1. 清除 `node_modules` 和 `package-lock.json`
2. 重新安装依赖：`npm install`
3. 检查TypeScript错误：`npx tsc --noEmit`

### Q4: 端口被占用

**问题**: 开发服务器无法启动

**解决**:
1. 修改 `vite.config.ts` 中的端口号
2. 或使用：`npm run dev -- --port 3001`

### Q5: 样式不生效

**问题**: Tailwind CSS样式未应用

**解决**:
1. 检查 `index.html` 中的Tailwind CDN链接
2. 确认类名拼写正确
3. 清除浏览器缓存

---

## 贡献指南

### 提交代码

1. Fork项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -m "Add new feature"`
4. 推送到分支：`git push origin feature/new-feature`
5. 创建Pull Request

### 代码审查

- 确保所有测试通过
- 遵循代码规范
- 添加必要的文档
- 更新CHANGELOG（如果适用）

---

## 许可证

本项目采用 MIT 许可证。

---

## 联系方式

如有问题或建议，请通过以下方式联系：

- 创建Issue
- 发送邮件
- 提交Pull Request

---

## 更新日志

### v1.0.0 (当前版本)

- ✅ 完整的UI界面实现
- ✅ Gemini AI集成
- ✅ 考试管理系统
- ✅ 误解分析功能
- ✅ 波束成形实验室
- ✅ 数据可视化
- ✅ 角色切换功能
- ✅ 完整的中文支持

---

**文档版本**: 1.0.0  
**最后更新**: 2024年  
**维护者**: 项目团队

