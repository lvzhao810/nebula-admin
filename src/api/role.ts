import { request } from '@/utils/request'
import type { Role, PageParams, PageResult } from '@/types'

/**
 * 获取角色列表
 */
export function getRoleList(params: PageParams & { roleName?: string }) {
  return request.get<PageResult<Role>>('/role/list', { params })
}

/**
 * 获取所有角色
 */
export function getAllRoles() {
  return request.get<Role[]>('/role/all')
}

/**
 * 获取角色详情
 */
export function getRoleDetail(id: number | string) {
  return request.get<Role>(`/role/${id}`)
}

/**
 * 新增角色
 */
export function addRole(data: Partial<Role>) {
  return request.post('/role', data)
}

/**
 * 更新角色
 */
export function updateRole(id: number | string, data: Partial<Role>) {
  return request.put(`/role/${id}`, data)
}

/**
 * 删除角色
 */
export function deleteRole(id: number | string) {
  return request.delete(`/role/${id}`)
}

/**
 * 配置角色权限
 */
export function setRolePermissions(id: number | string, permissions: string[]) {
  return request.put(`/role/${id}/permissions`, { permissions })
}
