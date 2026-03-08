import { test, expect } from '@playwright/test'

// Helper function to login
async function login(page: any) {
  await page.goto('/#/login')
  await page.waitForLoadState('networkidle')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/.*dashboard/, { timeout: 10000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Component Library', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/#/components/table/pro-table')
    await page.waitForURL(/.*components/, { timeout: 10000 })
    await page.waitForLoadState('networkidle')
  })

  test('should display component library page with sidebar', async ({ page }) => {
    await expect(page.locator('.component-library-layout')).toBeVisible()
    await expect(page.locator('.component-library-layout .sider')).toBeVisible()
    await expect(page.locator('.component-library-layout .logo-text')).toContainText('组件库')
  })

  test('should display component categories in sidebar', async ({ page }) => {
    await expect(page.locator('.nav-menu')).toBeVisible()
    await expect(page.locator('.ant-menu-submenu-title').filter({ hasText: '表格' })).toBeVisible()

    const menuItems = await page.locator('.ant-menu-item').count()
    expect(menuItems).toBeGreaterThan(0)
  })

  test('should display component detail page', async ({ page }) => {
    await expect(page.locator('.component-detail-layout')).toBeVisible()
    await expect(page.locator('.component-detail-layout .breadcrumb')).toBeVisible()
    await expect(page.locator('.page-title')).toBeVisible()
    await expect(page.locator('.demo-card')).toBeVisible()
  })

  test('should navigate between components', async ({ page }) => {
    await page.goto('/#/components/table/editable-table')
    await page.waitForURL(/.*editable-table/, { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('editable-table')
    await expect(page.locator('.page-title')).toContainText('EditableTable')
  })

  test('should navigate to form components', async ({ page }) => {
    await page.goto('/#/components/form/form-modal')
    await page.waitForURL(/.*components\/form/, { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    expect(page.url()).toContain('components/form')
    await expect(page.locator('.page-title')).toContainText('FormModal')
  })

  test('should display code viewer component', async ({ page }) => {
    await expect(page.locator('.code-viewer')).toBeVisible()
    await expect(page.locator('.code-header')).toBeVisible()
    await expect(page.locator('.code-content')).toBeVisible()
  })
})
