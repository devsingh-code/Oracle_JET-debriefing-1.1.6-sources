"use strict";
define([
  "knockout",
  "utils/dom",
  // non-referenced:
  "ojs/ojarraydataprovider",
  "ojs/ojmutablearraydataprovider",
  "ojs/ojlistview",
  "ojs/ojbutton",
  "ojs/ojtable"
], function (ko, dom, ArrayDataProvider, MutableArrayDataProvider) {
  var globalArray;
  let constructScreen = function () {
    this.mainSectionClass = ko.observable();
    return new serviceCheckListViewModel();
  };
  class serviceCheckListViewModel {
    // this.assetButtonAction = function(event){

    // }

    async fetchData(endPointURL) {
      const api_url = endPointURL;
      let dataFromService;
      try {
        const response = await fetch(api_url);
        if (!response.ok) throw Error(response.message);
        dataFromService = await response.data;
      } catch (error) {
        throw Error(response.message);
      }
      return dataFromService;
    }

    initializeobservables() {
      this.remarksValue = ko.observable();
      this.warrantyValue = ko.observable();
      this.isWarrantyDisabled = ko.observable(true);

      this.inputWarrantyDataProvider = ko.observable(
        new ArrayDataProvider([], {
          keyAttributes: "value"
        })
      );
      this.inputBrandDataProvider = ko.observable(
        new ArrayDataProvider([], {
          keyAttributes: "value"
        })
      );
      this.inputTypeDataProvider = ko.observable(
        new ArrayDataProvider([], {
          keyAttributes: "value"
        })
      );
      this.inputModelDataProvider = ko.observable(
        new ArrayDataProvider([], {
          keyAttributes: "value"
        })
      );

      this.warrantyDataProvider = ko.observable(new ArrayDataProvider([], { keyAttributes: "type" }));

      this.inputSucDateValue = ko.observable();
      this.isSucDateDisabled = ko.observable(false);
      this.inputDeliveryDateValue = ko.observable();
      this.isDeliverDateDisabled = ko.observable(false);
      this.modelValue = ko.observable();
      this.isModelDisabled = ko.observable(false);
      this.typeValue = ko.observable();
      this.isTypeDisabled = ko.observable(false);
      this.brandValue = ko.observable();
      this.isBrandDisabled = ko.observable(false);
      this.serialNumberValue = ko.observable();
      this.isSerialNumberDisabled = ko.observable(true);
      this.assetTagNumberValue = ko.observable();
      this.isAssetNumberDisabled = ko.observable(true);
    }

    createId(invId, oscAssetId) {
      var idArray = [];
      idArray["assetDetailsId"] = "assetMappingBtn_" + invId + "_" + oscAssetId;
      idArray["serviceCheckListId"] = "nextButton_" + invId + "_" + oscAssetId;
      idArray["prevHistoryId"] = "prevHistoryDiv_" + invId + "_" + oscAssetId;

      return idArray;
    }

    listallAssets(ofscData) {
      var count = 1;
      var validation = false;
      var assetHtml = "";
      this.allAssetData = [];
      this.allAssetsDataProvider = ko.observable(
        new ArrayDataProvider([], {
          keyAttributes: "serialNo"
        })
      );

      const inventoryList = ofscData.inventoryList;
      console;
      for (const [key, value] of Object.entries(inventoryList)) {
        var masterAid = ofscData.activity.masterActivityId != null ? ofscData.activity.masterActivityId : "";
        if (
          (value.invpool == "customer" && value.inv_aid == ofscData.activity.aid) ||
          (value.invpool == "customer" && value.inv_aid == masterAid)
        ) {
          var invId = value.invid;
          // globalArray["selected_part_for_" + value.invid] = [];
          // globalArray["requested_part_for_" + value.invid] = [];
          var oscAssetId = value.osc_asset_id;
          var invCapacity = value.inv_capacity != null && value.inv_capacity.length > 0 ? value.inv_capacity : "";
          var invModelName = value.model_name != null && value.model_name.length > 0 ? value.model_name : "";
          var invOrg =
            ofscData.activity.activity_organization != null && ofscData.activity.activity_organization.length > 0
              ? ofscData.activity.activity_organization
              : "";
          var invfloor = value.inv_floor != null && value.inv_floor.length > 0 ? value.inv_floor : "NA";
          var invRoom = value.inv_room != null && value.inv_room.length > 0 ? value.inv_room : "NA";
          var invBlock = value.inv_block != null && value.inv_block.length > 0 ? value.inv_block : "NA";
          var invType = value.inv_type != null && value.inv_type.length > 0 ? value.inv_type : "";
          var invVisit =
            value.inv_visitNumber != null && value.inv_visitNumber.length > 0 ? value.inv_visitNumber : "NA";
          var invNumber = value.inv_number != null && value.inv_number.length > 0 ? value.inv_number : "NA";
          var invSerialNumber = value.invsn != null && value.invsn.length > 0 ? value.invsn : "";
          var invIssueType = value.issue_type != null && value.issue_type.length > 0 ? value.issue_type : "NA";
          var invServiceType =
            value.inv_service_type != null && value.inv_service_type.length > 0 ? value.inv_service_type : "NA";
          var invRemarks = value.asset_remarks != null && value.asset_remarks.length > 0 ? value.asset_remarks : "NA";
          var warrantyStatus = value.warranty != null && value.warranty.length > 0 ? value.warranty : "NA";
          if (warrantyStatus == "yes") {
            warrantyStatus = "Active";
          } else {
            warrantyStatus = "Expired";
          }

          //setting color code for counter-start
          if (value.asset_verified != 1) {
            if (value.service_checklist_completed != 1) {
              this.assetClass = "demo-centering-box-red";
            }
          } else if (value.service_checklist_completed != 1) {
            this.assetClass = "demo-centering-box-yellow";
          } else {
            this.assetClass = "demo-centering-box-green";
          }

          var idArray = this.createId(invId, oscAssetId);

          if (this.allAssetData.length == 0) {
            this.allAssetData = [
              {
                model: invModelName,
                serialNo: invSerialNumber,
                wStatus: warrantyStatus,
                block: invBlock,
                floor: invfloor,
                room: invRoom,
                machineNo: invNumber,
                assetType: invType,
                issueType: invIssueType,
                serviceType: invServiceType,
                remarks: invRemarks,
                count: count,
                assetMappingButtonId: idArray.assetDetailsId,
                serviceCheckListButtonId: idArray.serviceCheckListButtonId,
                serviceCheckListHistoryId: idArray.prevHistoryId
              }
            ];
          } else {
            this.allAssetData.push({
              model: invModelName,
              serialNo: invSerialNumber,
              wStatus: warrantyStatus,
              block: invBlock,
              floor: invfloor,
              room: invRoom,
              machineNo: invNumber,
              assetType: invType,
              issueType: invIssueType,
              serviceType: invServiceType,
              remarks: invRemarks,
              count: count,
              assetMappingButtonId: idArray.assetDetailsId,
              serviceCheckListButtonId: idArray.serviceCheckListButtonId,
              serviceCheckListHistoryId: idArray.prevHistoryId
            });
          }

          count++;
        }
      }
      if (ofscData.activity.aworktype != "Preventive Maintenance") {
        this.allAssetsDataProvider(
          new ArrayDataProvider(this.allAssetData, {
            keyAttributes: "serialNo"
          })
        );
      }
    }

    assetMapping(invId, oscAssetId, ofscData) {
      var invId = invId;

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      var today = year + "-" + month + "-" + day;

      var invOrg =
        ofscData.activity.activity_organization != null && ofscData.activity.activity_organization.length > 0
          ? ofscData.activity.activity_organization
          : "";
      var invProject =
        ofscData.activity.project != null && ofscData.activity.project.length > 0 ? ofscData.activity.project : "";
      var invSite =
        ofscData.activity.caddress != null && ofscData.activity.caddress.length > 0 ? ofscData.activity.caddress : "";
      var invReferenceNum =
        ofscData.activity.reference_number != null && ofscData.activity.reference_number.length > 0
          ? ofscData.activity.reference_number
          : "";

      var invSite =
        ofscData.activity.caddress != null && ofscData.activity.caddress.length > 0 ? ofscData.activity.caddress : "";

      var invModelName =
        ofscData.inventoryList[invId].model_name != null && ofscData.inventoryList[invId].model_name.length > 0
          ? ofscData.inventoryList[invId].model_name
          : "";
      var invType =
        ofscData.inventoryList[invId].inv_type != null && ofscData.inventoryList[invId].inv_type.length > 0
          ? ofscData.inventoryList[invId].inv_type
          : ""; //escalator or elevator
      var invBlock =
        ofscData.inventoryList[invId].inv_block != null && ofscData.inventoryList[invId].inv_block.length > 0
          ? ofscData.inventoryList[invId].inv_block
          : "";
      var invFloor =
        ofscData.inventoryList[invId].inv_floor != null && ofscData.inventoryList[invId].inv_floor.length > 0
          ? ofscData.inventoryList[invId].inv_floor
          : "";
      var invNumber =
        ofscData.inventoryList[invId].inv_number != null && ofscData.inventoryList[invId].inv_number.length > 0
          ? ofscData.inventoryList[invId].inv_number
          : "";
      var invSerialNumber =
        ofscData.inventoryList[invId].invsn != null && ofscData.inventoryList[invId].invsn.length > 0
          ? ofscData.inventoryList[invId].invsn
          : "";
      var invBrand =
        ofscData.inventoryList[invId].brand != null && ofscData.inventoryList[invId].brand.length > 0
          ? ofscData.inventoryList[invId].brand
          : "";
      var invCapacity =
        ofscData.inventoryList[invId].capacity != null && ofscData.inventoryList[invId].capacity.length > 0
          ? ofscData.inventoryList[invId].capacity
          : "";
      var DeliveryDate =
        ofscData.inventoryList[invId].delivery_date != null && ofscData.inventoryList[invId].delivery_date.length > 0
          ? ofscData.inventoryList[invId].delivery_date
          : "";
      var sucDate =
        ofscData.inventoryList[invId].suc_date != null && ofscData.inventoryList[invId].suc_date.length > 0
          ? ofscData.inventoryList[invId].suc_date
          : "";
      var acType =
        ofscData.inventoryList[invId].type != null && ofscData.inventoryList[invId].type.length > 0
          ? ofscData.inventoryList[invId].type
          : "";
      var warrantyStatus =
        ofscData.inventoryList[invId].warranty != null && ofscData.inventoryList[invId].warranty.length > 0
          ? ofscData.inventoryList[invId].warranty
          : "";
      var invIssueType =
        ofscData.inventoryList[invId].issue_type != null && ofscData.inventoryList[invId].issue_type.length > 0
          ? ofscData.inventoryList[invId].issue_type
          : "";
      var invServiceType =
        ofscData.inventoryList[invId].inv_service_type != null &&
        ofscData.inventoryList[invId].inv_service_type.length > 0
          ? ofscData.inventoryList[invId].inv_service_type
          : "NA";
      var invRemarks =
        ofscData.inventoryList[invId].asset_remarks != null && ofscData.inventoryList[invId].asset_remarks.length > 0
          ? ofscData.inventoryList[invId].asset_remarks
          : "";
      var warrantyStart =
        ofscData.inventoryList[invId].warranty_start_date != null &&
        ofscData.inventoryList[invId].warranty_start_date.length > 0
          ? ofscData.inventoryList[invId].warranty_start_date
          : "";
      var warrantyEnd =
        ofscData.inventoryList[invId].warranty_end_date != null &&
        ofscData.inventoryList[invId].warranty_end_date.length > 0
          ? ofscData.inventoryList[invId].warranty_end_date
          : "";
      var warrantyInfo =
        ofscData.inventoryList[invId].inv_warranty_info != null &&
        ofscData.inventoryList[invId].inv_warranty_info.length > 0
          ? ofscData.inventoryList[invId].inv_warranty_info
          : "";
      var assetTagnumber =
        ofscData.inventoryList[invId].inv_number != null && ofscData.inventoryList[invId].inv_number.length > 0
          ? ofscData.inventoryList[invId].inv_number
          : "";

      this.serialNumberValue(invSerialNumber);
      this.assetTagNumberValue(assetTagnumber);
      this.brandArray = [
        {
          value: invBrand ? invBrand : "Select Brand",
          label: invBrand ? invBrand : "Select Brand"
        }
      ];
      this.typeArray = [
        {
          value: invType ? invType : "Select Type",
          label: invType ? invType : "Select Type"
        }
      ];
      this.modelArray = [
        {
          value: invModelName ? invModelName : "Select Model",
          label: invModelName ? invModelName : "Select Model"
        }
      ];
      this.warrantyArray = [
        {
          value: warrantyStatus ? warrantyStatus : "Select Warranty",
          label: warrantyStatus ? warrantyStatus : "Select Warranty"
        },
        {
          value: "Not in wARRANTY",
          label: "No warranty"
        }
      ];

      this.inputBrandDataProvider = ko.observable(
        new ArrayDataProvider(this.brandArray, {
          keyAttributes: "value"
        })
      );

      this.inputTypeDataProvider(
        new ArrayDataProvider(this.typeArray, {
          keyAttributes: "value"
        })
      );

      this.inputModelDataProvider(
        new ArrayDataProvider(this.modelArray, {
          keyAttributes: "value"
        })
      );

      this.inputWarrantyDataProvider(
        new ArrayDataProvider(this.warrantyArray, {
          keyAttributes: "value"
        })
      );

      if (DeliveryDate != "") {
        this.inputDeliveryDateValue(DeliveryDate);
        this.isDeliverDateDisabled(true);
      }
      if (sucDate != "") {
        this.inputSucDateValue(sucDate);
        this.isSucDateDisabled(true);
      }

      this.generateWarrantyTable(invId, warrantyInfo, ofscData);
      if (ofscData.inventoryList[invId].asset_shutdown == 1) {
        this.assetShutdownValue = ko.observableArray([1]);
      } else {
        this.assetShutdownValue = ko.observableArray([]);
      }
    }

    generateWarrantyTable(invId, warrantyInfo, ofscData) {
      var substring = "NaN";
      this.warrantyData = [];

      if (warrantyInfo != "") {
        var warrantyObj = JSON.parse(warrantyInfo);
        if (ofscData.inventoryList[invId].brand == "Carrier" || ofscData.inventoryList[invId].brand == "Toshiba") {
          if (warrantyObj.warranty.length > 0) {
            for (const [key, value] of Object.entries(warrantyObj.warranty)) {
              var date = new Date(value.w_start);
              var date = new Date(value.w_start);
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getUTCFullYear().toString().substr(-2);
              if (month < 10) month = "0" + month;
              if (day < 10) day = "0" + day;
              var w_start = month + "/" + day + "/" + year;
              if (w_start.includes(substring)) {
                //alert("NaN");
                w_start = "Not Available";
              }
              var date = new Date(value.w_end);
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getUTCFullYear().toString().substr(-2);
              if (month < 10) month = "0" + month;
              if (day < 10) day = "0" + day;
              var w_end = month + "/" + day + "/" + year;
              if (w_end.includes(substring)) {
                //alert("NaN");
                w_end = "Not Available";
              }
              var wStartEnd = w_start + " - " + w_end;

              var date = new Date(value.c_end);
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getUTCFullYear().toString().substr(-2);
              if (month < 10) month = "0" + month;
              if (day < 10) day = "0" + day;
              var c_end = month + "/" + day + "/" + year;
              //alert(typeof(c_end));

              if (c_end.includes(substring)) {
                //alert("NaN");
                c_end = "Not Available";
              }
              if (this.warrantyData.length == 0) {
                this.warrantyData = [
                  {
                    type: value.type,
                    startEnd: wStartEnd,
                    compEnd: c_end
                  }
                ];
              } else {
                this.warrantyData.push({
                  type: value.type,
                  startEnd: wStartEnd,
                  compEnd: c_end
                });
              }
            }
            this.warrantyDataProvider(new ArrayDataProvider(this.warrantyData, { keyAttributes: "type" }));
          } else {
            console.log("Add section for warranty not available");
          }
        }
      }
    }

    handleActivated(info) {
      this._controller = info.valueAccessor().params.app;

      //OFSC receiveddata from Plugin
      this.ofscData = this._controller.openData();
      console.log(this.ofscData);

      this.count = ko.observable();
      //function call to list main asset details
      this.listallAssets(this.ofscData);

      // To set asset bar details on top
      this.assetData = [
        {
          account:
            this.ofscData.activity.activity_organization != null &&
            this.ofscData.activity.activity_organization.length > 0
              ? this.ofscData.activity.activity_organization
              : "",
          site:
            this.ofscData.activity.caddress != null && this.ofscData.activity.caddress.length > 0
              ? this.ofscData.activity.caddress
              : "",
          refno:
            this.ofscData.activity.reference_number != null && this.ofscData.activity.reference_number.length > 0
              ? this.ofscData.activity.reference_number
              : ""
        }
      ];
      this.assetDataProvider = ko.observable(
        new ArrayDataProvider(this.assetData, {
          keyAttributes: "account"
        })
      );
    }

    handleAttached(info) {
      var assetId = "";
      console.log("Page is Loaded ");
      this._controller = info.valueAccessor().params.app;

      //initialize observables
      this.initializeobservables();

      //OFSC receiveddata from Plugin
      this.ofscData = this._controller.openData();
      console.log(this.ofscData);

      this._doc = document.getElementById("mainSectionPanel");

      this._assetDoc = document.getElementById("assetVerifySectionPanel");

      this._modalPanel = document.getElementById("previousAssetDialog");

      this.assetButtonAction = function (event) {
        this._doc.classList.add("ishidden");
        this._assetDoc.classList.remove("ishidden");
        var id = event.target.id;
        var arr = id.split("_");
        var invid = arr[1];
        assetId = arr[2];
        this.assetMapping(invid, assetId, this.ofscData);
      }.bind(this);

      var previousAssetRemarksUrl =
        this.ofscData.securedData.url + "/ofs_previous_service_history.php?action=fetch_remark&assets_id=" + assetId;
      this.modalOpener = async function (event) {
        let remarksPrev = await this.fetchData(previousAssetRemarksUrl);

        this.prevRemarksData = [
          {
            date: remarksPrev.date,
            technician: remarksPrev.technician,
            remarks: remarksPrev.Remarks,
            ref_num: remarksPrev.ref_num ? remarksPrev.ref_num : "NA"
          }
        ];

        this.previousAssetdataProvider = ko.observable(
          new ArrayDataProvider(this.prevRemarksData, {
            keyAttributes: "date"
          })
        );

        this._modalPanel.open();
      };
    }
  }

  return constructScreen;
});
