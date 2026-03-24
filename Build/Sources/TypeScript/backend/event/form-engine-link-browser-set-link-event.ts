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

export interface OnFieldChangeItem {
  name: string;
  data: {[key: string]: string|number|boolean|null}
}

export class FormEngineLinkBrowserSetLinkEvent extends Event {
  static readonly eventName = 'typo3:form-engine:link-browser:set-link';

  constructor(
    public readonly value: string,
    public readonly onFieldChangeItems: OnFieldChangeItem[]|null,
  ) {
    super(FormEngineLinkBrowserSetLinkEvent.eventName, { bubbles: true, composed: true, cancelable: false });
  }
}

declare global {
  interface HTMLElementEventMap {
    [FormEngineLinkBrowserSetLinkEvent.eventName]: FormEngineLinkBrowserSetLinkEvent;
  }
}
