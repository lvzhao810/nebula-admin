// 用户信息类型
export interface UserInfo {
  id: number | string
  username: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  status: number
  roleId?: number | string
  roleName?: string
  createTime?: string
}

// 登录参数类型
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

// 登录响应类型
export interface LoginResult {
  token: string
  userInfo: UserInfo
}

// 菜单类型
export interface MenuItem {
  id: number | string
  parentId?: number | string
  title: string
  path: string
  icon?: string
  component?: string
  type: number // 1: 目录, 2: 菜单, 3: 按钮
  sort: number
  status: number
  permission?: string
  children?: MenuItem[]
}

// 角色类型
export interface Role {
  id: number | string
  roleName: string
  roleCode: string
  description?: string
  status: number
  permissions?: string[]
  createTime?: string
}

// 权限类型
export interface Permission {
  id: number | string
  name: string
  code: string
  type: number // 1: 菜单, 2: 按钮
  parentId?: number | string
}

// 分页参数类型
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应类型
export interface PageResult<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
