/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojeditablevalue","jqueryui-amd/widgets/draggable","ojs/ojtouchproxy","ojs/ojcore-base","jquery","ojs/ojtranslation","ojs/ojdomutils"],function(e,t,i,s,a,n,r,l){"use strict";a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n,function(){var e={properties:{readonly:{binding:{consume:{name:"readonly"}}},userAssistanceDensity:{binding:{consume:{name:"userAssistanceDensity"}}},labelEdge:{binding:{consume:{name:"labelEdge"}}}}},t={properties:{describedBy:{type:"string"},disabled:{type:"boolean",value:!1},displayOptions:{type:"object",properties:{converterHint:{type:"Array<string>|string"},helpInstruction:{type:"Array<string>|string",value:["notewindow"]},messages:{type:"Array<string>|string"},validatorHint:{type:"Array<string>|string"}}},help:{type:"object",properties:{instruction:{type:"string",value:""}}},helpHints:{type:"object",properties:{definition:{type:"string",value:""},source:{type:"string",value:""}}},labelEdge:{type:"string",enumValues:["inside","none","provided"]},labelHint:{type:"string",value:""},labelledBy:{type:"string"},max:{type:"number",value:100},messagesCustom:{type:"Array<Object>",writeback:!0,value:[]},min:{type:"number",value:0},orientation:{type:"string",enumValues:["horizontal","vertical"],value:"horizontal"},step:{type:"number",value:1},transientValue:{type:"number",writeback:!0,readOnly:!0},translations:{type:"object",value:{},properties:{invalidStep:{type:"string"},maxMin:{type:"string"},noValue:{type:"string"},optionNum:{type:"string"},valueRange:{type:"string"}}},type:{type:"string",enumValues:["fromMax","fromMin","single"],value:"fromMin"},userAssistanceDensity:{type:"string",enumValues:["compact","efficient","reflow"],value:"reflow"},valid:{type:"string",writeback:!0,enumValues:["invalidHidden","invalidShown","pending","valid"],readOnly:!0},value:{type:"number",writeback:!0,value:0}},methods:{getProperty:{},refresh:{},reset:{},setProperties:{},setProperty:{},showMessages:{},getNodeBySubId:{},getSubIdByNode:{}},events:{ojAnimateEnd:{},ojAnimateStart:{}},extension:{}};t.extension._WIDGET_NAME="ojSlider",t.extension._INNER_ELEM="input",a.CustomElementBridge.register("oj-slider",{metadata:a.CollectionUtils.mergeDeep(t,e)});var i={properties:{describedBy:{type:"string"},disabled:{type:"boolean",value:!1},displayOptions:{type:"object",properties:{converterHint:{type:"Array<string>|string"},helpInstruction:{type:"Array<string>|string",value:["notewindow"]},messages:{type:"Array<string>|string"},validatorHint:{type:"Array<string>|string"}}},help:{type:"object",properties:{instruction:{type:"string",value:""}}},helpHints:{type:"object",properties:{definition:{type:"string",value:""},source:{type:"string",value:""}}},labelEdge:{type:"string",enumValues:["inside","none","provided"]},labelHint:{type:"string",value:""},labelledBy:{type:"string"},max:{type:"number",value:100},messagesCustom:{type:"Array<Object>",writeback:!0,value:[]},min:{type:"number",value:0},orientation:{type:"string",enumValues:["horizontal","vertical"],value:"horizontal"},step:{type:"number",value:1},transientValue:{type:"object",writeback:!0,readOnly:!0,properties:{end:{type:"number"},start:{type:"number"}}},translations:{type:"object",value:{},properties:{higherValueThumb:{type:"string"},lowerValueThumb:{type:"string"},startEnd:{type:"string"}}},userAssistanceDensity:{type:"string",enumValues:["compact","efficient","reflow"],value:"reflow"},valid:{type:"string",writeback:!0,enumValues:["invalidHidden","invalidShown","pending","valid"],readOnly:!0},value:{type:"object",writeback:!0,properties:{end:{type:"number"},start:{type:"number"}}}},methods:{getProperty:{},refresh:{},reset:{},setProperties:{},setProperty:{},showMessages:{},getNodeBySubId:{},getSubIdByNode:{}},events:{ojAnimateEnd:{},ojAnimateStart:{}},extension:{}};i.extension._WIDGET_NAME="ojSlider",i.extension._INNER_ELEM="input",a.CustomElementBridge.register("oj-range-slider",{metadata:a.CollectionUtils.mergeDeep(i,e)})}(),a.__registerWidget("oj.ojSlider",n.oj.editableValue,{defaultElement:"<input>",version:"1.0.1",widgetEventPrefix:"oj",options:{labelledBy:null,max:100,min:0,orientation:"horizontal",readOnly:!1,disabled:!1,step:1,type:"fromMin",value:0,rawValue:void 0},_numPages:5,_defaultElementId:null,_sliderDisplayValue:null,_isRTL:function(){return"rtl"===l.getReadingDirection()},_ComponentCreate:function(){if(this._super(),this._inputtag=!1,this.element.is("INPUT"))if(this._inputtag=!0,this.element[0].style&&(this._styleFromInputTag=this.element[0].style.cssText),this._inputElementOriginalDisplay=this.element[0].style.display,this.element[0].style.display="none",this.OuterWrapper)this._elementWrapped=n(this.OuterWrapper);else{var e=n(this.element).wrap("<div> </div>");this._elementWrapped=e.parent()}else this._elementWrapped=this.element;this._transientValueName=this._IsCustomElement()?"transientValue":"rawValue",this._componentCreateStyling(),this._componentSetup()},_SetRawValue:function(e,t){var i={};i._context={originalEvent:t,writeback:!0,internalSet:!0,readOnly:!0},a.Object.compareValues(this.options[this._transientValueName],e)||this.option(this._transientValueName,e,i)},_componentCreateStyling:function(){this._elementWrapped[0].classList.add("oj-slider","oj-component","oj-form-control"),this._setOrientationStyles(!0)},_setOrientationStyles:function(e){var t=this._elementWrapped[0];this._isVertical()?(e||t.classList.remove("oj-slider-horizontal"),t.classList.add("oj-slider-vertical")):(e||t.classList.remove("oj-slider-vertical"),t.classList.add("oj-slider-horizontal"))},_componentSetup:function(){this._newMultiValue=[],this._thumbIndex=null,this._isCustomRangeSlider()&&(this.options.type="range","number"==typeof this.options.value&&(this.options.value={start:null,end:null})),"range"===this.options.type?this._multipleThumbs=!0:this._multipleThumbs=!1,this._calculateNewMax(),this._createSliderContainer(),this._createBarBackground(),this._buildValueOption(),this._createRange(),this._createThumbs(),this._updateUI(),this._setupEvents()},_copyLabelledbyToThumb:function(e){var t,i=this._elementWrapped.find(".oj-slider-thumb");if(this._isCustomRangeSlider()){var s=document.getElementById(e),a=s?s.textContent:"",l=r.getTranslatedString("oj-ojSlider.lowerValueThumb"),u=r.getTranslatedString("oj-ojSlider.higherValueThumb");i.attr("aria-label",a+" "+l),t=i[1],n(t).attr("aria-label",a+" "+u)}else i.attr("aria-labelledby",e),i.length>1&&(t=i[1],n(t).attr("aria-labelledby",String(e)))},_setAriaLabelToThumb:function(e){var t;if(this._isCustomRangeSlider()){var i=r.getTranslatedString("oj-ojSlider.lowerValueThumb"),s=r.getTranslatedString("oj-ojSlider.higherValueThumb");(t=this._elementWrapped.find(".oj-slider-thumb")).attr("aria-label",e+" "+i);var a=t[1];n(a).attr("aria-label",e+" "+s)}else(t=this.OuterWrapper.querySelector(".oj-slider-thumb")).setAttribute("aria-label",e)},_AfterCreate:function(){this._super(),this._makeDraggable(),this._setAriaInfo()},_setAriaInfo:function(){var e,i,s;if(this.OuterWrapper){if(this.options.labelledBy){var a=this.uuid+"_Label";s=t.EditableValueUtils._getOjLabelAriaLabelledBy(this.options.labelledBy,a),this._copyLabelledbyToThumb(s)}this.options.labelledBy&&!document.getElementById(this.options.labelledBy)||(e=this.OuterWrapper.getAttribute("aria-label"))&&this._setAriaLabelToThumb(e)}else if(i=this._GetLabelElementLocal()){var n=i.attr("id");n||(n=i.attr("for")),n.length>0&&this._copyLabelledbyToThumb(n)}else(e=this.element.attr("aria-label"))&&this._elementWrapped.find(".oj-slider-thumb").attr("aria-label",e)},_GetLabelElementLocal:function(){var e=this._getAriaLabelledByElementLocal();return null!==e&&0!==e.length||null!==(e=this._getAriaLabelForElementLocal())&&0!==e.length?e:null},_getAriaLabelForElementLocal:function(){var e;if(void 0!==(e=this.element.prop("id"))){var t=n("label[for='"+e+"']");if(t.length>0)return t;var i="span[for='"+e+"']";if(0!==n(i).length)return n(i)}return null},_getAriaLabelledByElementLocal:function(){var e=this.element.attr("aria-labelledby");if(void 0===e&&this.OuterWrapper){var t=this._elementWrapped.attr("aria-labelledby");if(t&&null!==document.getElementById(t))return n(document.getElementById(t))}if(void 0!==e){var i=n("label[id='"+e+"']");if(i.length>0)return i;var s=n("span[id='"+e+"']");if(s.length>0)return s}return null},widget:function(){return this._elementWrapped},_SetDisplayValue:function(e){this._sliderDisplayValue=e},_GetDisplayValue:function(){return this._sliderDisplayValue},_getElementId:function(){return this.OuterWrapper?(this._elementWrapped[0].id||this._elementWrapped.uniqueId(),this._elementWrapped[0].id):(this.element[0].id||this.element.uniqueId(),this.element[0].id)},_getThumbId:function(e){return this._getElementId()+"-thumb"+e},_getBarValueId:function(){return this._getElementId()+"-barValue"},_getBarBackgroundId:function(){return this._getElementId()+"-barBack"},_getSliderWrapperId:function(){return this._getElementId()+"-sliderWrapper"},_createThumbs:function(){var e,t,i="",s="class='oj-slider-thumb ui-state-default' tabindex='0' role='slider'aria-valuemin = '"+this._valueMin()+"' aria-valuemax = '"+this._valueMax()+"' ></span>",a=[];for(t=this._multipleThumbs?2:1,e=0;e<t;e++)i="<span id='"+this._getThumbId(e)+"' "+s,a.push(i);this._thumbs=n(a.join("")).appendTo(this._sliderContainer),this._thumb=this._thumbs.eq(0),this._refreshThumbOptions()},_refreshThumbOptions:function(){var e=this,t=0;this._thumbs.each(function(){n(this).data("oj-slider-thumb-index",t),t+=1,e._isVertical()&&n(this).attr("aria-orientation","vertical"),e.options.disabled?(n(this).attr("aria-disabled","true"),n(this).removeAttr("tabindex")):(n(this).removeAttr("aria-disabled"),n(this).attr("tabindex","0")),e.options.readOnly?n(this).attr("title","read only"):n(this).removeAttr("title")})},_createSliderContainer:function(){var e=this._getSliderWrapperId(),t=this._elementWrapped.find("#"+e);t.length&&t.remove(),this._sliderContainer=n("<div></div>"),n(this._sliderContainer).attr("id",e),this._sliderContainer.addClass("oj-slider-container").addClass("oj-form-control-container"),this.element.after(this._sliderContainer),this._sliderContainer[0].style.cssText=this._styleFromInputTag},_createBarBackground:function(){var e=this._getBarBackgroundId(),t=this._elementWrapped.find("#"+e);t.length&&t.remove(),this._barback=n("<div></div>"),n(this._barback).attr("id",e),this._barback.addClass("oj-slider-bar"),this._sliderContainer.append(this._barback);var i=this;this._barback.on("mousedown"+i.eventNamespace,function(e){i._repositionThumb(e),i._mouseStop(e),i._getActiveThumb().focus()})},_buildValueOption:function(){var e=this.options;if(this._isCustomRangeSlider())null===e.value?this.options.value={start:this._valueMin(),end:this._valueMax()}:(null!==e.value.start&&void 0!==e.value.start||(this.options.value.start=this._valueMin()),null!==e.value.end&&void 0!==e.value.end||(this.options.value.end=this._valueMax()),this.option("value",this.options.value,{_context:{writeback:!0,internalSet:!0}}));else if(e.type)if(null==this.options.value)this._multipleThumbs?this.options.value=[this._valueMin(),this._valueMax()]:this.options.value=this._valueMin(),this.option("value",this.options.value,{_context:{writeback:!0,internalSet:!0}});else if(this._multipleThumbs){var t;2!==this.options.value.length&&(t=this.options.value.length>0?this.options.value[0]:this._valueMin(),this.options.value=[t,this._valueMax()],this.option("value",this.options.value,{_context:{writeback:!0,internalSet:!0}}))}},_createRange:function(){var e=this.options,t="";if(e.type){var i=this;this._range=n("<div></div>"),n(this._range).attr("id",this._getBarValueId()),this._sliderContainer.append(this._range),t="oj-slider-range oj-slider-bar-value",this._range.on("mousedown"+i.eventNamespace,function(e){i._repositionThumb(e),i._mouseStop(e),i._getActiveThumb().focus()}),this._range=this._sliderContainer.find("#"+this._getBarValueId());var s="";"fromMin"===e.type?s=" oj-slider-range-min":"fromMax"===e.type&&(s=" oj-slider-range-max"),this._range.addClass(t+s)}else this._range&&this._range.remove(),this._range=null},_setupTouch:function(e){this._touchProxy=a._TouchProxy.addTouchListeners(e)},_tearDownTouch:function(e){a._TouchProxy.removeTouchListeners(e)},_setupEvents:function(){this._CanSetValue()&&this._AddHoverable(this._elementWrapped),this._thumbs.toArray().forEach(function(e){var t=n(e);this._UnregisterChildNode(t),this._on(t,this._thumbEvents),this._setupTouch(t),this._focusable({element:t,applyHighlight:!0})},this)},_GetMessagingLauncherElement:function(){return this._elementWrapped},_GetContentElement:function(){return this._getActiveThumb()},_destroySliderDom:function(){this._thumbs.toArray().forEach(function(e){var t=n(e);this._tearDownTouch(t)},this),this._destroyDraggable(),this._range&&this._range.remove(),this._sliderContainer&&this._sliderContainer.remove(),this.OuterWrapper?(this._elementWrapped.removeUniqueId(),this._RemoveHoverable(this._elementWrapped)):(this.element.removeUniqueId(),this._RemoveHoverable(this.element))},_unwrapSlider:function(){l.unwrap(this.element,this._elementWrapped),this.element[0].style.display=this._inputElementOriginalDisplay,this._RestoreAttributes(this.element)},_destroy:function(){return this._destroySliderDom(),this._unwrapSlider(),this._super()},_repositionThumb:function(e){var t,i,s,a=this.options,r=0,l=this;return this._closestThumb=this._thumb,!(a.disabled||a.readOnly||(t={x:e.pageX,y:e.pageY},i=this._getNormValueFromMouse(t),s=this._valueMax()-this._valueMin()+1,this._multipleThumbs&&this._thumbs.each(function(e){var t=Math.abs(i-l._getMultiValues(e));(s>t||s===t&&(e===l._lastChangedValueIndex||l._getMultiValues(e)===a.min))&&(s=t,this._closestThumb=n(this),r=e)}),this._thumbIndex=r,this._closestThumb&&(this._thumbs.hasClass("ui-state-hover")||this._slide(e,r,i),this._getActiveThumb().addClass("oj-active").focus(),this._range.addClass("oj-active"),0)))},_initDragging:function(e,t){var i=this.options;return!i.disabled&&!i.readOnly&&(t.removeClass("oj-focus-highlight"),t.addClass("oj-active").focus(),this._range.addClass("oj-active"),!0)},_mouseDragInternal:function(e,t){var i=this._getNormValueFromThumb(t);this._slide(e,this._thumbIndex,i,!0);var s=100*this._getFracFromThumb(t);return this._multipleThumbs?this._setRangeMultiThumb(s,this._thumbIndex):this._setRange(s),!1},_mouseStop:function(e,t){this._thumbs.removeClass("oj-active"),this._range.removeClass("oj-active");var i=this._getNormValueFromThumb(t);return this._slide(e,this._thumbIndex,i),this._change(e,this._thumbIndex,!1),this._thumbIndex=null,!1},_isVertical:function(){return"vertical"===this.options.orientation},_getOrientationAdjustedFrac:function(e){var t=e;return t>1&&(t=1),t<0&&(t=0),this._isVertical()&&(t=1-t),t},_getNormValueFromMouse:function(e){var t,i,s=this._getFracFromMouse(e);return t=this._valueMax()-this._valueMin(),this._isRTL()&&!this._isVertical()&&(s=1-s),i=this._valueMin()+s*t,this._trimAlignValue(i)},_getFracFromMouse:function(e){var t,i,s;return this._isVertical()?(t=this._barback.height(),i=e.y-this._barback.offset().top):(t=this._barback.width(),i=e.x-this._barback.offset().left),0===t?1:(s=i/t,s=this._getOrientationAdjustedFrac(s))},_getActiveThumb:function(){return this._multipleThumbs?n(this._thumbs[this._thumbIndex?this._thumbIndex:0]):this._thumb},_getFracFromThumb:function(e){var t,i,s,a,n=e;if(e||(n=this._getActiveThumb()),this._isVertical()){var r=n.outerHeight()/2;a=n.offset().top+r,t=this._barback.height(),i=a-this._barback.offset().top}else{var l=n.outerWidth()/2;a=n.offset().left+l,t=this._barback.width(),i=a-this._barback.offset().left}return 0===t?1:(s=i/t,s=this._getOrientationAdjustedFrac(s))},_getNormValueFromThumb:function(e){var t,i,s;return t=this._getFracFromThumb(e),i=this._valueMax()-this._valueMin(),this._isRTL()&&!this._isVertical()&&(t=1-t),s=this._valueMin()+t*i,this._trimAlignValue(s)},_getOtherThumbValue:function(e){return this._getMultiValues(e?0:1)},_getNewThumbValueLimited:function(e,t,i){return this._isCustomRangeSlider()?null!==this.options.value.start&&null!==this.options.value.end&&(0===e&&t>i||1===e&&t<i)?i:t:2===this.options.value.length&&(0===e&&t>i||1===e&&t<i)?i:t},_slide:function(e,t,i,s){var a;if(this._multipleThumbs){a=this._getOtherThumbValue(t);var n=this._getNewThumbValueLimited(t,i,a);this._setMultiValue(e,t,n,s)}else this._setSingleValue(e,i,s),s||this._inputtag&&this.element.val(i)},_setSingleValue:function(e,t,i){this._newValue=this._trimAlignValue(t),this._SetRawValue(this._newValue,e),i||(this.options[this._transientValueName]=this._newValue,this._SetValue(this._newValue,e),this._updateUI())},_change:function(e,t,i){this._multipleThumbs?(this._lastChangedValues=this._getNewValues(t,this._newMultiValue[t]),this._SetRawValue(this._lastChangedValues,e),i||this._SetValue(this._lastChangedValues,e)):(this._SetRawValue(this._newValue,e),i||this._SetValue(this._newValue,e)),this._lastChangedValueIndex=t},_getNewValues:function(e,t){var i;if(this._isCustomRangeSlider())(i={}).start=this._trimAlignValue(this.options.value.start),i.end=this._trimAlignValue(this.options.value.end),e===this._thumbIndex&&(0===e&&(i.start=t),1===e&&(i.end=t));else{var s;for(i=[],i=this.options.value.slice(),s=0;s<i.length;s++)i[s]=this._trimAlignValue(i[s]);e===this._thumbIndex&&(i[e]=t)}return i},_getSingleValue:function(){return this._getValueAligned()},_getMultiValues:function(e){return this._getValuesAligned(e)},_setMultiValue:function(e,t,i,s){this._newMultiValue[t]=this._trimAlignValue(i),this._change(e,t,s),s||this._updateUI()},_NotifyAttached:function(){this._super(),this._makeDraggable()},_setOption:function(e,t,i){var s;if("value"===e)if(this._isCustomRangeSlider())if(t instanceof Object)if(this._checkStartEnd(t.start,t.end),isNaN(t.start))s=this._parse(e,t.start),this._checkValueBounds(s,this._valueMin(),this._valueMax());else{this._multipleThumbs=!0,s=t;for(var a=Object.keys(t),n=0;n<a.length;n++)this._checkValueBounds(s[a[n]],this._valueMin(),this._valueMax())}else{s={start:this._valueMin(),end:this._valueMax()},this.options.value={start:this._valueMin(),end:this._valueMax()};for(var r=Object.keys(s),l=0;l<r.length;l++)this._checkValueBounds(s[r[l]],this._valueMin(),this._valueMax())}else if(Array.isArray(t))if(isNaN(t[0]))this._multipleThumbs=!1,s=this._parse(e,t[0]),this._checkValueBounds(s,this._valueMin(),this._valueMax());else{this._multipleThumbs=!0,s=t;for(var u=0;u<s.length;u++)this._checkValueBounds(s[u],this._valueMin(),this._valueMax())}else this._multipleThumbs=!1,s=this._IsCustomElement()?t:this._parse(e,t),this._checkValueBounds(s,this._valueMin(),this._valueMax());else"max"===e||"min"===e?(s=this._IsCustomElement()?t:this._parse(e,t),"min"===e?(this._checkMinMax(s,this._valueMax()),this._multipleThumbs?(this._getMultiValues(0)<s&&(this._isCustomRangeSlider()?this._super("value",{start:s,end:this._getMultiValues(1)},i):this._super("value",[s,this._getMultiValues(1)],i)),this._getMultiValues(1)<s&&(this._isCustomRangeSlider()?this._super("value",{start:this._getMultiValues(0),end:s},i):this._super("value",[this._getMultiValues(0),s],i))):this._getSingleValue()<s&&this._super("value",s,i)):"max"===e&&(this._checkMinMax(this._valueMin(),s),this._multipleThumbs?(this._getMultiValues(0)>s&&(this._isCustomRangeSlider()?this._super("value",{start:s,end:this._getMultiValues(1)},i):this._super("value",[s,this._getMultiValues(1)],i)),this._getMultiValues(1)>s&&(this._isCustomRangeSlider()?this._super("value",{start:this._getMultiValues(0),end:s},i):this._super("value",[this._getMultiValues(0),s],i))):this._getSingleValue()>s&&this._super("value",s,i))):s="step"===e?this._parseStep(t):t;switch(this._super(e,s,i),"readOnly"===e&&(this.options.readonly=s),"disabled"===e&&(this.options.disabled=s),e){case"disabled":this._refreshThumbOptions(),this.options.disabled?this._disableDraggable():this._makeDraggable();break;case"value":this._updateUI(),this._makeDraggable();break;case"min":case"max":this._calculateNewMax(),this._updateUI(),this._makeDraggable();break;case"orientation":this._setOrientationStyles(),this._reCreate();break;case"readonly":case"step":case"type":this._reCreate();break;case"labelledBy":this._setAriaInfo()}},_reCreate:function(){this._destroySliderDom(),this._componentSetup(),this.OuterWrapper&&this._elementWrapped.addClass("oj-complete"),this._AfterCreate()},_getValueAligned:function(){var e=this.options.value;return e=this._trimAlignValue(e)},_isCustomRangeSlider:function(){return!(!this._IsCustomElement()||"OJ-RANGE-SLIDER"!==this.element[0].parentNode.tagName)},_getValuesAligned:function(e){var t,i=null;return this._isCustomRangeSlider()?(t=0===e?void 0!==this.options.value.start&&null!==this.options.value.start?this.options.value.start:this._valueMin():void 0!==this.options.value.end&&null!==this.options.value.end?this.options.value.end:this._valueMax(),i=this._trimAlignValue(t)):i=this._trimAlignValue(this.options.value[e]),i},_trimAlignValue:function(e){if(e<=this._valueMin())return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,i=(e-this._valueMin())%t,s=e-i;return 2*Math.abs(i)>=t&&(s+=i>0?t:-t),parseFloat(s.toFixed(5))},_calculateNewMax:function(){var e=this._valueMin();if((this.options.max-e)/this.options.step%1!=0){var t=(this.options.max-e)%this.options.step;this.max=this.options.max-t+this.options.step}else this.max=this.options.max},_valueMin:function(){return this.options.min},_valueMax:function(){return this.max},_getGrid:function(){var e;e=this.options.step>0?(this._valueMax()-this._valueMin())/this.options.step:100;var t=(this._isVertical()?this._barback.height():this._barback.width())/e;return t<1&&(t=1),this._isVertical()?[1,t]:[t,1]},_getThumbsValueFrac:function(e){return(this._getMultiValues(e)-this._valueMin())/(this._valueMax()-this._valueMin())},_updateUI:function(){var e,t,i,s,a,r;this._multipleThumbs?(this._thumbs.toArray().forEach(function(t,l){var u=n(t);e=100*this._getThumbsValueFrac(l),this._isRTL()&&!this._isVertical()&&(e=100-e),this._isVertical()?u.css({top:100-e+"%"}):u.css({left:e+"%"}),0===l?(a=u,100===e?u.css({zIndex:1}):u.css({zIndex:""})):r=u,u.hasClass("oj-active")||(u.attr("aria-valuenow",this._getMultiValues(l)),u.attr("aria-valuemin",i),u.attr("aria-valuemax",s)),this._setRangeMultiThumb(e,l)},this),a.hasClass("oj-focus")&&(a.css({zIndex:1}),r.css({zIndex:""})),r.hasClass("oj-focus")&&(a.css({zIndex:""}),r.css({zIndex:1}))):(t=this._getValueAligned(),i=this._valueMin(),s=this._valueMax(),e=s!==i?(t-i)/(s-i)*100:0,this._isRTL()&&!this._isVertical()&&(e=100-e),this._isVertical()?this._thumb.css({top:100-e+"%"}):this._thumb.css({left:e+"%"}),n(this._thumb).hasClass("oj-active")||(n(this._thumb).attr("aria-valuenow",t),n(this._thumb).attr("aria-valuemin",i),n(this._thumb).attr("aria-valuemax",s)),this._setRange(e))},_setRange:function(e){var t=this.options.type;this._isVertical()?("fromMin"===t&&this._range.css({height:e+"%"}),"fromMax"===t&&this._range.css({height:100-e+"%"})):this._isRTL()?("fromMin"===t&&this._range.css({width:100-e+"%"}),"fromMax"===t&&this._range.css({width:e+"%"})):("fromMin"===t&&this._range.css({width:e+"%"}),"fromMax"===t&&this._range.css({width:100-e+"%"}))},_setRangeMultiThumb:function(e,t){var i=this._range.attr("id");if(0===t){var s=100*this._getThumbsValueFrac(1);switch(this.options.type){case"fromMin":this._isVertical()?this._range.css({height:e+"%"}):this._range.css({width:e+"%"});break;case"range":this._isVertical()?(this._range.css({top:100-s+"%"}),this._range.css({height:s-e+"%"})):this._isRTL()?(this._range.css({left:100-s+"%"}),this._range.css({width:s-(100-e)+"%"})):(this._range.css({left:e+"%"}),this._range.css({width:s-e+"%"}))}}else{var a=100*this._getThumbsValueFrac(0);switch(this.options.type){case"fromMax":this._isVertical()?this._range.css({height:100-e+"%"}):this._range.css({width:100-e+"%"});break;case"range":if(this._isVertical())document.getElementById(i)&&(this._range.css({top:100-e+"%"}),this._range.css({height:e-a+"%"}));else if(this._isRTL())document.getElementById(i)&&(this._range.css({left:e+"%"}),this._range.css({width:100-e-a+"%"}));else if(document.getElementById(i)){var n=parseInt(document.getElementById(i).style.left,10);this._range.css({width:e-n+"%"})}}}},_thumbEvents:{keydown:function(e){var t,i,s,a,r=n(e.target).data("oj-slider-thumb-index");switch(this._thumbIndex=r,e.keyCode){case n.ui.keyCode.HOME:case n.ui.keyCode.END:case n.ui.keyCode.PAGE_UP:case n.ui.keyCode.PAGE_DOWN:case n.ui.keyCode.UP:case n.ui.keyCode.RIGHT:case n.ui.keyCode.DOWN:case n.ui.keyCode.LEFT:e.preventDefault(),n(e.target).addClass("oj-active")}switch(s=this.options.step,t=i=this._multipleThumbs?this._getMultiValues(r):this._getSingleValue(),e.keyCode){case n.ui.keyCode.HOME:i=this._valueMin();break;case n.ui.keyCode.END:i=this._valueMax();break;case n.ui.keyCode.PAGE_UP:i=this._trimAlignValue(t+(this._valueMax()-this._valueMin())/this._numPages);break;case n.ui.keyCode.PAGE_DOWN:i=this._trimAlignValue(t-(this._valueMax()-this._valueMin())/this._numPages);break;case n.ui.keyCode.UP:if(t===this._valueMax())return;a=t+s,i=this._trimAlignValue(a);break;case n.ui.keyCode.RIGHT:if(!this._isRTL()||this._isVertical()){if(t===this._valueMax())return;a=t+s}else{if(t===this._valueMin())return;a=t-s}i=this._trimAlignValue(a);break;case n.ui.keyCode.DOWN:if(t===this._valueMin())return;a=t-s,i=this._trimAlignValue(a);break;case n.ui.keyCode.LEFT:if(!this._isRTL()||this._isVertical()){if(t===this._valueMin())return;a=t-s}else{if(t===this._valueMax())return;a=t+s}i=this._trimAlignValue(a)}this._slide(e,r,i)},keyup:function(e){switch(e.keyCode){case n.ui.keyCode.HOME:case n.ui.keyCode.END:case n.ui.keyCode.PAGE_UP:case n.ui.keyCode.PAGE_DOWN:case n.ui.keyCode.UP:case n.ui.keyCode.RIGHT:case n.ui.keyCode.DOWN:case n.ui.keyCode.LEFT:var t=n(e.target).data("oj-slider-thumb-index");this._thumbIndex=t,this._change(e,t,!1),n(e.target).removeClass("oj-active"),this._updateUI(!0),this._thumbIndex=null}}},_InitOptions:function(e,i){var s=this.options,a=this;this._superApply(arguments);var n=[{attribute:"disabled",validateOption:!0},{attribute:"value"},{attribute:"title"},{attribute:"min"},{attribute:"max"},{attribute:"step"}];if(!this._IsCustomElement()&&(t.EditableValueUtils.initializeOptionsFromDom(n,i,this,function(e){for(var t=e,i=["value","step","min","max"],n=0;n<i.length;n++){var r=i[n],l=r in t?t[r]:s[r];null!=l&&("step"===r?t[r]=a._parseStep(l):"min"===r||"max"===r?t[r]=a._parse(r,l):"value"===r&&(Array.isArray(l)?t[r]=l:t[r]=a._parse(r,l)))}}),void 0===s.value))throw new Error(this.getTranslatedString("noValue"));if(this._isCustomRangeSlider()&&this._checkStartEnd(s.value.start,s.value.end),this._checkMinMax(s.min,s.max),Array.isArray(s.value))for(var r=0;r<s.value.length;r+=1)this._checkValueBounds(s.value[r],s.min,s.max);else this._checkValueBounds(s.value,s.min,s.max)},_checkValueBounds:function(e,t,i){if(null!=t&&e<t)throw new Error(this.getTranslatedString("valueRange"));if(null!=i&&e>i)throw new Error(this.getTranslatedString("valueRange"))},_checkMinMax:function(e,t){if(null!=e&&null!=t&&e>=t)throw new Error(this.getTranslatedString("maxMin"))},_checkStartEnd:function(e,t){if(null!=e&&null!=t&&e>t)throw new Error(this.getTranslatedString("startEnd"))},getNodeBySubId:function(e){if(null==e)return this.element?this.element[0]:null;var t=e.subId;return"oj-slider-thumb-0"===t?this.widget().find(".oj-slider-thumb")[0]:"oj-slider-thumb-1"===t?this.widget().find(".oj-slider-thumb")[1]:"oj-slider-bar"===t||"oj-slider-bar-value"===t?this.widget().find("."+t)[0]:null},getSubIdByNode:function(e){if(null!=e){if(e.id===this._getThumbId(0)&&n(e).hasClass("oj-slider-thumb"))return{subId:"oj-slider-thumb-0"};if(e.id===this._getThumbId(1)&&n(e).hasClass("oj-slider-thumb"))return{subId:"oj-slider-thumb-1"};if(n(e).hasClass("oj-slider-bar"))return{subId:"oj-slider-bar"};if(n(e).hasClass("oj-slider-bar-value"))return{subId:"oj-slider-bar-value"}}return null},_GetDefaultStyleClass:function(){return"oj-slider"},_parse:function(e,t){var i;if(i=null!==t?+t:t,isNaN(i))throw new Error(this.getTranslatedString("optionNum",{option:e}));return i},_parseStep:function(e){var t;if(null===e)return 1;if((t=this._parse("step",e))<=0)throw new Error(this.getTranslatedString("invalidStep"));return(null===t||t<=0)&&(t=1),t},_getEndInterval:function(){return this._barback.offset().left+this._barback.width()},_getStartInterval:function(){return this._barback.offset().left},_callDraggable:function(e){var t,i=this._getGrid(),s=e[0].style;t=this._isVertical()?"y":"x";var a=this;e.draggable({axis:t,grid:i,disabled:!1,start:function(t){e[0]===n(a._thumbs)[0]?a._thumbIndex=0:e[0]===n(a._thumbs)[1]&&(a._thumbIndex=1),a._initDragging(t,e)},drag:function(t,i){var r=i.position;if(a._isVertical()?(s.left="",r.left=""):(s.top="",r.top=""),a._mouseDragInternal(t,e),a._isVertical()?(r.top<0&&(r.top=0),r.top>a._barback.height()&&(r.top=a._barback.height())):(r.left<0&&(r.left=0),r.left>a._barback.width()&&(r.left=a._barback.width())),a._multipleThumbs){var l,u;if(l=0===a._thumbIndex?n(a._thumbs[1]):n(a._thumbs[0]),a._isVertical()){var h=e.outerHeight()/2,o=a._barback.offsetParent().offset().top;u=l.offset().top+h-o}else{var _=e.outerWidth()/2,d=a._barback.offsetParent().offset().left;u=l.offset().left+_-d}0===a._thumbIndex?a._isVertical()?r.top<u&&(r.top=u):a._isRTL()?r.left<u&&(r.left=u):r.left>u&&(r.left=u):a._isVertical()?r.top>u&&(r.top=u):a._isRTL()?r.left>u&&(r.left=u):r.left<u&&(r.left=u)}},stop:function(t){this.style.width="",this.style.height="",a._mouseStop(t,e)}})},_makeDraggable:function(){this.options.disabled||(this._multipleThumbs?this._thumbs.toArray().forEach(function(e){var t=n(e);this._callDraggable(t)},this):this._callDraggable(this._thumb))},_disableDraggable:function(){this._multipleThumbs?this._thumbs.toArray().forEach(function(e){var t=n(e);t.is(".ui-draggable")&&t.draggable("disable")},this):this._thumb.is(".ui-draggable")&&this._thumb.draggable("disable")},_destroyDraggable:function(){this._multipleThumbs?this._thumbs.toArray().forEach(function(e){var t=n(e);t.is(".ui-draggable")&&t.draggable("destroy")},this):this._thumb.is(".ui-draggable")&&this._thumb.draggable("destroy")}})});
//# sourceMappingURL=ojslider.js.map