"use strict";define(["knockout","utils/dom","ojs/ojarraydataprovider","ojs/ojlistview","ojs/ojbutton"],function(e,t,s){return function(){return this.mainSectionClass=e.observable(),new class{createId(e,t){var s=[];return s.assetDetailsId="assetMappingBtn_"+e+"_"+t,s.serviceCheckListId="nextButton_"+e+"_"+t,s.prevHistoryId="prevHistoryDiv_"+e+"_"+t,s}listallAssets(t){var i=1;this.allAssetData=[];const a=t.inventoryList;console;for(const[e,s]of Object.entries(a)){var n=null!=t.activity.masterActivityId?t.activity.masterActivityId:"";if("customer"==s.invpool&&s.inv_aid==t.activity.aid||"customer"==s.invpool&&s.inv_aid==n){var r=s.invid,o=s.osc_asset_id,l=(null!=s.inv_capacity&&s.inv_capacity.length>0&&s.inv_capacity,null!=s.model_name&&s.model_name.length>0?s.model_name:""),c=(null!=t.activity.activity_organization&&t.activity.activity_organization.length>0&&t.activity.activity_organization,null!=s.inv_floor&&s.inv_floor.length>0?s.inv_floor:"NA"),v=null!=s.inv_room&&s.inv_room.length>0?s.inv_room:"NA",h=null!=s.inv_block&&s.inv_block.length>0?s.inv_block:"NA",u=null!=s.inv_type&&s.inv_type.length>0?s.inv_type:"",d=(null!=s.inv_visitNumber&&s.inv_visitNumber.length>0&&s.inv_visitNumber,null!=s.inv_number&&s.inv_number.length>0?s.inv_number:"NA"),b=null!=s.invsn&&s.invsn.length>0?s.invsn:"",y=null!=s.issue_type&&s.issue_type.length>0?s.issue_type:"NA",_=null!=s.inv_service_type&&s.inv_service_type.length>0?s.inv_service_type:"NA",p=null!=s.asset_remarks&&s.asset_remarks.length>0?s.asset_remarks:"NA",m=null!=s.warranty&&s.warranty.length>0?s.warranty:"NA";m="yes"==m?"Active":"Expired",1!=s.asset_verified?1!=s.service_checklist_completed&&(this.assetClass="demo-centering-box-red"):1!=s.service_checklist_completed?this.assetClass="demo-centering-box-yellow":this.assetClass="demo-centering-box-green";var D=this.createId(r,o);0==this.allAssetData.length?this.allAssetData=[{model:l,serialNo:b,wStatus:m,block:h,floor:c,room:v,machineNo:d,assetType:u,issueType:y,serviceType:_,remarks:p,count:i,assetMappingButtonId:D.assetDetailsId,serviceCheckListButtonId:D.serviceCheckListButtonId,serviceCheckListHistoryId:D.prevHistoryId}]:this.allAssetData.push({model:l,serialNo:b,wStatus:m,block:h,floor:c,room:v,machineNo:d,assetType:u,issueType:y,serviceType:_,remarks:p,count:i,assetMappingButtonId:D.assetDetailsId,serviceCheckListButtonId:D.serviceCheckListButtonId,serviceCheckListHistoryId:D.prevHistoryId}),i++}}"Preventive Maintenance"!=t.activity.aworktype&&(this.allAssetsDataProvider=e.observable(new s(this.allAssetData,{keyAttributes:"serialNo"})))}assetMapping(e,t,s){}handleActivated(t){this._controller=t.valueAccessor().params.app,this.ofscData=this._controller.openData(),console.log(this.ofscData),this.count=e.observable(),this.listallAssets(this.ofscData),this.assetData=[{account:null!=this.ofscData.activity.activity_organization&&this.ofscData.activity.activity_organization.length>0?this.ofscData.activity.activity_organization:"",site:null!=this.ofscData.activity.caddress&&this.ofscData.activity.caddress.length>0?this.ofscData.activity.caddress:"",refno:null!=this.ofscData.activity.reference_number&&this.ofscData.activity.reference_number.length>0?this.ofscData.activity.reference_number:""}],this.assetDataProvider=e.observable(new s(this.assetData,{keyAttributes:"account"}))}handleAttached(t){console.log("Page is Loaded "),this._controller=t.valueAccessor().params.app,this.ofscData=this._controller.openData(),console.log(this.ofscData),this._doc=document.getElementById("mainSectionPanel"),this._assetDoc=document.getElementById("assetVerifySectionPanel"),this.assetButtonAction=function(e){this._doc.classList.add("ishidden"),this._assetDoc.classList.remove("ishidden");var t=this.target.id,s=t.split("_"),i=s[1],a=s[2];this.assetMapping(i,a,this.ofscData)}.bind(this),this.warrantyValue=e.observable(),this.isWarrantyDisabled=e.observable(!1),this.inputWarrantyDataProvider=e.observable(new s([],{keyAttributes:"value"})),this.inputBrandDataProvider=e.observable(new s([],{keyAttributes:"value"})),this.inputTypeDataProvider=e.observable(new s([],{keyAttributes:"value"})),this.inputModelDataProvider=e.observable(new s([],{keyAttributes:"value"})),this.inputSucDateValue=e.observable(),this.isSucDateDisabled=e.observable(!1),this.inputDeliveryDateValue=e.observable(),this.isDeliverDateDisabled=e.observable(!1),this.modelValue=e.observable(),this.isModelDisabled=e.observable(!1),this.typeValue=e.observable(),this.isTypeDisabled=e.observable(!1),this.brandValue=e.observable(),this.isBrandDisabled=e.observable(!1),this.serialNumberValue=e.observable(),this.isSerialNumberDisabled=e.observable(!1),this.assetTagNumberValue=e.observable(),this.isAssetNumberDisabled=e.observable(!1)}dismiss(){this._controller.router.go("dashboard",{historyUpdate:"replace"})}}}});