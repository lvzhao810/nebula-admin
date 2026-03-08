import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { storage } from './storage'
import router from '@/router'

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const STATUS_MESSAGES: Record<number, string> = {
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  500: '服务器错误',
}

function showError(errorMsg: string): void {
  message.error(errorMsg)
}

function handleAuthError(): void {
  storage.clear()
  router.push('/login')
  showError('登录已过期，请重新登录')
}

function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.status) {
    return STATUS_MESSAGES[error.response.status] || '请求失败'
  }
  if (error.request) {
    return '网络错误，请检查网络连接'
  }
  return '请求配置错误'
}

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, data, message: msg } = response.data

    // Success response
    if (code === 200 || code === 0) {
      return data
    }

    // Auth error
    if (code === 401) {
      handleAuthError()
      return Promise.reject(new Error(msg || '未登录'))
    }

    // Business error
    const errorMsg = msg || (code === 403 ? '没有权限访问' : '请求失败')
    showError(errorMsg)
    return Promise.reject(new Error(errorMsg))
  },
  (error: any) => {
    console.error('响应错误:', error)
    const errorMsg = getErrorMessage(error)

    // Handle auth errors
    if (error.response?.status === 401) {
      handleAuthError()
    } else {
      showError(errorMsg)
    }

    return Promise.reject(error)
  }
)

export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },
}

export default service
