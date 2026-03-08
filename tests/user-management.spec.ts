import { test, expect } from '@playwright/test'

// Helper function to login
async function login(page: any) {
  await page.goto('/#/login')
  await page.waitForLoadState('networkidle')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/.*dashboard/, { timeout: 10000 })
  await page.waitForLoadState('networkidle')
}

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)

    // Navigate to user management using hash URL
    await page.goto('/#/system/user')
    // Wait for the URL to update
    await page.waitForURL(/.*system\/user/, { timeout: 10000 })
    await page.waitForLoadState('networkidle')
    // Wait for the page to fully render - wait for the title to be visible
    await page.waitForSelector('h1:has-text("用户管理")', { timeout: 10000 })
    // Wait for search form to be ready (all tests need the search form)
    await page.waitForSelector('input[placeholder="请输入用户名"]', { timeout: 10000 })
    // Wait for search buttons to be ready in the DOM
    await page.waitForSelector('.shadow-card:has-text("用户名")', { timeout: 10000 })
    // Wait for table data to load - this ensures the page is fully ready
    await page.waitForSelector('tbody tr', { timeout: 10000 })
  })

  test('should display user management page', async ({ page }) => {
    // Check URL
    console.log('Current URL:', page.url())
    expect(page.url()).toContain('system/user')

    // Check content area
    const contentAreaInfo = await page.evaluate(() => {
      const contentArea = document.querySelector('.content-area')
      return {
        exists: !!contentArea,
        innerHTML: contentArea?.innerHTML?.substring(0, 500) || 'empty',
        childCount: contentArea?.children.length || 0,
        firstChild: contentArea?.firstElementChild?.className || 'none',
      }
    })
    console.log('Content area info:', contentAreaInfo)

    // Check all h1 elements on the page
    const h1Elements = await page.locator('h1').allTextContents()
    console.log('All h1 elements:', h1Elements)

    // Check page title
    const pageTitle = await page.title()
    console.log('Page title:', pageTitle)

    // Wait for the h1 to be visible
    await expect(page.locator('h1:has-text("用户管理")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("新增用户")')).toBeVisible()
    // Verify search form is present
    await expect(page.locator('input[placeholder="请输入用户名"]')).toBeVisible()
  })

  test('should display user table with data', async ({ page }) => {
    // Wait for table data to load
    await page.waitForSelector('tbody tr', { timeout: 10000 })

    // Verify table has data
    const rows = await page.locator('tbody tr').count()
    expect(rows).toBeGreaterThan(0)

    // Verify specific users exist
    await expect(page.locator('td:has-text("admin")').first()).toBeVisible()
    await expect(page.locator('td:has-text("张三")').first()).toBeVisible()
  })

  test('should search users by username', async ({ page }) => {
    // Wait for table to be ready
    await page.waitForSelector('input[placeholder="请输入用户名"]', { timeout: 10000 })

    // Enter search term
    await page.locator('input[placeholder="请输入用户名"]').fill('admin')

    // Click search button using JavaScript - find by text content
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const searchButton = buttons.find(btn => btn.textContent?.includes('查询'))
      if (searchButton) (searchButton as HTMLElement).click()
    })

    // Wait for results
    await page.waitForTimeout(1000)

    // Verify search result
    await expect(page.locator('td:has-text("admin")').first()).toBeVisible({ timeout: 5000 })
  })

  test('should filter users by status', async ({ page }) => {
    // Click status selector
    const statusSelect = page.locator('.ant-select-selector').filter({ hasText: '请选择状态' }).first()
    await statusSelect.click()

    // Select "启用" option
    await page.locator('.ant-select-item:has-text("启用")').first().click()
    await page.waitForTimeout(500)

    // Click search button using JavaScript
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const searchButton = buttons.find(btn => btn.textContent?.includes('查询'))
      if (searchButton) (searchButton as HTMLElement).click()
    })

    // Wait for results
    await page.waitForTimeout(1000)
  })

  test('should reset search filters', async ({ page }) => {
    // Enter search term
    await page.locator('input[placeholder="请输入用户名"]').fill('test')

    // Click reset button using JavaScript
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const resetButton = buttons.find(btn => btn.textContent?.includes('重置'))
      if (resetButton) (resetButton as HTMLElement).click()
    })

    // Wait for data refresh
    await page.waitForTimeout(2000)

    // Verify table still has data (reset refreshed the table)
    await expect(page.locator('tbody tr').first()).toBeVisible()
  })

  test('should open add user modal', async ({ page }) => {
    // Click add user button using JavaScript
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const addButton = buttons.find(btn => btn.textContent?.includes('新增用户'))
      if (addButton) (addButton as HTMLElement).click()
    })

    // Verify modal opens
    await page.waitForSelector('.ant-modal', { timeout: 5000 })
    await expect(page.locator('.ant-modal-title:has-text("新增用户")')).toBeVisible()

    // Check form fields exist
    await expect(page.locator('.ant-modal input[placeholder*="用户名"]')).toBeVisible()
    await expect(page.locator('.ant-modal input[placeholder*="昵称"]')).toBeVisible()
    await expect(page.locator('.ant-modal input[placeholder*="邮箱"]')).toBeVisible()
    await expect(page.locator('.ant-modal input[type="password"]')).toBeVisible()

    // Close modal
    await page.locator('.ant-modal-close').first().click()
    await page.waitForSelector('.ant-modal', { state: 'hidden', timeout: 5000 })
  })

  test('should open edit user modal', async ({ page }) => {
    // Click first edit button - use getByRole with more specific selector
    await page.locator('tbody tr:first-child button:has-text("编辑")').click()

    // Verify modal opens with edit title
    await page.waitForSelector('.ant-modal', { timeout: 5000 })
    await expect(page.locator('.ant-modal-title:has-text("编辑用户")')).toBeVisible()

    // Close modal
    await page.locator('.ant-modal-close').first().click()
    await page.waitForSelector('.ant-modal', { state: 'hidden', timeout: 5000 })
  })

  test('should show delete confirmation', async ({ page }) => {
    // Click delete button - target the first delete button in table body
    await page.locator('tbody tr:first-child button:has-text("删除")').click()

    // Verify confirmation modal appears
    await page.waitForSelector('.ant-modal-confirm', { timeout: 5000 })
    await expect(page.locator('.ant-modal-confirm-title:has-text("确认删除")')).toBeVisible()

    // Close confirmation (cancel) - use JavaScript to find and click the cancel button
    await page.evaluate(() => {
      const modal = document.querySelector('.ant-modal-confirm')
      if (modal) {
        const buttons = Array.from(modal.querySelectorAll('button'))
        const cancelButton = buttons.find(btn => btn.textContent?.includes('取消'))
        if (cancelButton) (cancelButton as HTMLElement).click()
      }
    })
  })

  test('should validate form fields', async ({ page }) => {
    // Open add modal using JavaScript
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      const addButton = buttons.find(btn => btn.textContent?.includes('新增用户'))
      if (addButton) (addButton as HTMLElement).click()
    })

    // Wait for modal
    await page.waitForSelector('.ant-modal', { timeout: 5000 })

    // Try to submit without filling required fields
    await page.locator('.ant-modal-footer .ant-btn-primary').first().click()

    // Wait for validation
    await page.waitForTimeout(500)

    // Check for validation errors
    const errorCount = await page.locator('.ant-form-item-explain-error').count()
    expect(errorCount).toBeGreaterThan(0)

    // Close modal
    await page.keyboard.press('Escape')
    await page.waitForSelector('.ant-modal', { state: 'hidden', timeout: 5000 })
  })
})
