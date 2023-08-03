/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["../persistenceUtils","./logger"],(function(e,t){"use strict";function r(e){var t=this;Object.defineProperty(this,"_eventListeners",{value:[],writable:!0}),Object.defineProperty(this,"_browserXMLHttpRequest",{value:e}),Object.defineProperty(this,"_method",{value:null,writable:!0}),Object.defineProperty(this,"onabort",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"onerror",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"onload",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"onloadend",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"onloadstart",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"onprogress",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"onreadystatechange",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"ontimeout",{value:null,enumerable:!0,writable:!0}),Object.defineProperty(this,"_password",{value:null,writable:!0}),Object.defineProperty(this,"_readyState",{value:0,writable:!0}),Object.defineProperty(this,"readyState",{enumerable:!0,get:function(){return t._readyState}}),Object.defineProperty(this,"_requestHeaders",{value:{},writable:!0}),Object.defineProperty(this,"_response",{value:"",writable:!0}),Object.defineProperty(this,"response",{enumerable:!0,get:function(){return t._response}}),Object.defineProperty(this,"_responseHeaders",{value:{},writable:!0}),Object.defineProperty(this,"_responseText",{value:"",writable:!0}),Object.defineProperty(this,"responseText",{enumerable:!0,get:function(){return t._responseText}}),Object.defineProperty(this,"responseType",{value:"",enumerable:!0,writable:!0}),Object.defineProperty(this,"_responseURL",{value:"",writable:!0}),Object.defineProperty(this,"responseURL",{enumerable:!0,get:function(){return t._responseURL}}),Object.defineProperty(this,"_responseXML",{value:null,writable:!0}),Object.defineProperty(this,"responseXML",{enumerable:!0,get:function(){return t._responseXML}}),Object.defineProperty(this,"_status",{value:0,writable:!0}),Object.defineProperty(this,"status",{enumerable:!0,get:function(){return t._status}}),Object.defineProperty(this,"_statusText",{value:"",writable:!0}),Object.defineProperty(this,"statusText",{enumerable:!0,get:function(){return t._statusText}}),Object.defineProperty(this,"timeout",{value:0,enumerable:!0,writable:!0}),Object.defineProperty(this,"_isTimedOut",{value:!1,enumerable:!0,writable:!0}),Object.defineProperty(this,"upload",{value:new i,enumerable:!0}),Object.defineProperty(this,"_url",{value:null,writable:!0}),Object.defineProperty(this,"_username",{value:null,writable:!0}),Object.defineProperty(this,"withCredentials",{value:!1,enumerable:!0,writable:!0}),Object.defineProperty(this,"_abortController",{value:null,writable:!0}),Object.defineProperty(this,"_isUpload",{value:!1,writable:!0}),Object.defineProperty(this,"UNSENT",{value:0,enumerable:!0}),Object.defineProperty(this,"OPENED",{value:1,enumerable:!0}),Object.defineProperty(this,"HEADERS_RECEIVED",{value:2,enumerable:!0}),Object.defineProperty(this,"LOADING",{value:3,enumerable:!0}),Object.defineProperty(this,"DONE",{value:4,enumerable:!0})}function s(e,t){e._readyState=t,e.dispatchEvent(new l("readystatechange")),1==e._isTimedOut&&e._readyState==r.DONE?(e.dispatchEvent(new l("timeout",!1,!1,e)),e.dispatchEvent(new l("loadend",!1,!1,e)),e._isTimedOut=!1):e._readyState==r.DONE&&(e.dispatchEvent(new l("load",!1,!1,e)),e.dispatchEvent(new l("loadend",!1,!1,e)))}function n(n,o,i){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Processing Response"),function(e,t){if(e._responseHeaders={},t.entries){var n,o,i,a=t.entries();do{(n=a.next()).value&&(o=n.value[0],i=n.value[1],e._forceMimeType&&"content-type"==o.toLowerCase()?e._responseHeaders[o]=e._forceMimeType:e._responseHeaders[o]=i)}while(!n.done)}else t.forEach&&t.forEach((function(t,r){e._forceMimeType&&"content-type"==r.toLowerCase()?e._responseHeaders[r]=e._forceMimeType:e._responseHeaders[r]=t}));s(e,r.HEADERS_RECEIVED)}(n,i.headers);var a=i.headers.get("Content-Type");n._status=i.status,n._statusText=i.statusText,n._responseURL=o.url;var l=e._derivePayloadType(n,i);if("blob"===l)t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.blob()"),i.blob().then((function(e){n._responseType="blob",n._response=e,s(n,r.DONE),"function"==typeof n.onload&&n.onload()}),(function(e){t.error(e)}));else if("arraybuffer"===l)t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.arrayBuffer()"),i.arrayBuffer().then((function(e){n._responseType="arrayBuffer",n._response=e,s(n,r.DONE),"function"==typeof n.onload&&n.onload()}),(function(e){t.error("error reading response as arrayBuffer!")}));else if("multipart"===l){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.formData()"),n._responseType="formData";var u=function(t){var o="";e.parseMultipartFormData(t,a).forEach((function(e){o+=e.data})),n._response=o,n._responseText=o,s(n,r.DONE),"function"==typeof n.onload&&n.onload()};if(i.formData)try{i.formData().then((function(e){var t,o,i="",a=e.values();do{(t=(o=a.next()).value)&&(i+=t)}while(!o.done);n._response=i,n._responseText=i,s(n,r.DONE),"function"==typeof n.onload&&n.onload()}))}catch(e){i.text().then((function(e){u(e)}))}else i.text().then((function(e){u(e)}))}else i.text().then((function(e){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling response.text()"),n._responseType="",n._response=e,n._responseText=e,s(n,r.DONE),"function"==typeof n.onload&&n.onload()}),(function(e){t.error(e)}))}function o(e){if(e._readyState!==r.OPENED)throw new Error("INVALID_STATE_ERR")}function i(){this.onabort=null,this.onerror=null,this.onload=null,this.onloadend=null,this.onloadstart=null,this.onprogress=null,this.ontimeout=null,this._eventListeners=[]}function a(e,t,r,s){Object.defineProperty(this,"type",{value:e,enumerable:!0}),Object.defineProperty(this,"bubbles",{value:t,enumerable:!0}),Object.defineProperty(this,"cancelable",{value:r,enumerable:!0}),Object.defineProperty(this,"target",{value:s,enumerable:!0}),Object.defineProperty(this,"lengthComputable",{value:!1,enumerable:!0}),Object.defineProperty(this,"loaded",{value:0,enumerable:!0}),Object.defineProperty(this,"total",{value:0,enumerable:!0})}function l(e,t,r,s){Object.defineProperty(this,"type",{value:e,enumerable:!0}),Object.defineProperty(this,"bubbles",{value:t,enumerable:!0}),Object.defineProperty(this,"cancelable",{value:r,enumerable:!0}),Object.defineProperty(this,"target",{value:s,enumerable:!0})}return Object.defineProperty(r,"UNSENT",{value:0,enumerable:!0}),Object.defineProperty(r,"OPENED",{value:1,enumerable:!0}),Object.defineProperty(r,"HEADERS_RECEIVED",{value:2,enumerable:!0}),Object.defineProperty(r,"LOADING",{value:3,enumerable:!0}),Object.defineProperty(r,"DONE",{value:4,enumerable:!0}),r.prototype.open=function(e,n,o,i,a){if(t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: open() for method: "+e+", url: "+n),"boolean"==typeof o&&!o)throw new Error("InvalidAccessError: Failed to execute 'open' on 'XMLHttpRequest': Synchronous requests are disabled on the XHR Adapter");this._method=e,this._url=n,this._isTimedOut=!1;var l=function(e){var t=e.toLowerCase();if(0===t.indexOf("http:")||0===t.indexOf("https:"))return!1;if(0===t.indexOf("file:")||0===t.indexOf("cdvfile:"))return!0;if(URL&&URL.prototype&&null!=(t=new URL(e,window.location.href).origin)&&"null"!=t&&t.length>0)return 0===t.toLowerCase().indexOf("file:");var r=document.createElement("a");return r.href=e,!(!(t=r.protocol)||0!==t.toLowerCase().indexOf("file:"))}(n);if(l){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: open called for a File url");var u=this;this._passthroughXHR=new u._browserXMLHttpRequest,this._passthroughXHR.onreadystatechange=function(){u._passthroughXHR.readyState==r.DONE&&(u._status=u._passthroughXHR.status,u._statusText=u._passthroughXHR.statusText,u._response=u._passthroughXHR.response,u._responseHeaders=u._passthroughXHR.responseHeaders,u._responseType=u._passthroughXHR.responseType,null!=u._responseType&&""!=u._responseType&&"text"!=u._responseType||(u._responseText=u._passthroughXHR.responseText),u._responseURL=u._passthroughXHR.responseURL,null!=u._responseType&&""!=u._responseType&&"document"!=u._responseType||(u._responseXML=u._passthroughXHR.responseXML)),s(u,u._passthroughXHR.readyState)},this._passthroughXHR.open(e,n,o,i,a)}else this._passthroughXHR=null;"undefined"!=typeof AbortController&&(this._abortController=new AbortController),this._username=i,this._password=a,this._responseText=null,this._responseXML=null,this._requestHeaders={},s(this,r.OPENED)},r.prototype.setRequestHeader=function(e,r){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: setRequestHeader() with header: "+e+" ,value: "+r),o(this);var s=this._requestHeaders[e];this._requestHeaders[e]=s?s+=","+r:r},r.prototype.send=function(e){var i=this;if(t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: send()"),this._passthroughXHR)null!=this.responseType&&(this._passthroughXHR.responseType=this.responseType),this._passthroughXHR.send(e);else{o(this),s(this,r.OPENED);var a=function(e,t){var r=function(e){var t=new Headers;return Object.keys(e._requestHeaders).forEach((function(r){t.append(r,e._requestHeaders[r])})),t}(e),s=e.withCredentials?"include":"same-origin",n={method:e._method,headers:r,mode:"cors",cache:"default",credentials:s};return"GET"!==e._method&&"HEAD"!==e._method&&"DELETE"!==e._method&&(n.body=t),n}(this,e),u=new Request(this._url,a);this._isUpload=!!a.body;var p={};(i=this)._abortController&&(p.signal=i._abortController.signal);try{i.timeout&&"number"==typeof i.timeout?function(e,r,s){return new Promise((function(n,o){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Calling fetchWithTimeout");var i=new Error("Fetch Timeout");i.name="TimeoutError";var a=setTimeout((function(){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Request Timedout: "+e.url),o(i),s._abortController&&s._abortController.abort()}),s.timeout);fetch(e,r).then((function(e){n(e)}),(function(e){o(e)})).finally((function(){clearTimeout(a)}))}))}(u,p,i).then((function(e){n(i,u,e)})).catch((function(e){e&&e.name&&"TimeoutError"===e.name?(i._isTimedOut=!0,s(i,r.DONE)):i.dispatchEvent(new l("error",!1,!1,i))})):fetch(u,p).then((function(e){n(i,u,e)}),(function(e){e&&e.name&&"AbortError"===e.name?(t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: Request Timedout: "+u.url),i.dispatchEvent(new l("abort",!1,!1,i))):i.dispatchEvent(new l("error",!1,!1,i))}))}catch(e){throw e}this.dispatchEvent(new l("loadstart",!1,!1,this))}},r.prototype.abort=function(){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: abort()"),this._abortController?this._abortController.abort():this.dispatchEvent(new l("abort",!1,!1,self)),this._readyState=r.UNSENT,this._status=0,this._statusText=""},r.prototype.getResponseHeader=function(e){if(t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: getResponseHeader() for header: "+e),this._readyState<r.HEADERS_RECEIVED)return null;for(var s in e=e.toLowerCase(),this._responseHeaders)if(s.toLowerCase()==e.toLowerCase())return this._responseHeaders[s];return null},r.prototype.getAllResponseHeaders=function(){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: getAllResponseHeaders()");var e=this;if(this._readyState<r.HEADERS_RECEIVED)return"";var s="";return this._responseHeaders&&Object.keys(this._responseHeaders).forEach((function(t){s+=t+": "+e._responseHeaders[t]+"\r\n"})),s},r.prototype.overrideMimeType=function(e){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: overrideMimeType() for mimeType: "+e),"string"==typeof e&&(this._forceMimeType=e.toLowerCase())},r.prototype.addEventListener=function(e,r){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: addEventListener() for event type: "+e),this._eventListeners[e]=this._eventListeners[e]||[],this._eventListeners[e].push(r)},r.prototype.removeEventListener=function(e,r){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: removeEventListener() for event type: "+e);var s,n=this._eventListeners[e]||[],o=n.length;for(s=0;s<o;s++)if(n[s]==r)return n.splice(s,1)},r.prototype.dispatchEvent=function(e){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequest: dispatchEvent() for event type: "+e.type);var r=this,s=e.type;switch((this._eventListeners[s]||[]).forEach((function(t){"function"==typeof t?t.call(r,e):t.handleEvent(e)})),s){case"abort":this._isUpload&&this.upload._dispatchEvent(new a("abort",!1,!1,r.upload)),this.onabort&&this.onabort(e),r.dispatchEvent(new l("loadend",!1,!1,r));break;case"error":this._isUpload&&this.upload._dispatchEvent(new a("error",!1,!1,r.upload)),this.onerror&&this.onerror(e);break;case"load":this._isUpload&&this.upload._dispatchEvent(new a("load",!1,!1,r.upload)),this.onload&&this.onload(e);break;case"loadend":this._isUpload&&this.upload._dispatchEvent(new a("loadend",!1,!1,r.upload)),this.onloadend&&this.onloadend(e);break;case"loadstart":this._isUpload&&this.upload._dispatchEvent(new a("loadstart",!1,!1,r.upload)),this.onloadstart&&this.onloadstart(e);break;case"progress":this.onprogress&&this.onprogress(e);break;case"readystatechange":this.onreadystatechange&&this.onreadystatechange(e);break;case"timeout":this._isUpload&&this.upload._dispatchEvent(new a("timeout",!1,!1,r.upload)),this.ontimeout&&this.ontimeout(e)}return!!e.defaultPrevented},i.prototype.addEventListener=function(e,r){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequestUpload: addEventListener() for event type: "+e),this._eventListeners[e]=this._eventListeners[e]||[],this._eventListeners[e].push(r)},i.prototype.removeEventListener=function(e,r){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequestUpload: removeEventListener() for event type: "+e);var s,n=this._eventListeners[e]||[],o=n.length;for(s=0;s<o;s++)if(n[s]==r)return n.splice(s,1)},i.prototype._dispatchEvent=function(e){t.log("Offline Persistence Toolkit PersistenceXMLHttpRequestUpload: dispatchEvent() for event type: "+e.type);var r=this,s=e.type;switch((this._eventListeners[s]||[]).forEach((function(t){"function"==typeof t?t.call(r,e):t.handleEvent(e)})),s){case"abort":this.onabort&&this.onabort(e);break;case"error":this.onerror&&this.onerror(e);break;case"load":this.onload&&this.onload(e);break;case"loadend":this.onloadend&&this.onloadend(e);break;case"loadstart":this.onloadstart&&this.onloadstart(e),this._dispatchEvent(new a("progress",!1,!1,r));break;case"progress":this.onprogress&&this.onprogress(e);break;case"timeout":this.ontimeout&&this.ontimeout(e)}return!!e.defaultPrevented},a.prototype.stopPropagation=function(){},a.prototype.preventDefault=function(){this.defaultPrevented=!0},l.prototype.stopPropagation=function(){},l.prototype.preventDefault=function(){this.defaultPrevented=!0},r}));