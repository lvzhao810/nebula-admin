/**
 * 文档预览/打印/下载 模块类型定义
 */

/**
 * 支持的文档类型
 */
export type DocumentType = 'pdf' | 'image' | 'word' | 'excel' | 'other'

/**
 * 打印模板类型
 */
export type PrintTemplateType = 'voucher' | 'idcard' | 'label' | 'custom'

/**
 * 文档信息
 */
export interface DocumentInfo {
  id: string
  name: string
  type: DocumentType
  url: string
  size?: number
  thumbnail?: string
}

/**
 * 预览配置
 */
export interface PreviewConfig {
  width?: number
  height?: number
  showToolbar?: boolean
  defaultScale?: number
}

/**
 * 打印配置
 */
export interface PrintConfig {
  templateType: PrintTemplateType
  orientation?: 'portrait' | 'landscape'
  pageSize?: 'a4' | 'a5' | 'letter'
  copies?: number
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

/**
 * 凭证打印数据
 */
export interface VoucherData {
  title: string
  voucherNo: string
  date: string
  items: Array<{
    name: string
    quantity: number
    unit: string
    price: number
    amount: number
  }>
  totalAmount: number
  remark?: string
}

/**
 * ID 卡打印数据
 */
export interface IdCardData {
  name: string
  id: string
  department: string
  position: string
  photo?: string
  validFrom: string
  validTo: string
}

/**
 * 标签打印数据
 */
export interface LabelData {
  text: string
  qrCode?: string
  barCode?: string
  size?: { width: number; height: number }
}

/**
 * 下载配置
 */
export interface DownloadConfig {
  filename: string
  format?: 'blob' | 'arraybuffer' | 'text'
  onProgress?: (percent: number) => void
}
