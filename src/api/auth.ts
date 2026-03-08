import { request } from '@/utils/request'
import type { LoginParams, LoginResult } from '@/types'

/**
 * 登录
 */
export function login(params: LoginParams) {
  return request.post<LoginResult>('/auth/login', params)
}

/**
 * 登出
 */
export function logout() {
  return request.post('/auth/logout')
}

/**
 * 获取验证码
 */
export function getCaptcha() {
  return request.get('/auth/captcha')
}
