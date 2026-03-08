// 图标映射
import * as icons from '@ant-design/icons-vue'

export const iconMap: Record<string, any> = icons

// 获取图标组件
export function getIcon(iconName?: string) {
  if (!iconName) return null
  return iconMap[iconName] || null
}
