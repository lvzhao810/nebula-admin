import { test, expect } from '@playwright/test'

// Helper function to login
async function login(page: any) {
  await page.goto('/#/login')
  await page.waitForLoadState('networkidle')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/.*dashboard/, { timeout: 10000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Navigation', () => {
  test('should display sidebar menu', async ({ page }) => {
    await login(page)

    // Check for sidebar/menu
    const sidebar = page.locator('.ant-layout-sider, [class*="sidebar"], [class*="menu"]').first()
    await expect(sidebar).toBeVisible()
  })

  test('should navigate to dashboard', async ({ page }) => {
    await login(page)

    // Click on dashboard menu item - use custom menu selector
    const dashboardLink = page.locator('.menu-item:has-text("数据概览"), .menu-title:has-text("数据概览")').first()
    await dashboardLink.click()
    await page.waitForTimeout(1000)

    // Verify URL and content
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('text=欢迎回来').first()).toBeVisible()
  })

  test('should navigate to user management', async ({ page }) => {
    await login(page)

    // Navigate using direct URL
    await page.goto('/#/system/user')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Verify content
    await expect(page.locator('text=用户管理').first()).toBeVisible()
  })

  test('should navigate to role management', async ({ page }) => {
    await login(page)

    // Navigate using direct URL
    await page.goto('/#/system/role')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Verify content
    await expect(page.locator('text=角色管理').first()).toBeVisible()
  })

  test('should navigate to menu management', async ({ page }) => {
    await login(page)

    // Navigate using direct URL
    await page.goto('/#/system/menu')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    // Verify content
    await expect(page.locator('text=菜单管理').first()).toBeVisible()
  })

  test('should display header with user info', async ({ page }) => {
    await login(page)

    // Check for header
    const header = page.locator('.ant-layout-header, [class*="header"]').first()
    await expect(header).toBeVisible()

    // Check for user avatar
    const userAvatar = page.locator('.ant-avatar, [class*="avatar"]').first()
    await expect(userAvatar).toBeVisible()
  })

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Clear storage
    await page.goto('/#/login')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })

    // Try to access protected route
    await page.goto('/#/system/user')

    // Wait for redirect
    await page.waitForTimeout(2000)

    // Should redirect to login
    const currentUrl = page.url()
    const isLoginPage = currentUrl.includes('login') || await page.locator('text=登录, 请输入用户名').count() > 0
    expect(isLoginPage).toBeTruthy()
  })

  test('should handle non-existent route', async ({ page }) => {
    await login(page)

    // Navigate to non-existent route
    await page.goto('/#/non-existent-route')
    await page.waitForTimeout(2000)

    // Check the page content - might be 404 or might redirect to dashboard
    const pageContent = await page.textContent('body')
    const has404Text = pageContent?.includes('404') || pageContent?.includes('页面不存在') || pageContent?.includes('NotFound')
    // If there's no 404, the router might have redirected to dashboard, which is also acceptable behavior
    expect(has404Text || page.url().includes('dashboard')).toBeTruthy()
  })
})
