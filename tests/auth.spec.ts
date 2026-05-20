import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  // Disable global E2E bypass headers for this file to test the redirection flow
  test.use({ extraHTTPHeaders: {} })

  test('should redirect unauthenticated users to login page', async ({ page }) => {
    // Navigate to a protected route (home)
    await page.goto('/')

    // Should be redirected to /login
    await expect(page).toHaveURL(/\/login/)
    
    // Check if login page content is present
    await expect(page.getByRole('heading', { name: 'Bienvenido' })).toBeVisible()
  })

  test('should allow access to public auth routes', async ({ page }) => {
    // /auth/callback should be public (handled by middleware)
    // We just check if it doesn't redirect to /login immediately
    await page.goto('/auth/callback?code=test')
    
    // It might redirect elsewhere or show an error, but it shouldn't be /login
    expect(page.url()).not.toContain('/login')
  })
})

