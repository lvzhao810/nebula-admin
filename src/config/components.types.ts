// src/config/components.types.ts
export enum ComponentCategory {
  TABLE = 'table',
  FORM = 'form',
  DATA_DISPLAY = 'data-display',
  DRAG_DROP = 'drag-drop',
  LAYOUT = 'layout',
  EDITOR = 'editor',
  INTERACTION = 'interaction',
  UPLOAD_SELECT = 'upload-select',
}

export interface ComponentInfo {
  id: string
  name: string
  category: ComponentCategory
  description: string
  route: string
  demoPath: string
  tags?: string[]
  priority: number
}
