const TOKEN_KEY = 'nebula_token'
const USER_INFO_KEY = 'nebula_user_info'
const ROLES_KEY = 'nebula_roles'
const PERMISSIONS_KEY = 'nebula_permissions'

const STORAGE_KEYS = [TOKEN_KEY, USER_INFO_KEY, ROLES_KEY, PERMISSIONS_KEY] as const

function getStorage(remember: boolean): Storage {
  return remember ? localStorage : sessionStorage
}

function getItem(key: string): string | null {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

function setJsonItem(key: string, value: unknown, remember: boolean): void {
  getStorage(remember).setItem(key, JSON.stringify(value))
}

function getJsonItem<T>(key: string, defaultValue: T): T {
  const item = getItem(key)
  return item ? JSON.parse(item) : defaultValue
}

function removeItem(key: string): void {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

export const storage = {
  getToken(): string | null {
    return getItem(TOKEN_KEY)
  },

  setToken(token: string, remember = false): void {
    getStorage(remember).setItem(TOKEN_KEY, token)
  },

  getUserInfo(): unknown {
    return getJsonItem(USER_INFO_KEY, null)
  },

  setUserInfo(userInfo: unknown, remember = false): void {
    setJsonItem(USER_INFO_KEY, userInfo, remember)
  },

  getRoles(): string[] {
    return getJsonItem(ROLES_KEY, [])
  },

  setRoles(roles: string[], remember = false): void {
    setJsonItem(ROLES_KEY, roles, remember)
  },

  getPermissions(): string[] {
    return getJsonItem(PERMISSIONS_KEY, [])
  },

  setPermissions(permissions: string[], remember = false): void {
    setJsonItem(PERMISSIONS_KEY, permissions, remember)
  },

  clear(): void {
    STORAGE_KEYS.forEach((key) => removeItem(key))
  },
}
