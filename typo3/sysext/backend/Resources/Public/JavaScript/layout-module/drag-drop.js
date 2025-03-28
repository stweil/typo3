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
import DocumentService from"@typo3/core/document-service.js";import DataHandler from"@typo3/backend/ajax-data-handler.js";import Icons from"@typo3/backend/icons.js";import RegularEvent from"@typo3/core/event/regular-event.js";import{DataTransferTypes}from"@typo3/backend/enum/data-transfer-types.js";import BroadcastService from"@typo3/backend/broadcast-service.js";import{BroadcastMessage}from"@typo3/backend/broadcast-message.js";import DragDropUtility from"@typo3/backend/utility/drag-drop-utility.js";var Identifiers,Classes;!function(e){e.content=".t3js-page-ce",e.draggableContentHandle='.t3js-page-ce-header[draggable="true"]',e.dropZone=".t3js-page-ce-dropzone-available",e.column=".t3js-page-column",e.addContent=".t3js-page-new-ce"}(Identifiers||(Identifiers={})),function(e){e.validDropZoneClass="active",e.dropPossibleHoverClass="t3-page-ce-dropzone-possible"}(Classes||(Classes={}));class DragDrop{constructor(){DocumentService.ready().then((()=>{this.initialize()}))}initialize(){new RegularEvent("mousedown",((e,t)=>{const a=e.target.closest("a,img");null===a||t.contains(a)})).delegateTo(document,Identifiers.draggableContentHandle),new RegularEvent("dragstart",this.onDragStart.bind(this)).delegateTo(document,Identifiers.draggableContentHandle),new RegularEvent("dragenter",this.onDragEnter.bind(this)).delegateTo(document,Identifiers.draggableContentHandle),new RegularEvent("dragend",this.onDragEnd.bind(this)).delegateTo(document,Identifiers.draggableContentHandle),new RegularEvent("dragenter",((e,t)=>{t.classList.add(Classes.dropPossibleHoverClass),DragDropUtility.updateEventAndTooltipToReflectCopyMoveIntention(e)})).delegateTo(document,Identifiers.dropZone),new RegularEvent("dragover",(e=>{e.preventDefault(),DragDropUtility.updateEventAndTooltipToReflectCopyMoveIntention(e)})).delegateTo(document,Identifiers.dropZone),new RegularEvent("dragleave",((e,t)=>{e.preventDefault(),t.classList.remove(Classes.dropPossibleHoverClass)})).delegateTo(document,Identifiers.dropZone),new RegularEvent("drop",this.onDrop.bind(this),{capture:!0,passive:!0}).delegateTo(document,Identifiers.dropZone),new RegularEvent("typo3:page-layout-drag-drop:elementChanged",this.onBroadcastElementChanged.bind(this)).bindTo(top.document)}onDragEnter(e){e.preventDefault(),DragDropUtility.updateEventAndTooltipToReflectCopyMoveIntention(e),this.showDropZones()}onDragStart(e,t){const a=t.closest(Identifiers.content);e.dataTransfer.setData(DataTransferTypes.content,JSON.stringify({pid:this.getCurrentPageId(),uid:parseInt(a.dataset.uid,10),language:parseInt(a.dataset.languageUid,10),content:a.outerHTML,moveElementUrl:a.dataset.moveElementUrl}));const n=this.getDragTooltipMetadataFromContentElement(a);e.dataTransfer.setData(DataTransferTypes.dragTooltip,JSON.stringify(n)),e.dataTransfer.effectAllowed="copyMove",DragDropUtility.updateEventAndTooltipToReflectCopyMoveIntention(e),a.querySelector(Identifiers.dropZone).hidden=!0}onDragEnd(){this.hideDropZones()}onDrop(e,t){let a;if(t.classList.remove(Classes.dropPossibleHoverClass),!e.dataTransfer.types.includes(DataTransferTypes.content))return;const n=this.getColumnPositionForElement(t),o=JSON.parse(e.dataTransfer.getData(DataTransferTypes.content));if(a=document.querySelector(`${Identifiers.content}[data-uid="${o.uid}"]`),a||(a=document.createRange().createContextualFragment(o.content).firstElementChild),"number"==typeof o.uid&&o.uid>0){const r={},s=t.closest(Identifiers.content).dataset.uid;let i;i=void 0===s?parseInt(t.closest("[data-page]").dataset.page,10):0-parseInt(s,10);let d=o.language;-1!==d&&(d=parseInt(t.closest("[data-language-uid]").dataset.languageUid,10));let l=0;0!==i&&(l=n);const c=DragDropUtility.isCopyModifierFromEvent(e)||t.classList.contains("t3js-paste-copy"),p=c?"copy":"move";r.cmd={tt_content:{[o.uid]:{[p]:{action:"paste",target:i,update:{colPos:l,sys_language_uid:d}}}}},this.ajaxAction(r,c).then((()=>{t.parentElement.classList.contains(Identifiers.content.substring(1))?t.closest(Identifiers.content).after(a):t.closest(Identifiers.dropZone).after(a),this.broadcast("elementChanged",{pid:o.pid,uid:o.uid,targetPid:this.getCurrentPageId(),action:c?"copy":"move"});const e=document.querySelector(`.t3-page-column-lang-name[data-language-uid="${d}"]`);if(null===e)return;const n=e.dataset.flagIdentifier,r=e.dataset.languageTitle;Icons.getIcon(n,Icons.sizes.small).then((e=>{const t=a.querySelector(".t3js-flag");t.title=r,t.innerHTML=e}))}))}}onBroadcastElementChanged(e){e.detail.payload.pid===this.getCurrentPageId()&&e.detail.payload.targetPid!==e.detail.payload.pid&&"move"===e.detail.payload.action&&document.querySelector(`${Identifiers.content}[data-uid="${e.detail.payload.uid}"]`).remove()}ajaxAction(e,t){const a=Object.keys(e.cmd).shift(),n=parseInt(Object.keys(e.cmd[a]).shift(),10),o={component:"dragdrop",action:t?"copy":"move",table:a,uid:n},r=document.querySelector(".t3-grid-container");return DataHandler.process(e,o).then((e=>{if(e.hasErrors)throw e.messages;(t||"1"===r?.dataset.defaultLanguageBinding)&&self.location.reload()}))}getColumnPositionForElement(e){const t=e.closest("[data-colpos]");return null!==t&&void 0!==t.dataset.colpos&&parseInt(t.dataset.colpos,10)}getDragTooltipMetadataFromContentElement(e){let t,a;const n=[],o=e.querySelector(".t3-page-ce-header-title").innerText,r=e.querySelector(".element-preview");r&&(t=r.innerText,t.length>80&&(t=t.substring(0,80)+"..."));const s=e.querySelector(".t3js-icon");s&&(a=s.dataset.identifier);const i=e.querySelectorAll(".preview-thumbnails-element-image img");return i.length>0&&i.forEach((e=>{n.push({src:e.src,height:e.height,width:e.width})})),{statusIconIdentifier:"actions-move",tooltipIconIdentifier:a,tooltipLabel:o,tooltipDescription:t,thumbnails:n}}getCurrentPageId(){return parseInt(document.querySelector("[data-page]").dataset.page,10)}broadcast(e,t){BroadcastService.post(new BroadcastMessage("page-layout-drag-drop",e,t||{}))}showDropZones(){document.querySelectorAll(Identifiers.dropZone).forEach((e=>{e.hidden=!1;const t=e.parentElement.querySelector(Identifiers.addContent);null!==t&&(t.hidden=!0,e.classList.add(Classes.validDropZoneClass))}))}hideDropZones(){document.querySelectorAll(Identifiers.dropZone).forEach((e=>{e.hidden=!0;const t=e.parentElement.querySelector(Identifiers.addContent);null!==t&&(t.hidden=!1),e.classList.remove(Classes.validDropZoneClass)}))}}export default new DragDrop;