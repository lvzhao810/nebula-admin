import { ref } from 'vue'
import { message } from 'ant-design-vue'
import type { ChatMessage, AssistantMode, AiModel } from '@/components/ai/types/ai'
import { AI_MODELS, SYSTEM_PROMPTS, DEFAULT_MODEL } from '@/components/ai/config/models'

export interface UseAiChatOptions {
  mode?: AssistantMode
  model?: AiModel
  apiKey?: string
}

export function useAiChat(options: UseAiChatOptions = {}) {
  // 状态
  const messages = ref<ChatMessage[]>([])
  const currentMode = ref<AssistantMode>(options.mode || 'work')
  const currentModel = ref<AiModel>(options.model || DEFAULT_MODEL)
  const isLoading = ref(false)
  const isTyping = ref(false)
  const apiKey = ref(options.apiKey || '')

  /**
   * 发送消息到 AI（带打字机效果）
   */
  async function sendMessage(text: string): Promise<void> {
    if (!text.trim() || isLoading.value) return

    // 检查 API Key
    const storedApiKey = getApiKeyFromStorage()
    if (!apiKey.value && !storedApiKey) {
      message.warning('请先配置 API Key')
      return
    }

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    }
    messages.value.push(userMessage)

    // 开始加载
    isLoading.value = true
    isTyping.value = true

    try {
      // 获取当前模型配置
      const modelConfig = AI_MODELS[currentModel.value]

      // 构建消息历史（包含当前用户消息）
      const messageHistory = messages.value.map(m => ({
        role: m.role,
        content: m.content
      }))

      // 构建请求数据（不使用流式）
      const requestData = buildRequestData(messageHistory, modelConfig, false)

      console.log('========== API 请求详情 ==========')
      console.log('URL:', modelConfig.apiUrl)
      console.log('模型:', currentModel.value, '(', modelConfig.modelName, ')')
      console.log('使用的 API Key:', (apiKey.value || storedApiKey).substring(0, 20) + '...')
      console.log('消息历史长度:', messageHistory.length)
      console.log('完整请求数据:', JSON.stringify(requestData, null, 2))
      console.log('================================')

      const response = await fetch(modelConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.value || storedApiKey}`,
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('========== API 错误响应 ==========')
        console.error('状态码:', response.status)
        console.error('错误详情:', JSON.stringify(errorData, null, 2))
        console.error('================================')
        throw new Error(`API 请求失败: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const responseData = await response.json()
      console.log('========== API 成功响应 ==========')
      console.log('响应数据:', JSON.stringify(responseData, null, 2))
      console.log('================================')

      const aiContent = parseResponse(responseData, currentModel.value)

      console.log('========== 解析后内容 ==========')
      console.log('内容长度:', aiContent.length)
      console.log('内容全文:', aiContent)
      console.log('内容类型:', typeof aiContent)
      console.log('================================')

      if (!aiContent || aiContent.length === 0) {
        throw new Error('AI 返回内容为空')
      }

      // 创建 AI 消息并使用打字机效果
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }
      messages.value.push(aiMessage)

      console.log('AI 消息已创建，准备开始打字...')

      // 使用打字机效果显示内容
      await typewriterEffect(aiMessage, aiContent)

      console.log('========== 最终结果 ==========')
      console.log('最终消息内容:', aiMessage.content)
      console.log('最终消息长度:', aiMessage.content.length)
      console.log('================================')

    } catch (error) {
      console.error('AI 调用失败:', error)
      message.error(error instanceof Error ? error.message : 'AI 调用失败，请稍后重试')

      // 添加错误消息
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请检查 API 配置或稍后重试。',
        timestamp: Date.now(),
      }
      messages.value.push(errorMessage)
    } finally {
      isLoading.value = false
      isTyping.value = false
    }
  }

  /**
   * 前端打字机效果（使用新对象方式）
   */
  async function typewriterEffect(message: ChatMessage, fullText: string): Promise<void> {
    console.log('========== 打字机效果 ==========')
    console.log('完整文本长度:', fullText.length)
    console.log('完整文本:', fullText)
    console.log('开始打字...')
    console.log('================================')

    const chars = fullText.split('')
    let currentText = ''

    for (let i = 0; i < chars.length; i++) {
      currentText += chars[i]

      // 创建新对象而不是修改原对象
      const updatedMessage: ChatMessage = {
        ...message,
        content: currentText
      }

      // 找到并替换数组中的消息对象
      const index = messages.value.findIndex(m => m.id === message.id)
      if (index !== -1) {
        messages.value[index] = updatedMessage
        // 触发响应式更新
        messages.value = [...messages.value]
      }

      // 打字速度：每个字符间隔 30ms（更自然的打字效果）
      await new Promise(resolve => setTimeout(resolve, 30))
    }

    console.log('打字完成！最终长度:', message.content.length)
    console.log('最终内容:', message.content)
  }

  /**
   * 获取流式响应（直接更新消息对象）
   */
  async function fetchStreamResponse(
    messageHistory: Array<{role: string, content: string}>,
    modelConfig: any,
    storedApiKey: string,
    aiMessage: ChatMessage
  ): Promise<boolean> {
    const requestData = buildRequestData(messageHistory, modelConfig, true)

    console.log('发送流式 API 请求:', {
      url: modelConfig.apiUrl,
      model: currentModel.value,
      stream: true
    })

    const response = await fetch(modelConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value || storedApiKey}`,
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
    }

    // 处理流式响应
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('无法读取响应流')
    }

    let buffer = ''
    let fullContent = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      // 解码数据块
      buffer += decoder.decode(value, { stream: true })

      // 处理 SSE 格式（data: {...}\n\n）
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留不完整的行

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim()

          // 跳过 [DONE] 标记
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parseStreamChunk(parsed, currentModel.value)

            if (content) {
              fullContent += content
              aiMessage.content = fullContent
              // 触发响应式更新
              messages.value = [...messages.value]
            }
          } catch (e) {
            console.warn('解析 SSE 数据失败:', data, e)
          }
        }
      }
    }

    console.log('流式响应完成，总内容长度:', fullContent.length)

    // 返回是否成功（有内容）
    return fullContent.length > 0
  }

  /**
   * 构建 API 请求数据
   */
  function buildRequestData(messageHistory: Array<{role: string, content: string}>, modelConfig: any, stream: boolean = false): any {
    const systemPrompt = SYSTEM_PROMPTS[currentMode.value]

    // 通义千问使用不同的格式
    if (currentModel.value === 'qwen') {
      const request: any = {
        model: modelConfig.modelName,
        input: {
          messages: [
            { role: 'system', content: systemPrompt },
            ...messageHistory,
          ],
        },
        parameters: {
          result_format: 'message',
          temperature: 0.7,
          max_tokens: 2000,
          incremental_output: stream, // 流式输出
        },
      }
      return request
    }

    // OpenAI 格式（ChatGPT、智谱等）
    return {
      model: modelConfig.modelName,
      stream: stream, // 启用流式响应
      messages: [
        { role: 'system', content: systemPrompt },
        ...messageHistory,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }
  }

  /**
   * 解析流式响应的数据块
   */
  function parseStreamChunk(chunk: any, model: AiModel): string | null {
    // 智谱 GLM 流式响应格式
    if (model === 'zhipu') {
      return chunk.choices?.[0]?.delta?.content || null
    }

    // 通义千问流式响应格式
    if (model === 'qwen') {
      return chunk.output?.text || null
    }

    // OpenAI 格式（ChatGPT）
    return chunk.choices?.[0]?.delta?.content || null
  }

  /**
   * 解析 API 响应
   */
  function parseResponse(data: any, model: AiModel): string {
    console.log('========== 解析响应数据 ==========')
    console.log('模型:', model)
    console.log('原始响应数据:', JSON.stringify(data, null, 2))
    console.log('================================')

    // 通义千问响应格式
    if (model === 'qwen') {
      const content = data.output?.choices?.[0]?.message?.content || data.output?.text || ''
      console.log('通义千问解析结果:', content)
      return content || '无法解析响应'
    }

    // 智谱 GLM 和 OpenAI 格式
    const content = data.choices?.[0]?.message?.content || ''
    console.log('OpenAI 格式解析结果:', content)

    if (!content) {
      console.warn('无法从以下数据中解析内容:', data)
    }

    return content || '无法解析响应'
  }

  /**
   * 从 localStorage 获取 API Key
   */
  function getApiKeyFromStorage(): string {
    const keys = JSON.parse(localStorage.getItem('ai-api-keys') || '{}')
    return keys[currentModel.value] || ''
  }

  /**
   * 保存 API Key 到 localStorage
   */
  function saveApiKey(key: string): void {
    const keys = JSON.parse(localStorage.getItem('ai-api-keys') || '{}')
    keys[currentModel.value] = key
    localStorage.setItem('ai-api-keys', JSON.stringify(keys))
    apiKey.value = key
  }

  /**
   * 清空对话
   */
  function clearChat(): void {
    messages.value = []
  }

  /**
   * 导出对话
   */
  function exportChat(): string {
    return messages.value
      .map(m => `${m.role === 'user' ? '用户' : 'AI'} [${new Date(m.timestamp).toLocaleString('zh-CN')}]:\n${m.content}`)
      .join('\n\n---\n\n')
  }

  return {
    // 状态
    messages,
    currentMode,
    currentModel,
    isLoading,
    isTyping,
    apiKey,

    // 方法
    sendMessage,
    clearChat,
    exportChat,
    saveApiKey,
  }
}
