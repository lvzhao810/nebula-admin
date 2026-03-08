import { test, expect } from '@playwright/test'

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/')
    await page.fill('input[placeholder*="用户名"]', 'admin')
    await page.fill('input[placeholder*="密码"]', '123456')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')
  })

  test('should display theme switcher in header', async ({ page }) => {
    // Check for moon emoji (dark mode toggle in light mode)
    const themeToggle = page.locator('text=🌙').or(page.locator('text=☀️')).first()
    await expect(themeToggle).toBeVisible()

    // Check for theme color selector (the small color block)
    const colorBlock = page.locator('div[style*="linear-gradient"]').first()
    await expect(colorBlock).toBeVisible()
  })

  test('should toggle dark/light mode', async ({ page }) => {
    // Initial state should be light mode with moon icon
    await expect(page.locator('text=🌙').first()).toBeVisible()

    // Click to toggle to dark mode
    await page.locator('text=🌙').first().click()

    // Wait for transition
    await page.waitForTimeout(500)

    // Now sun icon should be visible (in dark mode)
    await expect(page.locator('text=☀️').first()).toBeVisible()

    // Toggle back to light mode
    await page.locator('text=☀️').first().click()

    // Wait for transition
    await page.waitForTimeout(500)

    // Moon icon should be visible again
    await expect(page.locator('text=🌙').first()).toBeVisible()
  })

  test('should open theme style selector', async ({ page }) => {
    // Click on the theme color block
    await page.locator('div[style*="linear-gradient"]').first().click()

    // Wait for dropdown
    await page.waitForTimeout(300)

    // Theme menu should appear with 6 theme options
    const themeMenu = page.locator('.ant-dropdown').filter({ hasText: '主题风格' })
    await expect(themeMenu).toBeVisible()

    // Check for all theme names
    await expect(page.locator('text=星云紫').first()).toBeVisible()
    await expect(page.locator('text=海洋蓝').first()).toBeVisible()
    await expect(page.locator('text=森林绿').first()).toBeVisible()
    await expect(page.locator('text=夕阳橙').first()).toBeVisible()
    await expect(page.locator('text=樱花粉').first()).toBeVisible()
    await expect(page.locator('text=午夜蓝').first()).toBeVisible()
  })

  test('should switch theme style', async ({ page }) => {
    // Open theme selector
    await page.locator('div[style*="linear-gradient"]').first().click()
    await page.waitForTimeout(300)

    // Click on "海洋蓝" (Ocean) theme
    await page.locator('text=海洋蓝').first().click()

    // Wait for theme to apply
    await page.waitForTimeout(500)

    // Check that the color block has changed (has ocean colors)
    const colorBlock = page.locator('div[style*="linear-gradient"]').first()
    await expect(colorBlock).toHaveAttribute('style', /rgb\(14, 165, 233\).*rgb\(6, 182, 212\)/)
  })

  test('should persist theme across page reloads', async ({ page }) => {
    // Switch to dark mode
    await page.locator('text=🌙').first().click()
    await page.waitForTimeout(500)

    // Reload page
    await page.reload()
    await page.waitForURL('**/dashboard')

    // Should still be in dark mode (sun icon visible)
    await expect(page.locator('text=☀️').first()).toBeVisible()

    // Switch back to light mode
    await page.locator('text=☀️').first().click()
    await page.waitForTimeout(500)

    // Reload again
    await page.reload()
    await page.waitForURL('**/dashboard')

    // Should be back in light mode (moon icon visible)
    await expect(page.locator('text=🌙').first()).toBeVisible()
  })

  test('should change theme in dark mode', async ({ page }) => {
    // Switch to dark mode first
    await page.locator('text=🌙').first().click()
    await page.waitForTimeout(500)

    // Open theme selector
    await page.locator('div[style*="linear-gradient"]').first().click()
    await page.waitForTimeout(300)

    // Dark mode should show different color options
    // Click on "森林绿" (Forest) theme
    await page.locator('text=森林绿').first().click()

    // Wait for theme to apply
    await page.waitForTimeout(500)

    // Check that the color block has changed (has forest dark colors)
    const colorBlock = page.locator('div[style*="linear-gradient"]').first()
    await expect(colorBlock).toHaveAttribute('style', /rgb\(16, 185, 129\).*rgb\(52, 211, 153\)/)
  })

  test('should apply theme to CSS variables', async ({ page }) => {
    // Get the initial CSS variable value
    const initialPrimary = await page.locator('html').evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--theme-primary')
    })
    expect(initialPrimary.trim()).toBe('#7c3aed') // nebula default (updated after redesign)

    // Switch to ocean theme
    await page.locator('div[style*="linear-gradient"]').first().click()
    await page.waitForTimeout(300)
    await page.locator('text=海洋蓝').first().click()
    await page.waitForTimeout(500)

    // Check that CSS variable changed
    const newPrimary = await page.locator('html').evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--theme-primary')
    })
    expect(newPrimary.trim()).toBe('#0ea5e9') // ocean primary
  })
})
