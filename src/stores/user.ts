import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'
import type { UserInfo, LoginParams } from '@/types'

const DEFAULT_PERMISSIONS = [
  'system:user:view',
  'system:user:add',
  'system:user:edit',
  'system:user:delete',
  'system:role:view',
  'system:role:add',
  'system:role:edit',
  'system:role:delete',
  'system:menu:view',
  'system:menu:add',
  'system:menu:edit',
  'system:menu:delete',
]

const DEFAULT_ROLES = ['admin']

interface UserState {
  token: string
  userInfo: UserInfo | null
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: storage.getToken() || '',
    userInfo: storage.getUserInfo() as UserInfo | null,
    roles: storage.getRoles(),
    permissions: storage.getPermissions(),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    avatar: (state) => state.userInfo?.avatar || '',
  },

  actions: {
    async login(params: LoginParams) {
      const mockLoginResponse = {
        token: `mock-token-${Date.now()}`,
        userInfo: {
          id: 1,
          username: params.username,
          nickname: '管理员',
          email: 'admin@nebula.com',
          status: 1,
          roleId: 1,
          roleName: '超级管理员',
          createTime: '2024-01-01',
        },
      }

      this.token = mockLoginResponse.token
      this.userInfo = mockLoginResponse.userInfo
      this.roles = DEFAULT_ROLES
      this.permissions = DEFAULT_PERMISSIONS

      storage.setToken(mockLoginResponse.token, params.remember)
      storage.setUserInfo(mockLoginResponse.userInfo, params.remember)
      storage.setRoles(DEFAULT_ROLES, params.remember)
      storage.setPermissions(DEFAULT_PERMISSIONS, params.remember)

      return mockLoginResponse
    },

    async getUserInfo() {
      const mockUserInfo = {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        email: 'admin@nebula.com',
        status: 1,
        roleId: 1,
        roleName: '超级管理员',
        createTime: '2024-01-01',
      }

      this.userInfo = mockUserInfo
      this.roles = DEFAULT_ROLES
      this.permissions = DEFAULT_PERMISSIONS

      return mockUserInfo
    },

    async logout() {
      this.token = ''
      this.userInfo = null
      this.roles = []
      this.permissions = []
      storage.clear()
    },

    updateUserInfo(userInfo: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...userInfo }
        storage.setUserInfo(this.userInfo)
      }
    },
  },
})
