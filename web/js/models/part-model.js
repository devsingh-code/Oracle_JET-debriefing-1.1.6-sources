"use strict";define(["knockout","./abstract-model"],(e,t)=>{return class extends t{constructor(e){super(),this._properties={},this._properties.itemId=this.constructor._getArgumentAsObservable(e.itemId||this.constructor.generateUniqueId()),this._properties.catalogId=this.constructor._getArgumentAsObservable(e.catalogId),this._properties.label=this.constructor._getArgumentAsObservable(e.label),this._properties.itemType=this.constructor._getArgumentAsObservable(e.itemType),this._properties.inventoryType=this.constructor._getArgumentAsObservable(e.inventoryType),this._properties.fields=this.constructor._getArgumentAsObservable(e.fields),this._properties.linkedItems=this.constructor._getArgumentAsObservable(e.linkedItems||[]),this._properties.images=this.constructor._getArgumentAsObservable(e.images||[]),this.constructor.definePropertyAsObject(this._properties.fields),this.constructor.definePropertyAsObject(this._properties.linkedItems),this.constructor.definePropertyAsArray(this._properties.images)}static get KEY_PROPERTY(){return"itemId"}get itemId(){return this._properties.itemId()}get catalogId(){return this._properties.catalogId()}get label(){return this._properties.label()}set label(e){this._properties.label(e)}get itemType(){return this._properties.itemType()}set itemType(e){this._properties.itemType(e)}get inventoryType(){return this._properties.inventoryType()}set inventoryType(e){this._properties.inventoryType(e)}get fields(){return this._properties.fields()}set fields(e){this._properties.fields(e)}get linkedItems(){return this._properties.linkedItems()}set linkedItems(e){this._properties.linkedItems(e)}get images(){return this._properties.images()}set images(e){this._properties.images(e)}}});