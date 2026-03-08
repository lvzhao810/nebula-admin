/**
 * 文件下载工具
 */

import type { DownloadConfig } from '@/components/document/types'

/**
 * 下载文件
 */
export async function downloadFile(
  url: string,
  config: DownloadConfig
): Promise<void> {
  const { filename, onProgress } = config

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`下载失败: ${response.status} ${response.statusText}`)
    }

    // 获取文件大小以计算进度
    const contentLength = response.headers.get('content-length')
    const total = contentLength ? parseInt(contentLength, 10) : 0

    // 创建读取器
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法读取响应流')
    }

    // 读取数据
    const chunks: Uint8Array[] = []
    let receivedLength = 0

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      chunks.push(value)
      receivedLength += value.length

      // 触发进度回调
      if (onProgress && total > 0) {
        const percent = Math.round((receivedLength / total) * 100)
        onProgress(percent)
      }
    }

    // 合并数据块
    const blob = new Blob(chunks as BlobPart[])

    // 创建下载链接
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 释放 URL 对象
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('下载失败:', error)
    throw error
  }
}

/**
 * 下载 Blob 数据
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(blobUrl)
}

/**
 * 下载文本内容
 */
export function downloadText(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  downloadBlob(blob, filename)
}

/**
 * 下载 JSON 数据
 */
export function downloadJson(data: any, filename: string): void {
  const content = JSON.stringify(data, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  downloadBlob(blob, filename.endsWith('.json') ? filename : `${filename}.json`)
}

/**
 * 下载 CSV 数据
 */
export function downloadCsv(data: any[], filename: string): void {
  if (data.length === 0) {
    console.warn('没有数据可导出')
    return
  }

  // 获取表头
  const headers = Object.keys(data[0])

  // 构建 CSV 内容
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // 处理包含逗号或引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      }).join(',')
    )
  ].join('\n')

  // 添加 BOM 以支持中文
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`)
}

/**
 * 下载图片
 */
export async function downloadImage(
  url: string,
  filename: string
): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    // 尝试从 URL 或 Content-Type 获取文件扩展名
    let ext = filename.split('.').pop()
    if (!ext || ext === filename) {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('png')) ext = 'png'
      else if (contentType?.includes('jpeg') || contentType?.includes('jpg')) ext = 'jpg'
      else if (contentType?.includes('webp')) ext = 'webp'
      else if (contentType?.includes('gif')) ext = 'gif'
      else if (contentType?.includes('svg')) ext = 'svg'
      else ext = 'png'
    }

    const fullFilename = filename.includes('.') ? filename : `${filename}.${ext}`
    downloadBlob(blob, fullFilename)
  } catch (error) {
    console.error('下载图片失败:', error)
    throw error
  }
}

/**
 * 批量下载文件
 */
export async function batchDownload(
  items: Array<{ url: string; filename: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  for (let i = 0; i < items.length; i++) {
    const { url, filename } = items[i]

    try {
      await downloadFile(url, { filename })
      if (onProgress) {
        onProgress(i + 1, items.length)
      }
    } catch (error) {
      console.error(`下载 ${filename} 失败:`, error)
    }

    // 添加延迟避免浏览器阻止多个下载
    if (i < items.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300))
    }
  }
}

/**
 * 下载截图（将 DOM 元素转为图片）
 */
// export async function downloadScreenshot(
//   element: HTMLElement,
//   filename: string,
//   options: {
//     width?: number
//     height?: number
//     scale?: number
//   } = {}
// ): Promise<void> {
//   // 注意：需要安装 html2canvas 库
//   // npm install html2canvas
//   // import html2canvas from 'html2canvas'

//   try {
//     const { html2canvas } = await import('html2canvas')

//     const canvas = await html2canvas(element, {
//       width: options.width,
//       height: options.height,
//       scale: options.scale || window.devicePixelRatio,
//       useCORS: true,
//       backgroundColor: '#ffffff',
//     })

//     canvas.toBlob(blob => {
//       if (blob) {
//         downloadBlob(blob, filename.endsWith('.png') ? filename : `${filename}.png`)
//       }
//     }, 'image/png')
//   } catch (error) {
//     console.error('生成截图失败:', error)
//     throw error
//   }
// }

/**
 * 下载 PDF（使用 jsPDF）
 */
// export async function downloadPdf(
//   element: HTMLElement,
//   filename: string,
//   options: {
//     orientation?: 'portrait' | 'landscape'
//     format?: 'a4' | 'a3' | 'letter'
//     quality?: number
//   } = {}
// ): Promise<void> {
//   // 注意：需要安装 jspdf 和 html2canvas 库
//   // npm install jspdf html2canvas
//   // import jsPDF from 'jspdf'
//   // import { html2canvas } from 'html2canvas'

//   try {
//     const { default: jsPDF } = await import('jspdf')
//     const { html2canvas } = await import('html2canvas')

//     const canvas = await html2canvas(element, {
//       scale: options.quality || 2,
//       useCORS: true,
//       backgroundColor: '#ffffff',
//     })

//     const imgData = canvas.toDataURL('image/png')
//     const pdf = new jsPDF({
//       orientation: options.orientation || 'portrait',
//       unit: 'mm',
//       format: options.format || 'a4',
//     })

//     const pdfWidth = pdf.internal.pageSize.getWidth()
//     const pdfHeight = pdf.internal.pageSize.getHeight()
//     const imgWidth = canvas.width
//     const imgHeight = canvas.height
//     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
//     const imgX = (pdfWidth - imgWidth * ratio) / 2
//     const imgY = 10

//     pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
//     pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
//   } catch (error) {
//     console.error('生成 PDF 失败:', error)
//     throw error
//   }
// }

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

/**
 * 根据 MIME 类型获取文件扩展名
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'application/json': 'json',
    'text/csv': 'csv',
  }

  return mimeMap[mimeType] || 'bin'
}
