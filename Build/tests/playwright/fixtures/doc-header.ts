import { expect, Locator, Page } from '@playwright/test';

export class DocHeader {
  private readonly page: Page;
  private container: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = this.page.frameLocator('#typo3-contentIframe').locator('.t3js-module-docheader-buttons');
  }

  setContainerLocator(locator: Locator): void {
    this.container = locator;
  }

  async selectInDropDown(triggerName: string, option: string): Promise<void> {
    const triggerButton = this.container.getByRole('button', { name: triggerName });
    const dropdownMenu = this.container.locator('.dropdown-menu:popover-open');

    // Click and retry until popover opens (JS may not be ready on first click)
    await expect(async () => {
      await triggerButton.click();
      await expect(dropdownMenu).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10000 });

    // Select dropdown item using title attribute for precise matching
    // Use force:true since we've verified visibility and the element can detach during navigation
    const optionButton = dropdownMenu.locator(`.dropdown-item[title="${option}"]`);
    await expect(optionButton).toBeVisible();
    await optionButton.click({ force: true });

    // Wait for the trigger button to be stable/enabled again
    await expect(triggerButton).toBeEnabled();
  }

  async selectItemInDropDownByIndex(triggerName: string | RegExp, index: number = 0): Promise<void> {
    const triggerButton = this.container.getByRole('button', { name: triggerName });
    const dropdownMenu = this.container.locator('.dropdown-menu:popover-open');

    // Click and retry until popover opens (JS may not be ready on first click)
    await expect(async () => {
      await triggerButton.click();
      await expect(dropdownMenu).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10000 });

    // Select dropdown item
    const optionButton = dropdownMenu.locator('.dropdown-item').nth(index);
    await expect(optionButton).toBeVisible();
    await optionButton.click({ force: true });

    // Wait for the trigger button to be stable/enabled again
    await expect(triggerButton).toBeEnabled();
  }

  async countItemsInDropDown(triggerName: string | RegExp): Promise<number> {
    const triggerButton = this.container.getByRole('button', { name: triggerName });
    const dropdownMenu = this.container.locator('.dropdown-menu:popover-open');

    // Click and retry until popover opens (JS may not be ready on first click)
    await expect(async () => {
      await triggerButton.click();
      await expect(dropdownMenu).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 10000 });

    // Count dropdown items
    const count = await dropdownMenu.locator('.dropdown-item').count();

    // Close dropdown again to be in a stable state
    await triggerButton.click();
    // Wait for the trigger button to be stable/enabled again
    await expect(triggerButton).toBeEnabled();

    return count;
  }
}
