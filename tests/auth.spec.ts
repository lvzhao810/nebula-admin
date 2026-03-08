import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/#/login')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should display login page', async ({ page }) => {
    await page.goto('/#/login')
    await expect(page).toHaveTitle(/Nebula Admin/)
    await expect(page.locator('input[placeholder*="用户名"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="密码"]')).toBeVisible()
    // Check for Nebula Admin title on login page
    await expect(page.locator('text=Nebula Admin').nth(0)).toBeVisible()
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/#/login')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // The form is pre-filled with admin/123456, just click the login button
    // The login button is the submit button
    await page.locator('button[type="submit"]').click()

    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard/, { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    // Verify we're on dashboard - check for welcome message
    await expect(page.locator('text=欢迎回来')).toBeVisible({ timeout: 10000 })
  })

  test('should login by pressing Enter on password field', async ({ page }) => {
    await page.goto('/#/login')
    await page.waitForLoadState('networkidle')

    // Press Enter on the password field to submit form
    await page.locator('input[type="password"]').press('Enter')

    // Wait for navigation
    await page.waitForURL(/.*dashboard/, { timeout: 10000 })

    // Verify dashboard loaded
    await expect(page.locator('text=欢迎回来')).toBeVisible({ timeout: 10000 })
  })

  test('should show validation errors with empty credentials', async ({ page }) => {
    await page.goto('/#/login')
    await page.waitForLoadState('networkidle')

    // Clear the pre-filled values
    await page.locator('input[placeholder*="用户名"]').clear()
    await page.locator('input[type="password"]').clear()

    // Click login button
    await page.locator('button[type="submit"]').click()

    // Check for validation errors (ant-design-vue shows them)
    await page.waitForTimeout(500)
    const hasError = await page.locator('text=请输入用户名').count() > 0
    expect(hasError).toBeTruthy()
  })

  test('should remember me functionality', async ({ page }) => {
    await page.goto('/#/login')
    await page.waitForLoadState('networkidle')

    // Check the remember me checkbox
    const checkbox = page.locator('input[type="checkbox"]')
    await checkbox.check()
    await expect(checkbox).toBeChecked()

    // Click login
    await page.locator('button[type="submit"]').click()

    // Wait for navigation
    await page.waitForURL(/.*dashboard/, { timeout: 10000 })

    // Verify token is stored with correct key
    const token = await page.evaluate(() => {
      return localStorage.getItem('nebula_token') || sessionStorage.getItem('nebula_token')
    })
    expect(token).toBeTruthy()
  })

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/#/login')
    await page.waitForLoadState('networkidle')
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/.*dashboard/, { timeout: 10000 })

    // Look for logout functionality - check header/user dropdown
    const userAvatar = page.locator('.ant-avatar, [class*="avatar"]').first()
    await userAvatar.click()
    await page.waitForTimeout(500)

    // Click logout button (text is "退出登录")
    const logoutLink = page.locator('text=退出登录').first()
    await logoutLink.click()

    // Wait for modal to appear and click confirm button
    await page.waitForSelector('.ant-modal', { timeout: 5000 })
    const confirmButton = page.locator('.ant-modal .ant-btn-primary').first()
    await confirmButton.click()

    // Should redirect to login
    await page.waitForURL(/.*login/, { timeout: 10000 })
  })
})
