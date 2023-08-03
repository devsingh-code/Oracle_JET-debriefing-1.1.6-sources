/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","jquery","ojs/ojcore-base","ojs/ojdomutils"],function(e,t,n,l){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;const r=function(){};r._ARIA_READONLY="aria-readonly",r._DATA_OJ_ARIA_READONLY_MOD="data-oj-ariareadonlymod",r._TAB_INDEX="tabIndex",r._DATA_OJ_TABMOD="data-oj-tabmod",r._FOCUSABLE_ELEMENTS_QUERY="input, select, button, a[href], textarea, object, [tabIndex]:not([tabIndex='-1'])",r._FOCUSABLE_ELEMENTS_TAG=["input","select","button","a","textarea","object"],r.CHECKVIEWPORT_THRESHOLD=3,r.getFocusableElementsInNode=function(e,t){var l=[],i=n.AgentUtils.getAgentInfo(),E=!0;if(n.AgentUtils.BROWSER.IE===i.browser&&null==e.parentNode&&(E=!1),E)for(var s=e.querySelectorAll(r._FOCUSABLE_ELEMENTS_QUERY),o=s.length,a=0;a<o;a++){var u=s[a];if(!u.disabled&&(t||r.checkVisibility(u))){var _=parseInt(u.getAttribute(r._TAB_INDEX),10);(isNaN(_)||_>=0)&&l.push(u)}}return l},r.checkVisibility=function(e){return!(0===e.offsetHeight||0===e.offsetWidth)},r.removeAriaReadonly=function(e){var t=e.getAttribute(r._ARIA_READONLY);e.setAttribute(r._DATA_OJ_ARIA_READONLY_MOD,t),e.removeAttribute(r._ARIA_READONLY)},r.disableElement=function(e){var t=parseInt(e.getAttribute(r._TAB_INDEX),10);e.setAttribute(r._DATA_OJ_TABMOD,t),e.setAttribute(r._TAB_INDEX,-1)},r.disableAllFocusableElements=function(e,t,n,l){for(var i=[],E=r.getFocusableElementsInNode(e,t),s=0;s<E.length;s++)n&&E[s]===document.activeElement||(r.disableElement(E[s]),i.push(E[s])),l&&E[s].hasAttribute(r._ARIA_READONLY)&&r.removeAriaReadonly(E[s]);return i},r.enableAllFocusableElements=function(e){for(var t=e.querySelectorAll("["+r._DATA_OJ_TABMOD+"]"),n=0;n<t.length;n++){var l=parseInt(t[n].getAttribute(r._DATA_OJ_TABMOD),10);if(t[n].removeAttribute(r._DATA_OJ_TABMOD),isNaN(l)?t[n].removeAttribute(r._TAB_INDEX):t[n].setAttribute(r._TAB_INDEX,l),t[n].hasAttribute(r._DATA_OJ_ARIA_READONLY_MOD)){var i=t[n].getAttribute(r._DATA_OJ_ARIA_READONLY_MOD);t[n].removeAttribute(r._DATA_OJ_ARIA_READONLY_MOD),t[n].setAttribute(r._ARIA_READONLY,i)}}return t},r.isFromDefaultSelector=function(e){return e.target.classList.contains("oj-selectorbox")},r.getFocusableElementsIncludingDisabled=function(e){var t=[];let n=e.querySelectorAll(r._FOCUSABLE_ELEMENTS_QUERY+",["+r._DATA_OJ_TABMOD+"]");for(var l=0;l<n.length;l++){var i=n[l];i.disabled||"none"===i.style.display||t.push(i)}return t},r.isElementOrAncestorFocusable=function(e,t){return!(null==e||t&&t(e))&&(!!e.hasAttribute(r._DATA_OJ_TABMOD)||(parseInt(e.getAttribute(r._TAB_INDEX),10)>=0||(r._FOCUSABLE_ELEMENTS_TAG.indexOf(e.tagName.toLowerCase())>-1||r.isElementOrAncestorFocusable(e.parentElement,t))))},r.handleActionableTab=function(e,t){var n=r.getFocusableElementsInNode(t);return n.length>0&&e.target===n[n.length-1]&&(n[0].focus(),!0)},r.handleActionablePrevTab=function(e,t){var n=r.getFocusableElementsInNode(t);return n.length>0&&e.target===n[0]&&(n[n.length-1].focus(),!0)},r.isEventClickthroughDisabled=function(e,t){for(var n=e.target;null!=n&&n!==t;){if(r.isClickthroughDisabled(n))return!0;n=n.parentNode}return!1},r.isClickthroughDisabled=function(e){return"disabled"===e.dataset.ojClickthrough},r.getDefaultScrollBarWidth=function(e){var t;if(e&&e.style){var n=e.style.visibility,l=e.style.position,r=e.style.overflowY,i=e.style.height,E=e.style.width;e.style.visibility="hidden",e.style.position="absolute",e.style.overflowY="hidden",e.style.height="50px",e.style.width="50px";var s=e.offsetWidth-e.clientWidth;e.style.overflowY="scroll",t=e.offsetWidth-e.clientWidth-s,e.style.width=E,e.style.height=i,e.style.overflowY=r,e.style.position=l,e.style.visibility=n}return t},r.disableDefaultBrowserStyling=function(e){e.setAttribute("x-ms-format-detection","none")},r.applyMergedInlineStyles=function(e,t,n){var l=r.convertStringToStyleObj(n),i=r.convertStringToStyleObj(t),E=Object.assign({},l,i);r.applyStyleObj(e,E)},r.convertStringToStyleObj=function(e){var t={};if(e.split)for(var n=e.split(";"),l=0;l<n.length;l++){var r=n[l];if(""!==r){var i=r.split(":");2===i.length&&(t[i[0].trim()]=i[1].trim())}}return t},r.applyStyleObj=function(e,t){for(var n=Object.keys(t),l=Object.values(t),r=0;r<n.length;r++)e.style[n[r]]=l[r]},r.isMobileTouchDevice=function(){var e=n.AgentUtils.getAgentInfo();return e.os===n.AgentUtils.OS.IOS||e.os===n.AgentUtils.OS.ANDROID||e.os===n.AgentUtils.OS.WINDOWSPHONE},r.getNoJQFocusHandlers=function(e,t){return l.getNoJQFocusHandlers(e,t)},r.areKeySetsEqual=function(e,t){if(e===t)return!0;var l,r,i=e.isAddAll();if(i!==t.isAddAll())return!1;if(i?(l=e.deletedValues(),r=t.deletedValues()):(l=e.values(),r=t.values()),l.size!==r.size)return!1;for(var E=l.values(),s=r.values(),o=E.next(),a=s.next();!o.done;){if(!n.KeyUtils.equals(o.value,a.value))return!1;o=E.next(),a=s.next()}return!0},r.KEYBOARD_KEYS={_SPACEBAR:" ",_SPACEBAR_IE:"SpaceBar",_SPACEBAR_CODE:32,_ENTER:"Enter",_ENTER_CODE:13,_UP:"ArrowUp",_UP_IE:"Up",_UP_CODE:38,_DOWN:"ArrowDown",_DOWN_IE:"Down",_DOWN_CODE:40,_LEFT:"ArrowLeft",_LEFT_IE:"Left",_LEFT_CODE:37,_RIGHT:"ArrowRight",_RIGHT_IE:"Right",_RIGHT_CODE:39,_HOME:"Home",_HOME_CODE:36,_END:"End",_END_CODE:35,_TAB:"Tab",_TAB_CODE:9,_ESCAPE:"Escape",_ESCAPE_IE:"Esc",_ESCAPE_CODE:27,_F2:"F2",_F2_CODE:113,_NUM5_KEY:"5",_NUM5_KEY_CODE:53,_LETTER_A:"a",_LETTER_A_UPPERCASE:"A",_LETTER_A_CODE:65},r.isEnterKeyEvent=function(e){return e===r.KEYBOARD_KEYS._ENTER||e===r.KEYBOARD_KEYS._ENTER_CODE},r.isSpaceBarKeyEvent=function(e){return e===r.KEYBOARD_KEYS._SPACEBAR||e===r.KEYBOARD_KEYS._SPACEBAR_IE||e===r.KEYBOARD_KEYS._SPACEBAR_CODE},r.isEscapeKeyEvent=function(e){return e===r.KEYBOARD_KEYS._ESCAPE||e===r.KEYBOARD_KEYS._ESCAPE_IE||e===r.KEYBOARD_KEYS._ESCAPE_CODE},r.isTabKeyEvent=function(e){return e===r.KEYBOARD_KEYS._TAB||e===r.KEYBOARD_KEYS._TAB_CODE},r.isF2KeyEvent=function(e){return e===r.KEYBOARD_KEYS._F2||e===r.KEYBOARD_KEYS._F2_CODE},r.isHomeKeyEvent=function(e){return e===r.KEYBOARD_KEYS._HOME||e===r.KEYBOARD_KEYS._HOME_CODE},r.isEndKeyEvent=function(e){return e===r.KEYBOARD_KEYS._END||e===r.KEYBOARD_KEYS._END_CODE},r.isArrowUpKeyEvent=function(e){return e===r.KEYBOARD_KEYS._UP||e===r.KEYBOARD_KEYS._UP_IE||e===r.KEYBOARD_KEYS._UP_CODE},r.isArrowDownKeyEvent=function(e){return e===r.KEYBOARD_KEYS._DOWN||e===r.KEYBOARD_KEYS._DOWN_IE||e===r.KEYBOARD_KEYS._DOWN_CODE},r.isArrowLeftKeyEvent=function(e){return e===r.KEYBOARD_KEYS._LEFT||e===r.KEYBOARD_KEYS._LEFT_IE||e===r.KEYBOARD_KEYS._LEFT_CODE},r.isArrowRightKeyEvent=function(e){return e===r.KEYBOARD_KEYS._RIGHT||e===r.KEYBOARD_KEYS._RIGHT_IE||e===r.KEYBOARD_KEYS._RIGHT_CODE},r.isNumberFiveKeyEvent=function(e){return e===r.KEYBOARD_KEYS._NUM5_KEY||e===r.KEYBOARD_KEYS._NUM5_KEY_CODE},r.isLetterAKeyEvent=function(e){return e===r.KEYBOARD_KEYS._LETTER_A||e===r.KEYBOARD_KEYS._LETTER_A_UPPERCASE||e===r.KEYBOARD_KEYS._LETTER_A_CODE},r.getAddEventKeysResult=function(e,t,n){var l,i,E,s,o;function a(e,t){return{key:e,index:t}}var u=[...e],_=[];t.keys.forEach(function(e){_.push(e)});var A=[],c=t.addBeforeKeys?t.addBeforeKeys:t.afterKeys;null!=c&&c.forEach(function(e){A.push(e)});var O=t.indexes;if(A.length===_.length)for(var d=0;_.length!==d;)for(d=_.length,l=_.length-1;l>=0;l--)E=_[l],r.containsKey(u,E)||(null!=(i=A[l])?-1!==(o=r._indexOfKey(u,i))&&(u.splice(o,0,E),A.splice(l,1),_.splice(l,1)):n&&(u.push(E),A.splice(l,1),_.splice(l,1)));else if(null!=O&&O.length===_.length){var f=[];for(l=0;l<_.length;l++)if(E=_[l],!r.containsKey(u,E))if(null!=(s=O[l])){for(var D=!1,K=0;K<f.length;K++)if(f[K].index>s){f.splice(K,0,a(E,s)),D=!0;break}D||f.push(a(E,s))}else n&&u.push(E);for(l=0;l<f.length;l++){var b=f[l];b.index<u.length?u.splice(b.index,0,b.key):b.index===u.length&&n&&u.push(b.key)}}else n&&_.forEach(function(e){u.push(e)});return u},r.containsKey=function(e,t){for(var l=0;l<e.length;l++)if(n.KeyUtils.equals(e[l],t))return!0;return!1},r._indexOfKey=function(e,t){for(var l=0;l<e.length;l++)if(n.KeyUtils.equals(e[l],t))return l;return-1},r.calculateOffsetTop=function(e,t){for(var n=0,l=t;l&&l!==e&&e.contains(l);)n+=l.offsetTop,l=l.offsetParent;return n},r.getLogicalChildPopup=function(e){for(var r=n.ZOrderUtils.findOpenPopups(),i=0;i<r.length;i++){var E=r[i].firstElementChild,s=l.getLogicalParent(t(E));if(null!=s&&t(e).has(s.get(0)).length>0&&n.ZOrderUtils.getStatus(E)===n.ZOrderUtils.STATUS.OPEN)return E}return null},r.isElementInScrollerBounds=function(e,t){var n,l;if(t===document.documentElement)n=0,l=document.documentElement.clientHeight;else{var r=t.getBoundingClientRect();n=r.top,l=r.bottom}var i=e.getBoundingClientRect();return i.top>=n&&i.bottom<=l};const i=r.applyMergedInlineStyles,E=r.applyStyleObj,s=r.areKeySetsEqual,o=r.containsKey,a=r.convertStringToStyleObj,u=r.disableElement,_=r.disableAllFocusableElements,A=r.disableDefaultBrowserStyling,c=r.enableAllFocusableElements,O=r.getAddEventKeysResult,d=r.getDefaultScrollBarWidth,f=r.getFocusableElementsIncludingDisabled,D=r.isElementOrAncestorFocusable,K=r.isIterateAfterDoneNotAllowed=function(e){if(e&&e.getCapability){var t=e.getCapability("fetchFirst");if(t&&"notAllowed"===t.iterateAfterDone)return!0}return!1},b=r.getFocusableElementsInNode,v=r.getLogicalChildPopup,y=r.getNoJQFocusHandlers,g=r.handleActionablePrevTab,S=r.handleActionableTab,R=r.isArrowDownKeyEvent,h=r.isArrowLeftKeyEvent,T=r.isArrowRightKeyEvent,Y=r.isArrowUpKeyEvent,p=r.isClickthroughDisabled,B=r.isEndKeyEvent,I=r.isEnterKeyEvent,C=r.isEscapeKeyEvent,N=r.isEventClickthroughDisabled,m=r.isFromDefaultSelector,F=r.isF2KeyEvent,L=r.isHomeKeyEvent,w=r.isMobileTouchDevice,P=r.isSpaceBarKeyEvent,U=r.isTabKeyEvent,M=r.isNumberFiveKeyEvent,H=r.isLetterAKeyEvent,j=r.KEYBOARD_KEYS,x=r.CHECKVIEWPORT_THRESHOLD,k=r.calculateOffsetTop,W=r.isElementInScrollerBounds,J=r.isRequestIdleCallbackSupported=function(){return null!=window.requestIdleCallback&&null!=window.cancelIdleCallback&&null!=window.IdleDeadline};e.CHECKVIEWPORT_THRESHOLD=x,e.KEYBOARD_KEYS=j,e.applyMergedInlineStyles=i,e.applyStyleObj=E,e.areKeySetsEqual=s,e.calculateOffsetTop=k,e.containsKey=o,e.convertStringToStyleObj=a,e.disableAllFocusableElements=_,e.disableDefaultBrowserStyling=A,e.disableElement=u,e.enableAllFocusableElements=c,e.getAddEventKeysResult=O,e.getDefaultScrollBarWidth=d,e.getFocusableElementsInNode=b,e.getFocusableElementsIncludingDisabled=f,e.getLogicalChildPopup=v,e.getNoJQFocusHandlers=y,e.handleActionablePrevTab=g,e.handleActionableTab=S,e.isArrowDownKeyEvent=R,e.isArrowLeftKeyEvent=h,e.isArrowRightKeyEvent=T,e.isArrowUpKeyEvent=Y,e.isClickthroughDisabled=p,e.isElementInScrollerBounds=W,e.isElementOrAncestorFocusable=D,e.isEndKeyEvent=B,e.isEnterKeyEvent=I,e.isEscapeKeyEvent=C,e.isEventClickthroughDisabled=N,e.isF2KeyEvent=F,e.isFromDefaultSelector=m,e.isHomeKeyEvent=L,e.isIterateAfterDoneNotAllowed=K,e.isLetterAKeyEvent=H,e.isMobileTouchDevice=w,e.isNumberFiveKeyEvent=M,e.isRequestIdleCallbackSupported=J,e.isSpaceBarKeyEvent=P,e.isTabKeyEvent=U,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdatacollection-common.js.map