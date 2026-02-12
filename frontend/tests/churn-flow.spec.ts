import { test, expect } from '@playwright/test';

test('User can calculate churn risk', async ({ page }) => {
  // 1. Go to your local app (or production URL)
  await page.goto('/');

  // 2. Fill out the form
  await page.getByTestId('tenure-input').fill('12');
  await page.getByTestId('monthly-charges-input').fill('50');
  await page.getByTestId('total-charges-input').fill('600');

  const contractDropdown = page.getByRole('button', { name: 'Contract' });
  await contractDropdown.click();
  await page.getByRole('option', { name: 'One Year'}).click();

  // 3. Click the Predict Button
  await page.getByRole('button', { name: 'Predict' }).click();

  // 4. Check the Result
  const result = page.locator('p', { hasText: 'Probability:' });
  await expect(result).toBeVisible({ timeout: 60000 });
});