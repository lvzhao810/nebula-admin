import { request } from '@/utils/request'
import type { MenuItem } from '@/types'

/**
 * 获取菜单列表（树形）
 */
export function getMenuList(params?: { status?: number }) {
  return request.get<MenuItem[]>('/menu/list', { params })
}

/**
 * 获取用户菜单
 */
export function getUserMenu() {
  return request.get<MenuItem[]>('/menu/user')
}

/**
 * 获取菜单详情
 */
export function getMenuDetail(id: number | string) {
  return request.get<MenuItem>(`/menu/${id}`)
}

/**
 * 新增菜单
 */
export function addMenu(data: Partial<MenuItem>) {
  return request.post('/menu', data)
}

/**
 * 更新菜单
 */
export function updateMenu(id: number | string, data: Partial<MenuItem>) {
  return request.put(`/menu/${id}`, data)
}

/**
 * 删除菜单
 */
export function deleteMenu(id: number | string) {
  return request.delete(`/menu/${id}`)
}
