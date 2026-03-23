import { Locator, Page } from '@playwright/test';
import { Modal } from './modal';
import { expect } from 'playwright/test';

export class PageWizard {
  private static readonly CONFIRM_BUTTON_TEXT = 'Create new page';

  private static readonly FINISH_BUTTON_TEXT = 'Finish';

  constructor(private readonly page: Page) {
  }

  async createDefaultPage(modal: Modal, title: string) {
    await this.ensurePageWizardModalVisible(modal);
    const modalContent = await modal.getModalContent();

    const progress = await this.getProgressData(modalContent);

    do {
      if (progress.currentStep === 3) {
        const input = modalContent.locator('[data-formengine-input-name^="data[pages]"][data-formengine-input-name$="[title]"]');
        // fill title if element exists
        await input.fill(title);
        await input.press('Tab'); // triggeres change event
      }

      await this.gotToNextStep(modalContent);
      progress.currentStep += 1;

    } while(false === await this.isConfirmStep(modalContent));

    await this.getButton(modalContent, PageWizard.CONFIRM_BUTTON_TEXT).click();
    await this.getButton(modalContent,PageWizard.FINISH_BUTTON_TEXT).click();
  }

  async gotToNextStep(modalContent: Locator): Promise<void> {
    await this.getButton(modalContent,'Next').click();
    await this.page.waitForLoadState('networkidle');
  }

  async isConfirmStep(modalContent: Locator): Promise<boolean> {
    return (await this.getButton(modalContent, PageWizard.CONFIRM_BUTTON_TEXT).count() > 0);
  }

  getButton(modalContent: Locator, title: string): Locator {
    return modalContent.locator(`.wizard-actions button:has-text("${title}")`);
  }

  async ensurePageWizardModalVisible(modal: Modal): Promise<void> {
    const modalContent = await modal.getModalContent();
    await expect(modalContent.locator('typo3-backend-page-wizard')).toHaveCount(1);
    await this.page.waitForLoadState('networkidle');
  }

  async getProgressData(modalContent: Locator): Promise<{currentStep: number, maxSteps: number}> {
    const stepText = await modalContent.locator('typo3-backend-progress-tracker >> .tracker-step').textContent();

    const match = stepText.match(/(\d+)\s*of\s*(\d+)/);
    return {
      currentStep: Number(match[1]),
      maxSteps: Number(match[2]),
    };
  }
}
