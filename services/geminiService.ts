import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';
import { Question } from '../types';

// Helper to safely get key without crashing in strict browser environments
const getApiKey = () => {
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    return '';
  }
  return '';
};

export class GeminiService {
  private chatSession: Chat | null = null;
  private ai: GoogleGenAI | null = null;
  private apiKey: string = '';

  constructor() {
    this.apiKey = getApiKey();
  }

  private getAIInstance(): GoogleGenAI | null {
    if (this.ai) return this.ai;
    if (!this.apiKey) return null;
    
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    return this.ai;
  }

  private getModel() {
    return 'gemini-2.5-flash';
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
    if (!this.apiKey) {
        return "演示模式：请在环境中配置您的 API_KEY 以接收真实的 AI 回复。（模拟回复：我可以帮助您学习通信原理！）";
    }

    if (!this.chatSession) {
      await this.initChat();
    }

    if (!this.chatSession) {
        return "错误：无法初始化 AI 会话。";
    }

    try {
      const response: GenerateContentResponse = await this.chatSession.sendMessage({
        message,
      });
      return response.text || "抱歉，我无法生成回复。";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "我现在无法连接到知识库。请稍后再试。";
    }
  }

  /**
   * Generates a structured list of exam questions based on a topic.
   * Uses Gemini 2.5 JSON Schema mode for reliable output.
   */
  async generateExamQuestions(topic: string, count: number = 3): Promise<Question[]> {
    const ai = this.getAIInstance();
    
    if (!ai || !this.apiKey) {
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
}

export const geminiService = new GeminiService();
