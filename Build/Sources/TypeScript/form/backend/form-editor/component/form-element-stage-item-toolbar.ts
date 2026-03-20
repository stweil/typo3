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

import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import labels from '~labels/form.form_editor_javascript';
import '@typo3/backend/element/icon-element';

/**
 * Module: @typo3/form/backend/form-editor/component/form-element-stage-item-toolbar
 *
 * Standalone toolbar web component form element stage templates.
 *
 * Dispatches (bubbling):
 *   - toolbar-new-element-after
 *   - toolbar-new-element-inside  (composite elements only)
 *   - toolbar-remove-element
 */
@customElement('typo3-form-form-element-stage-item-toolbar')
export class FormElementStageItemToolbar extends LitElement {
  /**
   * Whether this element belongs to a composite form element (GridRow, Fieldset …).
   */
  @property({ type: Boolean, attribute: 'is-composite' })
  isComposite: boolean = false;

  /**
   * Whether the toolbar is currently visible.  Controlled by the stage component
   */
  @property({ type: Boolean, reflect: true })
  active: boolean = false;

  protected override createRenderRoot(): HTMLElement | ShadowRoot {
    return this;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.active) {
      return nothing;
    }
    return html`
      <div class="formeditor-element-toolbar">
        <div class="btn-toolbar">
          ${this.isComposite ? this.renderCompositeNewElementButton() : this.renderSimpleNewElementButton()}
          <div class="btn-group btn-group-sm" role="group">
            <a
              class="btn btn-default"
              href="#"
              title="${labels.get('formEditor.stage.toolbar.remove')}"
              @click="${this.handleRemoveElement}">
              <typo3-backend-icon identifier="actions-edit-delete" size="small"></typo3-backend-icon>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  private renderSimpleNewElementButton(): TemplateResult {
    return html`
      <div class="btn-group btn-group-sm" role="group">
        <a
          class="btn btn-default"
          href="#"
          title="${labels.get('formEditor.stage.toolbar.new_element')}"
          @click="${this.handleNewElementAfter}">
          <typo3-backend-icon identifier="actions-document-new" size="small"></typo3-backend-icon>
        </a>
      </div>
    `;
  }

  private renderCompositeNewElementButton(): TemplateResult {
    return html`
      <div class="btn-group btn-group-sm" role="group">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-sm btn-default dropdown-toggle"
            popovertarget="toggle-menu-new-form-element-stage-item-toolbar"
            aria-expanded="false"
            title="${labels.get('formEditor.stage.toolbar.new_element')}">
            <typo3-backend-icon identifier="actions-document-new" size="small"></typo3-backend-icon>
            <span class="visually-hidden">Toggle Dropdown</span>
          </button>
          <ul id="toggle-menu-new-form-element-stage-item-toolbar" class="dropdown-menu dropdown-menu-right" popover>
            <li data-no-sorting>
              <a href="#" class="dropdown-item" @click="${this.handleNewElementInside}">
                <span class="dropdown-item-columns">
                  <span class="dropdown-item-column dropdown-item-column-icon">
                    <typo3-backend-icon identifier="actions-form-insert-in" size="small"></typo3-backend-icon>
                  </span>
                  <span class="dropdown-item-column dropdown-item-column-text">
                    ${labels.get('formEditor.stage.toolbar.new_element.inside')}
                  </span>
                </span>
              </a>
            </li>
            <li data-no-sorting>
              <a href="#" class="dropdown-item" @click="${this.handleNewElementAfter}">
                <span class="dropdown-item-columns">
                  <span class="dropdown-item-column dropdown-item-column-icon">
                    <typo3-backend-icon identifier="actions-form-insert-after" size="small"></typo3-backend-icon>
                  </span>
                  <span class="dropdown-item-column dropdown-item-column-text">
                    ${labels.get('formEditor.stage.toolbar.new_element.after')}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }

  private handleNewElementAfter(event: Event): void {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('toolbar-new-element-after', { bubbles: true, composed: true }));
  }

  private handleNewElementInside(event: Event): void {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('toolbar-new-element-inside', { bubbles: true, composed: true }));
  }

  private handleRemoveElement(event: Event): void {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('toolbar-remove-element', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'typo3-form-form-element-stage-item-toolbar': FormElementStageItemToolbar;
  }
}
