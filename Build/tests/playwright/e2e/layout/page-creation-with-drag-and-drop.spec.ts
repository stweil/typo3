import { test, expect } from '../../fixtures/setup-fixtures';

test.beforeEach( async ({ page }) => {
  await page.goto('module/web/layout');
});

test('Drag and drop new page in node without children opens page wizard in modal in with skipped steps', async ({ backend, page }) => {
  await backend.pageTree.dragNewPageTo(await backend.pageTree.root, 1);

  const modal = page.locator('typo3-backend-modal > dialog');
  await expect(modal).toBeVisible({ timeout: 5000 });
  await expect(modal).toContainText('Create new page');
  await expect(modal.locator('#tracker-details')).toHaveText('Step 3 of 5');

  // @todo Implement full wizard flow
});
