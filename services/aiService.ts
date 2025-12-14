import { geminiService } from './geminiService';
import { deepSeekService } from './deepSeekService';
import { Question, SmartQuestionConfig } from '../types';

export type AIProvider = 'gemini' | 'deepseek';

/**
 * 统一的 AI 服务管理器
 * 支持在 Gemini 和 DeepSeek 之间切换
 */
class AIServiceManager {
    private currentProvider: AIProvider = 'gemini';

    /**
     * 设置当前使用的 AI 提供商
     */
    setProvider(provider: AIProvider) {
        this.currentProvider = provider;
        console.log(`🤖 AI Provider switched to: ${provider}`);
    }

    /**
     * 获取当前使用的 AI 提供商
     */
    getProvider(): AIProvider {
        return this.currentProvider;
    }

    /**
     * 初始化聊天会话
     */
    async initChat() {
        if (this.currentProvider === 'gemini') {
            await geminiService.initChat();
        } else {
            await deepSeekService.initChat();
        }
    }

    /**
     * 发送消息
     */
    async sendMessage(message: string): Promise<string> {
        console.log(`📨 发送消息 - 当前 AI 提供商: ${this.currentProvider}`);
        if (this.currentProvider === 'gemini') {
            return await geminiService.sendMessage(message);
        } else {
            return await deepSeekService.sendMessage(message);
        }
    }

    /**
     * 生成考试题目
     */
    async generateExamQuestions(topic: string, count: number = 3): Promise<Question[]> {
        if (this.currentProvider === 'gemini') {
            return await geminiService.generateExamQuestions(topic, count);
        } else {
            return await deepSeekService.generateExamQuestions(topic, count);
        }
    }

    /**
     * 按配置生成单道题目，便于逐题构建试卷
     */
    async generateQuestion(config: SmartQuestionConfig): Promise<Question | null> {
        if (this.currentProvider === 'gemini') {
            return await geminiService.generateQuestion(config);
        } else {
            return await deepSeekService.generateQuestion(config);
        }
    }

    /**
     * 重置对话（仅 DeepSeek 需要）
     */
    resetConversation() {
        if (this.currentProvider === 'deepseek') {
            deepSeekService.resetConversation();
        }
        // Gemini 使用有状态会话，需要重新初始化
        if (this.currentProvider === 'gemini') {
            this.initChat();
        }
    }

    /**
     * 强制重置当前服务实例（用于 API key 更新后）
     */
    resetInstance() {
        if (this.currentProvider === 'gemini') {
            geminiService.resetInstance();
        } else {
            deepSeekService.resetInstance();
        }
    }

    /**
     * 获取可用的 AI 提供商列表
     */
    getAvailableProviders(): { id: AIProvider; name: string; description: string }[] {
        return [
            {
                id: 'gemini',
                name: 'Google Gemini',
                description: 'Google 的先进 AI 模型，擅长多模态理解',
            },
            {
                id: 'deepseek',
                name: 'DeepSeek',
                description: '高性能的中文 AI 模型，专注于深度推理',
            },
        ];
    }
}

export const aiService = new AIServiceManager();

// 为了向后兼容，也导出原始服务
export { geminiService, deepSeekService };
