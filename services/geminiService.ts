import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Question, SmartQuestionConfig, QuestionType, Difficulty } from '../types';

// Helper to safely get key without crashing in strict browser environments
const getApiKey = () => {
  // 1. 优先从 localStorage 读取（用户在设置中配置的）
  try {
    const localKey = localStorage.getItem('geminiApiKey');
    if (localKey && localKey.trim()) {
      console.log('✅ Gemini API Key 从 localStorage 读取成功');
      return localKey.trim();
    }
  } catch (e) {
    // localStorage 可能不可用
  }

  // 2. 从环境变量读取（.env.local 配置的）
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      console.log('✅ Gemini API Key 从环境变量读取成功');
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    return '';
  }
  console.log('❌ Gemini API Key 未找到');
  return '';
};

export class GeminiService {
  private chatSession: Chat | null = null;
  private ai: GoogleGenAI | null = null;
  private cachedApiKey: string = ''; // 缓存当前使用的 API key

  constructor() {
    // 不再在构造函数中缓存 API key
  }

  private getAIInstance(): GoogleGenAI | null {
    // 每次都重新读取 API key，以支持动态更新
    const apiKey = getApiKey();

    if (!apiKey) {
      // 如果 API key 为空，清除缓存的实例
      this.ai = null;
      this.cachedApiKey = '';
      return null;
    }

    // 如果 API key 改变了，重新创建实例
    if (!this.ai || this.cachedApiKey !== apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
      this.cachedApiKey = apiKey;
      // 清除旧的会话，因为 API key 改变了
      this.chatSession = null;
    }

    return this.ai;
  }

  private getModel() {
    return 'gemini-2.5-flash';
  }

  /**
   * 强制重置服务实例（用于 API key 更新后）
   */
  resetInstance() {
    this.ai = null;
    this.chatSession = null;
    this.cachedApiKey = '';
  }

