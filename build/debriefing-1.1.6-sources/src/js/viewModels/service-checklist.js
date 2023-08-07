"use strict";
define([
  "knockout",
  "utils/dom",
  // non-referenced:
  "ojs/ojarraydataprovider",
  "ojs/ojlistview",
  "ojs/ojbutton"
], function (ko, dom, ArrayDataProvider) {
  var globalArray;
  let constructScreen = function () {
    this.mainSectionClass = ko.observable();
    return new serviceCheckListViewModel();
  };
  class serviceCheckListViewModel {
    listallAssets(ofscData) {
      var count = 1;
      var validation = false;
      var assetHtml = "";
      this.allAssetData = [];

      const inventoryList = ofscData.inventoryList;
      console;
      for (const [key, value] of Object.entries(inventoryList)) {
        var masterAid = ofscData.activity.masterActivityId != null ? ofscData.activity.masterActivityId : "";
        if (
          (value.invpool == "customer" && value.inv_aid == ofscData.activity.aid) ||
          (value.invpool == "customer" && value.inv_aid == masterAid)
        ) {
          var invId = value.invId;
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
            this.assetClass = "demo-centering-box-red";
          } else if (value.service_checklist_completed != 1) {
            this.assetClass = "demo-centering-box-yellow";
          } else {
            this.assetClass = "demo-centering-box-green";
          }

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
                count: count
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
              count: count
            });
          }

          count++;
        }
      }
      if (ofscData.activity.aworktype != "Preventive Maintenance") {
        this.allAssetsDataProvider = ko.observable(
          new ArrayDataProvider(this.allAssetData, {
            keyAttributes: "serialNo"
          })
        );
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
      console.log("View is inserted");
      console.log(info.element.innerHTML);
      this._dom = info.element.innerHTML;
      var x = 1;

      if (x == 1) {
        this.mainSectionClass = "ishidden";
      }

      this._doc = document.getElementById("mainSectionPanel");
      console.log(this._doc);
    }

    dismiss() {
      this._controller.router.go("dashboard", { historyUpdate: "replace" });
    }
  }

  return constructScreen;
});
