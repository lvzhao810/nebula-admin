// src/views/components/mocks/index.ts
import type { UserInfo, Role, PageResult } from '@/types'
import type { ApiResponse } from '@/utils/request'

// 用户数据
export const mockUsers: UserInfo[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  nickname: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `138${String(i).padStart(8, '0')}`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
  status: i % 3 === 0 ? 0 : 1, // 0: 禁用, 1: 启用
  roleId: (i % 3) + 1,
  roleName: ['超级管理员', '管理员', '普通用户'][i % 3],
  createTime: new Date(Date.now() - i * 86400000).toISOString(),
}))

// 角色数据
export const mockRoles: Role[] = [
  {
    id: 1,
    roleName: '超级管理员',
    roleCode: 'super_admin',
    description: '拥有所有权限',
    status: 1,
    permissions: ['*'],
    createTime: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 2,
    roleName: '管理员',
    roleCode: 'admin',
    description: '拥有部分权限',
    status: 1,
    permissions: ['user:read', 'user:write', 'role:read'],
    createTime: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 3,
    roleName: '普通用户',
    roleCode: 'user',
    description: '基本权限',
    status: 1,
    permissions: ['user:read'],
    createTime: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
]

// 模拟获取用户列表
export const mockFetchUsers = (params: {
  page: number
  pageSize: number
  keyword?: string
  status?: number
}): Promise<ApiResponse<PageResult<UserInfo>>> => {
  let data = [...mockUsers]

  // 搜索过滤
  if (params.keyword) {
    data = data.filter(u =>
      u.username.includes(params.keyword!) ||
      u.nickname?.includes(params.keyword!) ||
      u.email?.includes(params.keyword!)
    )
  }
  if (params.status !== undefined) {
    data = data.filter(u => u.status === params.status)
  }

  // 分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const pageData = data.slice(start, end)

  return Promise.resolve({
    code: 200,
    data: {
      list: pageData,
      total: data.length,
      page: params.page,
      pageSize: params.pageSize,
    },
    message: '获取成功',
  })
}

// 模拟获取角色列表
export const mockFetchRoles = (): Promise<ApiResponse<Role[]>> => {
  return Promise.resolve({
    code: 200,
    data: mockRoles,
    message: '获取成功',
  })
}
