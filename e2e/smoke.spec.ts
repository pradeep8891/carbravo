import { expect, test } from '@playwright/test'

test('foundation app loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /architecture skeleton is ready/i })).toBeVisible()
})
