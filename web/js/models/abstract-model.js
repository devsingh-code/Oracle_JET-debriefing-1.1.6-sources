"use strict";define(["knockout"],t=>{let e=1;return class{getId(){return this[this.constructor.KEY_PROPERTY]}static _getArgumentAsObservable(e){return t.isObservable(e)?e:e instanceof Array?t.observableArray(e):t.observable(e)}static generateUniqueId(){let t=(new Date).getTime(),r="";return window.crypto.getRandomValues(new Uint8Array(8)).forEach(t=>{let e=t.toString(16);r+=e.length<2?"0"+e:e}),`${t}-${e++}-${r}`}static definePropertyAsArray(t){t.__isArray=!0}static definePropertyAsObject(t){t.__isObject=!0}static isPropertyArray(t){return t.__isArray}static isPropertyObject(t){return t.__isObject}static get KEY_PROPERTY(){return"id"}}});