  async initChat() {
    const ai = this.getAIInstance();
    if (!ai) return;

    try {
      this.chatSession = ai.chats.create({
        model: this.getModel(),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
    } catch (error) {
      console.error("Failed to initialize chat", error);
    }
  }

  async sendMessage(message: string): Promise<string> {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn('Gemini API Key 未找到。请检查：1) localStorage 中是否有 geminiApiKey，2) 环境变量中是否有 GEMINI_API_KEY');
      return "演示模式：请在设置中配置您的 Gemini API_KEY 以接收真实的 AI 回复。（模拟回复：我可以帮助您学习通信原理！）";
    }

    // 确保使用最新的 API key 创建实例
    const ai = this.getAIInstance();
    if (!ai) {
      console.error('无法创建 Gemini AI 实例，API key:', apiKey ? `${apiKey.substring(0, 10)}...` : '未找到');
      return "演示模式：无法初始化 Gemini 服务。请检查您的 API key 是否正确。";
    }

    if (!this.chatSession) {
      await this.initChat();
    }

    if (!this.chatSession) {
      console.error('无法初始化 Gemini 聊天会话');
      return "错误：无法初始化 AI 会话。请检查您的 API key 是否正确，或稍后重试。";
    }

    try {
      console.log('🔄 正在调用 Gemini API...');
      const response: GenerateContentResponse = await this.chatSession.sendMessage({
        message,
      });
      console.log('✅ Gemini API 调用成功');
      return response.text || "抱歉，我无法生成回复。";
    } catch (error: any) {
      console.error("❌ Gemini API 错误详情:", error);
      console.error("错误消息:", error?.message);
      console.error("错误状态码:", error?.status);
      
      // 提供更详细的错误信息
      let errorMessage = "我现在无法连接到知识库。";
      if (error?.message?.includes('API_KEY')) {
        errorMessage = "❌ API Key 无效。请检查您的 Gemini API Key 是否正确。";
      } else if (error?.message) {
        errorMessage += `\n错误详情: ${error.message}`;
      }
      
      return errorMessage;
    }
  }

  /**
   * Generates a structured list of exam questions based on a topic.
   * Uses Gemini 2.5 JSON Schema mode for reliable output.
   */
  async generateExamQuestions(topic: string, count: number = 3): Promise<Question[]> {
    const ai = this.getAIInstance();
    const apiKey = getApiKey();

    if (!ai || !apiKey) {
      console.warn("No API Key, skipping AI generation");
      return [];
    }

    try {
      // Define the JSON schema for the output
      const response = await ai.models.generateContent({
        model: this.getModel(),
        contents: `创建一个电信工程考试。
                   主题："${topic}"。
                   数量：${count} 道题。
                   包含选择题和简答题的混合。
                   确保适合大学生的学术标准。
                   所有问题、选项、答案和解释都必须使用中文。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING, description: "问题文本（必须使用中文）" },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "选择题的4个选项（必须使用中文），其他类型为空数组"
                },
                correctAnswer: { type: Type.STRING, description: "正确答案文本（必须使用中文）" },
                type: { type: Type.STRING, enum: ["Choice", "Fill-in", "Calculation"] },
                difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
                explanation: { type: Type.STRING, description: "详细的解答说明（必须使用中文）" }
              },
              required: ["content", "correctAnswer", "type", "difficulty", "explanation"]
            }
          }
        }
      });

      const jsonText = response.text;
      if (!jsonText) throw new Error("No data received from AI");

      const rawQuestions = JSON.parse(jsonText);

      // Map to our internal Question type with IDs
      return rawQuestions.map((q: any, index: number) => ({
        ...q,
        id: `gen-${Date.now()}-${index}`,
        knowledgePoints: [], // In a full app, AI would also tag these
      }));

    } catch (error) {
      console.error("Exam Generation Error:", error);
      // Fallback if API fails
      return [];
    }
  }

  /**
   * Generates a single question with richer constraints (type, difficulty, knowledge points).
   */
  async generateQuestion(config: SmartQuestionConfig): Promise<Question | null> {
    const ai = this.getAIInstance();
    const apiKey = getApiKey();

    if (!ai || !apiKey) {
      console.warn("No API Key, returning demo question");
      return {
        id: `demo-${Date.now()}`,
        content: `【演示】${config.topic} 的示例${config.type || QuestionType.CHOICE}题`,
        options: (config.type || QuestionType.CHOICE) === QuestionType.CHOICE
          ? ['选项A', '选项B', '选项C', '选项D']
          : [],
        correctAnswer: '示例答案（配置 API key 后生成真实内容）',
        type: config.type || QuestionType.CHOICE,
        difficulty: config.difficulty || Difficulty.MEDIUM,
        knowledgePoints: config.knowledgePoints || [],
        explanation: '演示模式：请在设置中配置 API key。',
      };
    }

    try {
      const contextBlock = config.chatHistory?.length
        ? `结合最近对话要点：\n${config.chatHistory.slice(-6).join('\n')}\n`
        : '';

      const avoidBlock = config.avoidTopics?.length
        ? `避免与这些题目重复：${config.avoidTopics.join('; ')}`
        : '避免重复最近的练习/考试题目。';

      const knowledgeBlock = config.knowledgePoints?.length
        ? `知识点聚焦：${config.knowledgePoints.join(', ')}`
        : '知识点不限，可自选相关主题。';

      const response = await ai.models.generateContent({
        model: this.getModel(),
        contents: `创建一道电信工程考试题目，要求：
- 主题/场景：${config.topic}
- 题型：${config.type || 'Choice / Fill-in / Calculation / Comprehensive'}
- 难度：${config.difficulty || 'Medium'}
- ${knowledgeBlock}
- ${avoidBlock}
${contextBlock}
输出 JSON 对象，字段：
content(中文题干)，options(数组，选择题填满4个，否则空数组)，correctAnswer(中文)，type(Choice/Fill-in/Calculation/Comprehensive)，difficulty(Easy/Medium/Hard/Expert)，explanation(中文详解)，knowledgePoints(数组，可复用上方知识点)。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              type: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              explanation: { type: Type.STRING },
              knowledgePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["content", "correctAnswer", "type", "difficulty", "explanation"],
          },
        },
      });

      const jsonText = response.text;
      if (!jsonText) throw new Error("No data received from AI");

      const parsed = JSON.parse(jsonText);
      return {
        ...parsed,
        id: `gen-${Date.now()}`,
        options: parsed.options || [],
        knowledgePoints: config.knowledgePoints?.length ? config.knowledgePoints : (parsed.knowledgePoints || []),
        type: parsed.type as QuestionType,
        difficulty: parsed.difficulty as Difficulty,
      };
    } catch (error) {
      console.error("Single Question Generation Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
