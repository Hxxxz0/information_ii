import { Difficulty, KnowledgePoint, MisconceptionPattern, Question, QuestionType } from './types';

export const KNOWLEDGE_POINTS: KnowledgePoint[] = [
  { id: 'kp1', name: '采样定理', course: '通信原理', mastery: 85, description: '奈奎斯特速率，混叠' },
  { id: 'kp2', name: '信号带宽', course: '通信原理', mastery: 60, description: '傅里叶变换，能量谱密度' },
  { id: 'kp3', name: 'QAM调制', course: '数字通信', mastery: 45, description: '星座图，符号错误率' },
  { id: 'kp4', name: 'OFDM', course: '移动通信', mastery: 40, description: '正交性，循环前缀，FFT' },
  { id: 'kp5', name: '香农容量', course: '信息论', mastery: 90, description: '信道容量，信噪比限制' },
  { id: 'kp6', name: 'MIMO', course: '移动通信', mastery: 55, description: '空间复用，分集增益' },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    content: '一个信号的带宽为4千赫。根据奈奎斯特采样定理，避免混叠所需的最小采样频率是多少？',
    options: ['2 千赫', '4 千赫', '8 千赫', '16 千赫'],
    correctAnswer: '8 千赫',
    type: QuestionType.CHOICE,
    difficulty: Difficulty.EASY,
    knowledgePoints: ['kp1'],
    explanation: '奈奎斯特速率是 2 * B，其中B是带宽。2 * 4千赫 = 8千赫。'
  },
  {
    id: 'q2',
    content: '在16-QAM星座图中，每个符号传输多少比特？',
    options: ['2 比特', '4 比特', '8 比特', '16 比特'],
    correctAnswer: '4 比特',
    type: QuestionType.CHOICE,
    difficulty: Difficulty.MEDIUM,
    knowledgePoints: ['kp3'],
    explanation: 'M = 16。每个符号的比特数 k = log2(M) = log2(16) = 4。'
  },
  {
    id: 'q3',
    content: '计算一个带宽为3千赫、信噪比为30分贝的信道的最大信道容量。',
    type: QuestionType.CALCULATION,
    difficulty: Difficulty.HARD,
    knowledgePoints: ['kp5'],
    correctAnswer: '约 29.9 千比特/秒',
    explanation: 'C = B * log2(1 + SNR_linear)。SNR_linear = 1000。C = 3000 * log2(1001) ≈ 29.9 千比特/秒。'
  },
  {
    id: 'q4',
    content: '解释为什么在OFDM系统中要添加循环前缀(CP)。',
    type: QuestionType.COMPREHENSIVE,
    difficulty: Difficulty.EXPERT,
    knowledgePoints: ['kp4'],
    correctAnswer: '消除ISI和ICI。',
    explanation: 'CP作为保护间隔来处理多径延迟扩展（消除ISI），并将线性卷积转换为循环卷积（简化均衡）。'
  }
];

export const MISCONCEPTIONS: MisconceptionPattern[] = [
  {
    id: 'm1',
    title: '混淆带宽与最大频率',
    description: '学生经常认为 fs >= 2*f_max 总是公式，忘记了对于带通信号，带宽(B)比绝对频率更重要。',
    frequency: 35,
    affectedKnowledgePoints: ['kp1', 'kp2'],
    remediationAdvice: '复习带通采样定理。重点关注基带信号和带通信号之间的区别。'
  },
  {
    id: 'm2',
    title: 'QAM星座图功率',
    description: '认为增加星座图大小(M)总是会增加平均功率，而不考虑缩放。',
    frequency: 22,
    affectedKnowledgePoints: ['kp3'],
    remediationAdvice: '可视化点的分布方式。讨论点之间的距离与总能量的关系。'
  },
  {
    id: 'm3',
    title: '符号速率与比特速率',
    description: '直接认为 Rb = Rs，而没有考虑调制阶数(log2M)。',
    frequency: 48,
    affectedKnowledgePoints: ['kp3', 'kp5'],
    remediationAdvice: '强化关系 Rb = Rs * log2(M)。使用单位分析（比特/秒 vs 符号/秒）。'
  }
];

export const SYSTEM_INSTRUCTION = `你是一位电信工程领域的专家AI导师，为大学生和教授提供服务。
你的能力包括：
1. 基于主题创建考试题目（采样、调制、编码等）。
2. 解释复杂概念（OFDM、MIMO、香农极限）。
3. 分析学生错误以找出误解。

当被要求创建考试时，作为有用的助手起草内容。
当被要求解释错误时，要鼓励但数学上严谨。
保持回答简洁和结构化。如需要，使用markdown格式表示数学公式。`;
