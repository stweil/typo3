import { Locator, Page } from '@playwright/test';
import { Modal } from './modal';
import { expect } from 'playwright/test';

export class PageWizard {
  private static readonly CONFIRM_BUTTON_TEXT = 'Create new page';

  private static readonly FINISH_BUTTON_TEXT = 'Finish';

  constructor(private readonly page: Page) {
  }

  async createDefaultPageAfterDrag(modal: Modal, title: string) {
    await this.ensurePageWizardModalVisible(modal);
    const modalContent = await modal.getModalContent();

    const input = modalContent.locator('[data-formengine-input-name^="data[pages]"][data-formengine-input-name$="[title]"]');
    await input.fill(title);
    await input.press('Tab'); // triggeres change event

    // go to step 4 (confirmation)
    await this.gotToNextStep(modalContent);

    // go to step 5 (finish)
    await this.getButton(modalContent, PageWizard.CONFIRM_BUTTON_TEXT).click();

    // finish
    await this.getButton(modalContent,PageWizard.FINISH_BUTTON_TEXT).click();
  }

  async gotToNextStep(modalContent: Locator): Promise<void> {
    await this.getButton(modalContent, 'Next').click();
  }

  getButton(modalContent: Locator, title: string): Locator {
    return modalContent.locator(`.wizard-actions button:has-text("${title}")`);
  }

  async ensurePageWizardModalVisible(modal: Modal): Promise<void> {
    const modalContent = await modal.getModalContent();
    await expect(modalContent.locator('typo3-backend-page-wizard')).toHaveCount(1);
    await this.page.waitForLoadState('networkidle');
  }
}
