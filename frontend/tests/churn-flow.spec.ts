import { test, expect } from '@playwright/test';

test('User can calculate churn risk', async ({ page }) => {
  // 1. Go to your local app (or production URL)
  await page.goto('/');

  // 2. Fill out the form
  await page.getByTestId('tenure-input').fill('12');
  await page.getByTestId('monthly-charges-input').fill('50');
  await page.getByTestId('total-charges-input').fill('600');

  await page.getByRole('combobox').selectOption('0');

  // 3. Click the Predict Button
  await page.getByRole('button').click();

  // 4. Check if the Loading Spinner appears (Optional)
  await expect(page.getByText(/Waking up the AI model.../)).toBeVisible();

  // 5. Check the Result
  const result = page.locator('p', { hasText: 'Probability:' });
  await expect(result).toBeVisible({ timeout: 60000 });
});