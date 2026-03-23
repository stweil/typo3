import type { WizardStepInterface } from '@typo3/backend/wizard/steps/wizard-step-interface';
import AjaxRequest from '@typo3/core/ajax/ajax-request';
import type { AjaxResponse } from '@typo3/core/ajax/ajax-response';

type WizardConfiguration = {
  steps: {
    module: string;
    configurationData?: {
      html?: string;
      key: string;
      title: string;
    }[];
  }[];
};

export function loadDynamicSteps(wizardType: string, context: any): Promise<WizardStepInterface[]> {
  return new AjaxRequest(TYPO3.settings.ajaxUrls.wizard_config).withQueryArguments({ mode: wizardType, data: context.getDataStore() }).get()
    .then((response: AjaxResponse) => response.resolve())
    .then(async (config: WizardConfiguration ) => {
      return await Promise.all(config.steps.map(async (step) =>{
        if (!step.module) {
          throw new Error('Step data does not contain a module path');
        }

        const module = await import(step.module);
        const StepClass = module.default as { new(): WizardStepInterface };

        if (!StepClass) {
          throw new Error(`Step module ${step.module} does not export a default class`);
        }

        const stepInstance = new StepClass();
        Object.assign(stepInstance, {
          context: context,
          ...step.configurationData
        });

        return stepInstance;
      }));
    });
}
