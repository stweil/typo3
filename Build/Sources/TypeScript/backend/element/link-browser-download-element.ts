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

import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('typo3-backend-link-browser-download')
export class LinkBrowserDownloadElement extends LitElement {
  @property({ type: String }) value: string = '';

  @state() private checked: boolean = false;
  @state() private filename: string = '';

  override connectedCallback(): void {
    super.connectedCallback();
    this.checked = this.value !== '';
    this.filename = (this.value !== '' && this.value !== 'true') ? this.value : '';
  }

  protected override createRenderRoot(): HTMLElement | ShadowRoot {
    return this;
  }

  protected override render(): unknown {
    return html`
      <input type="hidden" name="ldownload" .value=${this.computeValue()} />
      <div class="form-check">
        <input
          type="checkbox"
          class="form-check-input"
          id="ldownload-checkbox"
          .checked=${this.checked}
          @change=${this.handleCheckboxChange}
        />
        <label class="form-check-label" for="ldownload-checkbox">
          ${this.getAttribute('label-download') ?? 'Force download'}
        </label>
      </div>
      ${this.checked ? html`
        <div class="mt-2">
          <label for="ldownload-filename" class="form-label">
            ${this.getAttribute('label-filename') ?? 'Custom filename'}
          </label>
          <input
            id="ldownload-filename"
            type="text"
            class="form-control"
            .value=${this.filename}
            @input=${this.handleFilenameInput}
          />
        </div>
      ` : nothing}
    `;
  }

  private computeValue(): string {
    if (!this.checked) {
      return '';
    }
    return this.filename !== '' ? this.filename : 'true';
  }

  private handleCheckboxChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
  }

  private handleFilenameInput(event: Event): void {
    this.filename = (event.target as HTMLInputElement).value;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'typo3-backend-link-browser-download': LinkBrowserDownloadElement;
  }
}
