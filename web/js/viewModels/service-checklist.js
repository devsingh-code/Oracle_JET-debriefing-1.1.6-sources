"use strict";define(["knockout","utils/dom","ojs/ojarraydataprovider","ojs/ojlistview","ojs/ojbutton"],function(t,e,i){return function(){return new class{listallAssets(e){var s=1;this.allAssetData=[];const a=e.inventoryList;console;for(const[t,i]of Object.entries(a)){var n=null!=e.activity.masterActivityId?e.activity.masterActivityId:"";if("customer"==i.invpool&&i.inv_aid==e.activity.aid||"customer"==i.invpool&&i.inv_aid==n){i.invId,i.osc_asset_id,null!=i.inv_capacity&&i.inv_capacity.length>0&&i.inv_capacity;var o=null!=i.model_name&&i.model_name.length>0?i.model_name:"",l=(null!=e.activity.activity_organization&&e.activity.activity_organization.length>0&&e.activity.activity_organization,null!=i.inv_floor&&i.inv_floor.length>0?i.inv_floor:"NA"),r=null!=i.inv_room&&i.inv_room.length>0?i.inv_room:"NA",c=null!=i.inv_block&&i.inv_block.length>0?i.inv_block:"NA",v=null!=i.inv_type&&i.inv_type.length>0?i.inv_type:"",_=(null!=i.inv_visitNumber&&i.inv_visitNumber.length>0&&i.inv_visitNumber,null!=i.inv_number&&i.inv_number.length>0?i.inv_number:"NA"),h=null!=i.invsn&&i.invsn.length>0?i.invsn:"",u=null!=i.issue_type&&i.issue_type.length>0?i.issue_type:"NA",y=null!=i.inv_service_type&&i.inv_service_type.length>0?i.inv_service_type:"NA",m=null!=i.asset_remarks&&i.asset_remarks.length>0?i.asset_remarks:"NA",d=null!=i.warranty&&i.warranty.length>0?i.warranty:"NA";d="yes"==d?"Active":"Expired",1!=i.asset_verified?this.assetClass="demo-centering-box-red":1!=i.service_checklist_completed?this.assetClass="demo-centering-box-yellow":this.assetClass="demo-centering-box-green",0==this.allAssetData.length?this.allAssetData=[{model:o,serialNo:h,wStatus:d,block:c,floor:l,room:r,machineNo:_,assetType:v,issueType:u,serviceType:y,remarks:m,count:s}]:this.allAssetData.push({model:o,serialNo:h,wStatus:d,block:c,floor:l,room:r,machineNo:_,assetType:v,issueType:u,serviceType:y,remarks:m,count:s}),s++}}"Preventive Maintenance"!=e.activity.aworktype&&(this.allAssetsDataProvider=t.observable(new i(this.allAssetData,{keyAttributes:"serialNo"})))}handleActivated(e){this._controller=e.valueAccessor().params.app,this.ofscData=this._controller.openData(),console.log(this.ofscData),this.count=t.observable(),this.listallAssets(this.ofscData),this.assetData=[{account:null!=this.ofscData.activity.activity_organization&&this.ofscData.activity.activity_organization.length>0?this.ofscData.activity.activity_organization:"",site:null!=this.ofscData.activity.caddress&&this.ofscData.activity.caddress.length>0?this.ofscData.activity.caddress:"",refno:null!=this.ofscData.activity.reference_number&&this.ofscData.activity.reference_number.length>0?this.ofscData.activity.reference_number:""}],this.assetDataProvider=t.observable(new i(this.assetData,{keyAttributes:"account"}))}dismiss(){this._controller.router.go("dashboard",{historyUpdate:"replace"})}}}});