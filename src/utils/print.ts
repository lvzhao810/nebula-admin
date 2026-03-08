/**
 * 打印服务工具
 */

import type { PrintConfig, VoucherData, IdCardData } from '@/components/document/types'

/**
 * 打印 HTML 内容
 */
export function printHtml(html: string, title: string = '打印文档'): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    console.error('无法打开打印窗口，请检查浏览器弹窗设置')
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'SimSun', serif;
            line-height: 1.6;
          }
          @media print {
            @page {
              margin: 1cm;
            }
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `)
  printWindow.document.close()

  // 等待内容加载完成后打印
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      // 打印后可选择是否关闭窗口
      // printWindow.close()
    }, 250)
  }
}

/**
 * 打印指定 DOM 元素
 */
export function printElement(element: HTMLElement, title: string = '打印文档'): void {
  const html = element.innerHTML
  printHtml(html, title)
}

/**
 * 打印图片
 */
export function printImage(imageUrl: string, title: string = '打印图片'): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" onload="window.print();" />
      </body>
    </html>
  `)
  printWindow.document.close()
}

/**
 * 打印 PDF（通过浏览器直接打开）
 */
export function printPdf(pdfUrl: string): void {
  window.open(pdfUrl, '_blank')
}

/**
 * 打印凭证
 */
export function printVoucher(data: VoucherData): void {
  const html = generateVoucherHtml(data)
  printHtml(html, `凭证 - ${data.voucherNo}`)
}

/**
 * 生成凭证 HTML
 */
