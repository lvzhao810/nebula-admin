/**
 * AI 智能助手类型定义
 */

// 消息角色
export type MessageRole = 'user' | 'assistant'

// 聊天消息
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
}

// AI 模型类型
export type AiModel = 'qwen' | 'chatgpt' | 'wenxin' | 'zhipu'

// AI 模型配置
export interface AiModelConfig {
  id: AiModel
  name: string
  provider: string
  apiKey?: string
  apiUrl: string
  modelName: string
  freeQuota: number
}

// 助手模式
export type AssistantMode = 'work' | 'chat'

// 模型状态
export interface ModelStatus {
  isLoading: boolean
  error: string | null
  quotaUsed: number
}

// 聊天状态
export interface ChatState {
  messages: ChatMessage[]
  currentMode: AssistantMode
  currentModel: AiModel
  isTyping: boolean
}
