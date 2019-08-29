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
var __extends=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])};return function(t,i){function n(){this.constructor=t}e(t,i),t.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}}();define(["require","exports","TYPO3/CMS/Backend/Enum/Severity","jquery","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Utility","./Workspaces","twbs/bootstrap-slider"],function(e,t,i,n,s,o,a){"use strict";var r;return function(e){e.topbar="#typo3-topbar",e.workspacePanel=".workspace-panel",e.liveView="#live-view",e.workspaceTabs='.t3js-workspace-tabs [data-toggle="tab"]',e.workspaceActions=".t3js-workspace-actions",e.stageSlider="#workspace-stage-slider",e.workspaceView="#workspace-view",e.workspaceList="#workspace-list",e.sendToStageAction='[data-action="send-to-stage"]',e.discardAction='[data-action="discard"]',e.stageButtonsContainer=".t3js-stage-buttons",e.previewModeContainer=".t3js-preview-mode",e.activePreviewMode=".t3js-active-preview-mode",e.workspacePreview=".t3js-workspace-preview"}(r||(r={})),new(function(e){function t(){var t=e.call(this)||this;return t.currentSlidePosition=100,t.elements={},t.updateSlidePosition=function(e){t.currentSlidePosition=e.value.newValue,t.resizeViews()},t.renderDiscardWindow=function(){var e=s.confirm(TYPO3.lang["window.discardAll.title"],TYPO3.lang["window.discardAll.message"],i.SeverityEnum.warning,[{text:TYPO3.lang.cancel,active:!0,btnClass:"btn-default",name:"cancel",trigger:function(){e.modal("hide")}},{text:TYPO3.lang.ok,btnClass:"btn-warning",name:"ok"}]);e.on("button.clicked",function(i){"ok"===i.target.name&&t.sendRemoteRequest([t.generateRemoteActionsPayload("discardStagesFromPage",[TYPO3.settings.Workspaces.id]),t.generateRemoteActionsPayload("updateStageChangeButtons",[TYPO3.settings.Workspaces.id])]).done(function(i){e.modal("hide"),t.renderStageButtons(i[1].result),t.elements.$workspaceView.attr("src",t.elements.$workspaceView.attr("src")),t.elements.$workspaceList.attr("src",t.elements.$workspaceList.attr("src"))})})},t.renderSendPageToStageWindow=function(e){var i,n=e.currentTarget,s=n.dataset.direction;if("prev"===s)i="sendPageToPreviousStage";else{if("next"!==s)throw"Invalid direction "+s+" requested.";i="sendPageToNextStage"}t.sendRemoteRequest(t.generateRemoteActionsPayload(i,[TYPO3.settings.Workspaces.id])).done(function(e){var i=t.renderSendToStageWindow(e);i.on("button.clicked",function(s){if("ok"===s.target.name){var a=o.convertFormToObject(s.currentTarget.querySelector("form"));a.affects=e[0].result.affects,a.stageId=n.dataset.stageId,t.sendRemoteRequest([t.generateRemoteActionsPayload("sentCollectionToStage",[a]),t.generateRemoteActionsPayload("updateStageChangeButtons",[TYPO3.settings.Workspaces.id])]).done(function(e){i.modal("hide"),t.renderStageButtons(e[1].result)})}})})},t.changePreviewMode=function(e){e.preventDefault();var i=n(e.currentTarget),s=t.elements.$activePreviewMode.data("activePreviewMode"),o=i.data("previewMode");t.elements.$activePreviewMode.text(i.text()).data("activePreviewMode",o),t.elements.$workspacePreview.parent().removeClass("preview-mode-"+s).addClass("preview-mode-"+o),"slider"===o?(t.elements.$stageSlider.parent().toggle(!0),t.resizeViews()):(t.elements.$stageSlider.parent().toggle(!1),"vbox"===o?t.elements.$liveView.height("100%"):t.elements.$liveView.height("50%"))},n(function(){t.getElements(),t.resizeViews(),t.adjustPreviewModeSelectorWidth(),t.elements.$stageSlider.slider(),t.registerEvents()}),t}return __extends(t,e),t.getAvailableSpace=function(){return n(window).height()-n(r.topbar).outerHeight()},t.prototype.getElements=function(){this.elements.$liveView=n(r.liveView),this.elements.$workspacePanel=n(r.workspacePanel),this.elements.$workspaceTabs=n(r.workspaceTabs),this.elements.$workspaceActions=n(r.workspaceActions),this.elements.$stageSlider=n(r.stageSlider),this.elements.$workspaceView=n(r.workspaceView),this.elements.$workspaceList=n(r.workspaceList),this.elements.$stageButtonsContainer=n(r.stageButtonsContainer),this.elements.$previewModeContainer=n(r.previewModeContainer),this.elements.$activePreviewMode=n(r.activePreviewMode),this.elements.$workspacePreview=n(r.workspacePreview)},t.prototype.registerEvents=function(){var e=this;n(window).on("resize",function(){e.resizeViews()}),n(document).on("click",r.discardAction,this.renderDiscardWindow).on("click",r.sendToStageAction,this.renderSendPageToStageWindow),this.elements.$workspaceTabs.on("show.bs.tab",function(t){e.elements.$workspaceActions.toggle(t.currentTarget.dataset.actions)}),this.elements.$stageSlider.on("change",this.updateSlidePosition),this.elements.$previewModeContainer.find("[data-preview-mode]").on("click",this.changePreviewMode)},t.prototype.renderStageButtons=function(e){this.elements.$stageButtonsContainer.html(e)},t.prototype.resizeViews=function(){var e=t.getAvailableSpace(),i=-1*(this.currentSlidePosition-100),n=Math.round(Math.abs(e*i/100)),s=this.elements.$liveView.outerHeight()-this.elements.$liveView.height();this.elements.$workspacePreview.height(e),"slider"===this.elements.$activePreviewMode.data("activePreviewMode")&&this.elements.$liveView.height(n-s),this.elements.$workspaceList.height(e)},t.prototype.adjustPreviewModeSelectorWidth=function(){var e=this.elements.$previewModeContainer.find(".btn-group"),t=0;e.addClass("open"),this.elements.$previewModeContainer.find("li > a > span").each(function(e,i){var s=n(i).width();t<s&&(t=s)}),e.removeClass("open"),this.elements.$activePreviewMode.width(t)},t}(a.default))});