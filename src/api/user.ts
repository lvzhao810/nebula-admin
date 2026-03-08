import { request } from '@/utils/request'
import type { UserInfo, PageParams, PageResult } from '@/types'

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get<UserInfo>('/user/info')
}

/**
 * 获取用户列表
 */
export function getUserList(params: PageParams & { username?: string; status?: number }) {
  return request.get<PageResult<UserInfo>>('/user/list', { params })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: number | string) {
  return request.get<UserInfo>(`/user/${id}`)
}

/**
 * 新增用户
 */
export function addUser(data: Partial<UserInfo>) {
  return request.post('/user', data)
}

/**
 * 更新用户
 */
export function updateUser(id: number | string, data: Partial<UserInfo>) {
  return request.put(`/user/${id}`, data)
}

/**
 * 删除用户
 */
export function deleteUser(id: number | string) {
  return request.delete(`/user/${id}`)
}

/**
 * 修改用户状态
 */
export function updateUserStatus(id: number | string, status: number) {
  return request.put(`/user/${id}/status`, { status })
}

/**
 * 重置用户密码
 */
export function resetUserPassword(id: number | string, password: string) {
  return request.put(`/user/${id}/password`, { password })
}
