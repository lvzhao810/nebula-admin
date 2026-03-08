import { storage } from './storage'

function checkItems(
  userItems: string[],
  items: string | string[] | undefined,
  checkType: 'some' | 'every'
): boolean {
  if (!userItems.length) return false
  if (!items) return true

  const itemsToCheck = Array.isArray(items) ? items : [items]
  return itemsToCheck[checkType]((item) => userItems.includes(item))
}

export function hasPermission(permission?: string | string[]): boolean {
  const userPermissions = storage.getPermissions()
  return checkItems(userPermissions, permission, 'some')
}

export function hasAllPermissions(permissions: string[]): boolean {
  const userPermissions = storage.getPermissions()
  return checkItems(userPermissions, permissions, 'every')
}

export function hasRole(role?: string | string[]): boolean {
  const userRoles = storage.getRoles()
  return checkItems(userRoles, role, 'some')
}

export function hasAllRoles(roles: string[]): boolean {
  const userRoles = storage.getRoles()
  return checkItems(userRoles, roles, 'every')
}
