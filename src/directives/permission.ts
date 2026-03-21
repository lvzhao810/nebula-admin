import type { Directive } from 'vue'
import { hasPermission } from '@/utils/permission'

export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    if (value) {
      // 支持单个权限字符串或权限数组
      const permissions = Array.isArray(value) ? value : [value]
      if (!hasPermission(permissions)) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}