function generateVoucherHtml(data: VoucherData): string {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('zh-CN')
  const formatPrice = (price: number) => '¥' + price.toFixed(2)

  const itemsHtml = data.items
    .map(
      (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.unit}</td>
      <td>${formatPrice(item.price)}</td>
      <td>${formatPrice(item.amount)}</td>
    </tr>
  `
    )
    .join('')

  return `
    <div style="padding: 24px; font-family: 'SimSun', serif;">
      <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #000;">
        <h1 style="font-size: 22px; font-weight: bold; margin: 0 0 16px;">${data.title}</h1>
        <div style="display: flex; justify-content: center; gap: 32px;">
          <div><span style="margin-right: 4px;">凭证编号：</span>${data.voucherNo}</div>
          <div><span style="margin-right: 4px;">打印日期：</span>${formatDate(data.date)}</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr>
            <th style="border: 1px solid #000; padding: 8px 12px; text-align: center; background: #f5f5f5; font-weight: bold;">序号</th>
            <th style="border: 1px solid #000; padding: 8px 12px; text-align: center; background: #f5f5f5; font-weight: bold;">名称</th>
            <th style="border: 1px solid #000; padding: 8px 12px; text-align: center; background: #f5f5f5; font-weight: bold;">数量</th>
            <th style="border: 1px solid #000; padding: 8px 12px; text-align: center; background: #f5f5f5; font-weight: bold;">单位</th>
            <th style="border: 1px solid #000; padding: 8px 12px; text-align: center; background: #f5f5f5; font-weight: bold;">单价</th>
            <th style="border: 1px solid #000; padding: 8px 12px; text-align: center; background: #f5f5f5; font-weight: bold;">金额</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold;">
            <td colspan="5" style="border: 1px solid #000; padding: 8px 12px; text-align: right; padding-right: 16px;">合计</td>
            <td style="border: 1px solid #000; padding: 8px 12px; text-align: center; font-size: 16px;">${formatPrice(data.totalAmount)}</td>
          </tr>
        </tfoot>
      </table>

      ${data.remark ? `
        <div style="padding: 8px 12px; border: 1px dashed #ccc; background: #fafafa; margin-bottom: 24px;">
          <span style="font-weight: bold; margin-right: 4px;">备注：</span>${data.remark}
        </div>
      ` : ''}

      <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid #ddd;">
        <div><span style="margin-right: 4px;">制单人：</span>_____________</div>
        <div><span style="margin-right: 4px;">审核人：</span>_____________</div>
        <div><span style="margin-right: 4px;">打印时间：</span>${new Date().toLocaleString('zh-CN')}</div>
      </div>
    </div>
  `
}

/**
 * 打印 ID 卡
 */
export function printIdCard(data: IdCardData, side: 'front' | 'back' | 'both' = 'front'): void {
  const frontHtml = generateIdCardFrontHtml(data)
  const backHtml = generateIdCardBackHtml(data)

  if (side === 'front') {
    printHtml(frontHtml, `ID卡正面 - ${data.name}`)
  } else if (side === 'back') {
    printHtml(backHtml, `ID卡背面 - ${data.name}`)
  } else {
    // 双面打印：先打印正面，稍后打印背面
    printHtml(frontHtml, `ID卡正面 - ${data.name}`)
    setTimeout(() => {
      printHtml(backHtml, `ID卡背面 - ${data.name}`)
    }, 1000)
  }
}

/**
 * 生成 ID 卡正面 HTML
 */
function generateIdCardFrontHtml(data: IdCardData): string {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

  return `
    <div style="width: 323px; height: 204px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 16px; color: #fff; font-family: sans-serif;">
      <div style="text-align: center; margin-bottom: 12px;">
        <div style="font-size: 24px; margin-bottom: 4px;">🏢</div>
        <h2 style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 1px;">Nebula Admin</h2>
      </div>

      <div style="display: flex; gap: 12px;">
        <div style="flex-shrink: 0;">
          ${data.photo
      ? `<img src="${data.photo}" style="width: 64px; height: 80px; object-fit: cover; border-radius: 6px; border: 2px solid rgba(255,255,255,0.3);" />`
      : `<div style="width: 64px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 6px; display: flex; align-items: center; justify-content: center;">👤</div>`
    }
        </div>
        <div style="flex: 1;">
          <div style="margin-bottom: 6px; font-size: 12px;"><span style="opacity: 0.8; margin-right: 4px;">姓名：</span><span style="font-weight: 500;">${data.name}</span></div>
          <div style="margin-bottom: 6px; font-size: 12px;"><span style="opacity: 0.8; margin-right: 4px;">编号：</span><span style="font-weight: 500;">${data.id}</span></div>
          <div style="margin-bottom: 6px; font-size: 12px;"><span style="opacity: 0.8; margin-right: 4px;">部门：</span><span style="font-weight: 500;">${data.department}</span></div>
          <div style="margin-bottom: 6px; font-size: 12px;"><span style="opacity: 0.8; margin-right: 4px;">职位：</span><span style="font-weight: 500;">${data.position}</span></div>
        </div>
      </div>

      <div style="text-align: center; font-size: 10px; opacity: 0.8; margin-top: auto;">
        有效期：${formatDate(data.validFrom)} 至 ${formatDate(data.validTo)}
      </div>
    </div>
  `
}

/**
 * 生成 ID 卡背面 HTML
 */
function generateIdCardBackHtml(data: IdCardData): string {
  return `
    <div style="width: 323px; height: 204px; background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); border-radius: 12px; padding: 16px; color: #fff; font-family: sans-serif; display: flex; flex-direction: column;">
      <div style="text-align: center; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9);">使用说明</h3>
      </div>

      <div style="flex: 1;">
        <ul style="margin: 0; padding-left: 16px; font-size: 11px; line-height: 1.8;">
          <li>本卡是身份识别的重要凭证，请妥善保管</li>
          <li>本卡仅限本人使用，不得转借他人</li>
          <li>如遗失请及时挂失补办</li>
          <li>离岗时需交回本卡</li>
        </ul>
      </div>

      <div style="text-align: center; font-size: 10px; opacity: 0.8;">
        <div style="height: 24px; background: repeating-linear-gradient(90deg, #fff 0px, #fff 2px, transparent 2px, transparent 4px, #fff 4px, #fff 5px, transparent 5px, transparent 7px); margin-bottom: 4px;"></div>
        <span style="letter-spacing: 2px;">${data.id}</span>
      </div>
    </div>
  `
}

/**
 * 通用打印函数（带配置）
 */
export function print(content: string, config: PrintConfig): void {
  const { orientation = 'portrait', pageSize = 'a4', margins = { top: 10, right: 10, bottom: 10, left: 10 } } = config

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const cssPage = `
    @page {
      size: ${pageSize} ${orientation};
      margin: ${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm;
    }
  `

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>打印</title>
        <style>
          ${cssPage}
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `)
  printWindow.document.close()
  printWindow.onload = () => {
    printWindow.print()
  }
}
