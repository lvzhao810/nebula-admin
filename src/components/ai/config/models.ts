/**
 * AI 模型配置
 */

import type { AiModelConfig } from '../types/ai'
import type { AiModel } from '../types/ai'

/**
 * 可用的 AI 模型配置
 */
export const AI_MODELS: Record<string, AiModelConfig> = {
  qwen: {
    id: 'qwen',
    name: '通义千问',
    provider: '阿里云',
    apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    modelName: 'qwen-turbo',
    freeQuota: 1000000,
  },
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-3.5-turbo',
    freeQuota: 0,
  },
  wenxin: {
    id: 'wenxin',
    name: '文心一言',
    provider: '百度',
    apiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
    modelName: 'ERNIE-Bot-4',
    freeQuota: 0,
  },
  zhipu: {
    id: 'zhipu',
    name: '智谱 GLM',
    provider: '智谱AI',
    apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    modelName: 'glm-4',
    freeQuota: 1000000,
  },
} as const

/**
 * 获取默认模型
 */
export const DEFAULT_MODEL: AiModel = 'qwen'

/**
 * 系统提示词
 */
export const SYSTEM_PROMPTS = {
  work: `你是 Nebula Admin 的专业助手，专注于回答系统使用问题。

知识来源：
- 项目文档：README、组件说明、API 文档
- 组件使用示例和最佳实践
- 常见问题和故障排查

只能回答与 Nebula Admin 相关的问题，拒绝无关话题。
回答要：
1. 简洁明了，直击要点
2. 准确，提供代码示例
3. 如果不确定，诚实告知用户
4. 保持友好、专业的语气`,

  chat: `你是一个友好的 AI 助手，可以回答任何问题。

特点：
- 礼貌、幽默、乐于助人
- 知识面广，思维活跃
- 可以闲聊、讲笑话、解答日常问题

保持友好，像朋友一样和用户交流。`,
} as const
