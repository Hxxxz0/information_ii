import OpenAI from 'openai';
import { SYSTEM_INSTRUCTION } from '../constants';
import { Question, SmartQuestionConfig, QuestionType, Difficulty } from '../types';

// Helper to safely get key without crashing in strict browser environments
const getApiKey = () => {
    // 1. 优先从 localStorage 读取（用户在设置中配置的）
    try {
        const localKey = localStorage.getItem('deepseekApiKey');
        if (localKey && localKey.trim()) {
            console.log('✅ DeepSeek API Key 从 localStorage 读取成功');
            return localKey.trim();
        }
    } catch (e) {
        // localStorage 可能不可用
    }

    // 2. 从环境变量读取（.env.local 配置的）
    try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env && process.env.DEEPSEEK_API_KEY) {
            console.log('✅ DeepSeek API Key 从环境变量读取成功');
            // @ts-ignore
            return process.env.DEEPSEEK_API_KEY;
        }
    } catch (e) {
        return '';
    }
    console.log('❌ DeepSeek API Key 未找到');
    return '';
};

export class DeepSeekService {
    private client: OpenAI | null = null;
    private cachedApiKey: string = ''; // 缓存当前使用的 API key
    private conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

    constructor() {
        // 不再在构造函数中初始化
        // 初始化对话历史
        this.conversationHistory.push({
            role: 'system',
            content: SYSTEM_INSTRUCTION,
        });
    }

    private getClient(): OpenAI | null {
        const apiKey = getApiKey();

        if (!apiKey) {
            // 如果 API key 为空，清除缓存的客户端
            this.client = null;
            this.cachedApiKey = '';
            return null;
        }

        // 如果 API key 改变了，重新创建客户端实例
        if (!this.client || this.cachedApiKey !== apiKey) {
            this.client = new OpenAI({
                baseURL: 'https://api.deepseek.com',
                apiKey: apiKey,
                dangerouslyAllowBrowser: true, // 注意：这仅用于开发，生产环境应使用后端代理
            });
            this.cachedApiKey = apiKey;
            // 重置对话历史，因为 API key 改变了
            this.resetConversation();
        }

        return this.client;
    }

    /**
     * 强制重置客户端实例（用于 API key 更新后）
     */
    resetInstance() {
        this.client = null;
        this.cachedApiKey = '';
        this.resetConversation();
    }

    async initChat() {
        // DeepSeek 使用无状态 API，不需要初始化
        const client = this.getClient();
        if (!client) {
            console.warn('DeepSeek client not initialized - no API key');
        }
    }

    async sendMessage(message: string): Promise<string> {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.warn('DeepSeek API Key 未找到。请检查：1) localStorage 中是否有 deepseekApiKey，2) 环境变量中是否有 DEEPSEEK_API_KEY');
            return "演示模式：请在设置中配置您的 DeepSeek API_KEY 以接收真实的 AI 回复。（模拟回复：我可以帮助您学习通信原理！）";
        }

        // 确保使用最新的 API key 创建客户端
        const client = this.getClient();
        if (!client) {
            console.error('无法创建 DeepSeek 客户端，API key:', apiKey ? `${apiKey.substring(0, 10)}...` : '未找到');
            return "演示模式：无法初始化 DeepSeek 服务。请检查您的 API key 是否正确。";
        }

