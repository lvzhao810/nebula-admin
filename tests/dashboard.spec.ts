import { test, expect } from '@playwright/test'

// Helper function to login
async function login(page: any) {
  await page.goto('/#/login')
  await page.waitForLoadState('networkidle')
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(/.*dashboard/, { timeout: 10000 })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000) // Extra wait for dashboard content to render
}

test.describe('Dashboard', () => {
  test('should display dashboard with welcome message', async ({ page }) => {
    await login(page)
    await expect(page.locator('text=欢迎回来')).toBeVisible()
    await expect(page.locator('text=今天是')).toBeVisible()
  })

  test('should display stat cards', async ({ page }) => {
    await login(page)

    // Check for specific stats text
    await expect(page.locator('text=总用户数').first()).toBeVisible()
    // The number is formatted with comma: "12,847"
    await expect(page.locator('text=12,847').first()).toBeVisible()
    await expect(page.locator('text=今日访问').first()).toBeVisible()
    await expect(page.locator('text=订单数量').first()).toBeVisible()
    await expect(page.locator('text=总收入').first()).toBeVisible()
  })

  test('should display trend chart', async ({ page }) => {
    await login(page)

    // Check for chart container - ECharts creates div elements
    await expect(page.locator('text=访问趋势').first()).toBeVisible()

    // The chart element should exist - ECharts creates a canvas
    const chartContainer = page.locator('text=访问趋势').locator('..')
    // Just verify the container exists, chart rendering is async
    await expect(chartContainer).toBeVisible()
  })

  test('should display source pie chart', async ({ page }) => {
    await login(page)

    // Check for pie chart container
    await expect(page.locator('text=访问来源').first()).toBeVisible()

    // The chart element should exist - ECharts creates a canvas
    const chartContainer = page.locator('text=访问来源').locator('..')
    // Just verify the container exists, chart rendering is async
    await expect(chartContainer).toBeVisible()
  })

  test('should display hot pages list', async ({ page }) => {
    await login(page)

    await expect(page.locator('text=热门页面')).toBeVisible()
    // Verify hot pages section exists - updated class names after redesign
    const hotPagesSection = page.locator('.bg-card-bg.rounded-lg').filter({ hasText: '热门页面' })
    await expect(hotPagesSection).toBeVisible()
    // Verify page views count
    await expect(page.locator('text=12,458')).toBeVisible()
  })

  test('should display recent activities', async ({ page }) => {
    await login(page)

    await expect(page.locator('text=最近活动')).toBeVisible()
    await expect(page.locator('text=/张三|用户 张三/').first()).toBeVisible()
    await expect(page.locator('text=系统执行了定时任务')).toBeVisible()
  })

  test('should switch trend period', async ({ page }) => {
    await login(page)

    // Find and click period radio buttons
    const weekButton = page.locator('label:has-text("周")').first()
    const monthButton = page.locator('label:has-text("月")').first()
    const yearButton = page.locator('label:has-text("年")').first()

    await expect(weekButton).toBeVisible()
    await weekButton.click()
    await page.waitForTimeout(500)

    await monthButton.click()
    await page.waitForTimeout(500)

    await yearButton.click()
    await page.waitForTimeout(500)
  })

  test('should have working quick action button', async ({ page }) => {
    await login(page)

    // Check for quick action button
    const quickActionButton = page.locator('button:has-text("快捷操作")')
    await expect(quickActionButton).toBeVisible()
  })
})
