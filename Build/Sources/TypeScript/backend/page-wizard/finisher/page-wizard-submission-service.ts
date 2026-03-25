/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

import type { SubmissionServiceInterface } from '@typo3/backend/wizard/finisher/submission-service-interface';
import AjaxRequest from '@typo3/core/ajax/ajax-request';
import type { FinisherResult } from '@typo3/backend/wizard/finisher/finisher-result';
import type { PageWizardContext } from '@typo3/backend/page-wizard/page-wizard';

export class PageWizardSubmissionService implements SubmissionServiceInterface {

  constructor(private readonly context: PageWizardContext) {
  }

  async execute(): Promise<FinisherResult> {
    const { fields, ...storeData } = this.context.getDataStore();
    const payload = Object.assign(
      {},
      storeData,
      // flatten fields
      ...Object.values(fields || {}),
    );

    const response = await new AjaxRequest(TYPO3.settings.ajaxUrls.wizard_submit)
      .withQueryArguments({ mode: 'page_wizard' })
      .post(payload);

    const result: FinisherResult = await response.resolve();
    document.dispatchEvent(new CustomEvent('typo3:pagetree:refresh'));

    return result;
  }
}