        try {
            // 添加用户消息到历史
            this.conversationHistory.push({
                role: 'user',
                content: message,
            });

            console.log('🔄 正在调用 DeepSeek API...');

            // 调用 DeepSeek API
            const completion = await client.chat.completions.create({
                model: 'deepseek-chat',
                messages: this.conversationHistory,
                temperature: 0.7,
                stream: false,
            });

            console.log('✅ DeepSeek API 调用成功');

            const responseText = completion.choices[0]?.message?.content || "抱歉，我无法生成回复。";

            // 添加助手回复到历史
            this.conversationHistory.push({
                role: 'assistant',
                content: responseText,
            });

            return responseText;
        } catch (error: any) {
            console.error("❌ DeepSeek API 错误详情:", error);
            console.error("错误消息:", error?.message);
            console.error("错误状态码:", error?.status);
            console.error("错误响应:", error?.response?.data);
            
            // 提供更详细的错误信息
            let errorMessage = "我现在无法连接到知识库。";
            if (error?.message) {
                errorMessage += `\n错误详情: ${error.message}`;
            }
            if (error?.status === 401) {
                errorMessage = "❌ API Key 无效或已过期。请检查您的 DeepSeek API Key 是否正确。";
            } else if (error?.status === 429) {
                errorMessage = "❌ API 调用次数超限。请稍后再试或检查您的配额。";
            } else if (error?.status === 500) {
                errorMessage = "❌ DeepSeek 服务器错误。请稍后再试。";
            }
            
            return errorMessage;
        }
    }

    /**
     * Generates a structured list of exam questions based on a topic.
     * Uses DeepSeek's JSON mode for reliable output.
     */
    async generateExamQuestions(topic: string, count: number = 3): Promise<Question[]> {
        const client = this.getClient();
        const apiKey = getApiKey();

        if (!apiKey || !client) {
            console.warn("No API Key, skipping AI generation");
            return [];
        }

        try {
            const prompt = `创建一个电信工程考试。
主题："${topic}"。
数量：${count} 道题。
包含选择题和简答题的混合。
确保适合大学生的学术标准。
所有问题、选项、答案和解释都必须使用中文。

请以 JSON 数组格式返回，每个题目包含以下字段：
- content: 问题文本（中文）
- options: 选择题的4个选项数组（中文），其他类型为空数组
- correctAnswer: 正确答案文本（中文）
- type: 题目类型，可选值："Choice"、"Fill-in"、"Calculation"
- difficulty: 难度，可选值："Easy"、"Medium"、"Hard"
- explanation: 详细的解答说明（中文）

只返回 JSON 数组，不要包含其他文字说明。`;

            const completion = await client.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的电信工程教育专家，擅长创建高质量的考试题目。请严格按照 JSON 格式返回结果。',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                response_format: { type: 'json_object' },
            });

            const responseText = completion.choices[0]?.message?.content;
            if (!responseText) throw new Error("No data received from AI");

            // 解析 JSON 响应
            let rawQuestions;
            try {
                const parsed = JSON.parse(responseText);
                // DeepSeek 可能返回 { questions: [...] } 或直接返回数组
                rawQuestions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
            } catch (parseError) {
                console.error("Failed to parse JSON:", responseText);
                return [];
            }

            // Map to our internal Question type with IDs
            return rawQuestions.map((q: any, index: number) => ({
                ...q,
                id: `deepseek-${Date.now()}-${index}`,
                knowledgePoints: [], // In a full app, AI would also tag these
            }));

        } catch (error) {
            console.error("Exam Generation Error:", error);
            // Fallback if API fails
            return [];
        }
    }

    /**
     * Generates a single question with constraints for smart exam building.
     */
    async generateQuestion(config: SmartQuestionConfig): Promise<Question | null> {
        const client = this.getClient();
        const apiKey = getApiKey();

        if (!apiKey || !client) {
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
                ? `结合最近对话要点：${config.chatHistory.slice(-6).join(' | ')}`
                : '';
            const avoidBlock = config.avoidTopics?.length
                ? `避免重复：${config.avoidTopics.join('; ')}`
                : '避免与最近练习重复。';
            const knowledgeBlock = config.knowledgePoints?.length
                ? `知识点聚焦：${config.knowledgePoints.join(', ')}`
                : '知识点不限，可自选相关主题。';

            const completion = await client.chat.completions.create({
                model: 'deepseek-chat',
                temperature: 0.7,
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的电信工程出题专家，请严格按照 JSON 对象返回单道题目。',
                    },
                    {
                        role: 'user',
                        content: `创建一道考试题目：
- 主题/场景：${config.topic}
- 题型：${config.type || 'Choice / Fill-in / Calculation / Comprehensive'}
- 难度：${config.difficulty || 'Medium'}
- ${knowledgeBlock}
- ${avoidBlock}
${contextBlock}
输出 JSON 对象，字段：
content(中文题干)，options(数组，选择题填满4个，否则空数组)，correctAnswer(中文)，type(Choice/Fill-in/Calculation/Comprehensive)，difficulty(Easy/Medium/Hard/Expert)，explanation(中文详解)，knowledgePoints(数组，可复用上方知识点)。`,
                    },
                ],
            });

            const responseText = completion.choices[0]?.message?.content;
            if (!responseText) throw new Error("No data received from AI");

            const parsed = JSON.parse(responseText);
            return {
                ...parsed,
                id: `deepseek-${Date.now()}`,
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

    /**
     * 重置对话历史
     */
    resetConversation() {
        this.conversationHistory = [
            {
                role: 'system',
                content: SYSTEM_INSTRUCTION,
            },
        ];
    }
}

export const deepSeekService = new DeepSeekService();
