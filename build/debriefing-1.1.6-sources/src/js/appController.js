/*
 ** Oracle Field Service Debriefing plugin
 **
 ** Copyright (c) 2023, Oracle and/or its affiliates.
 ** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */

/**
 * @licence
 * Plugin Debriefing
 * Copyright (c) 2023, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  "ojs/ojcore",
  "knockout",
  "./ofsc-connector",
  "./services/inventory-search-service",
  "./data-services/parts-catalog-data-service",
  "./models/catalog-collection",
  "text!required-properties.json",
  "ojs/ojmodel",
  "./errors/application-critical-error",

  // non-referenced:
  "./components/index",
  "ojs/ojrouter",
  "ojs/ojvalidation-datetime",
  "viewModels/add-expense",
  "viewModels/add-labor",
  "viewModels/add-returned-part",
  "viewModels/add-used-part",
  "viewModels/dashboard",
  "viewModels/invoice",
  "viewModels/service-checklist",
  "text!views/service-checklist.html",
  "text!views/add-expense.html",
  "text!views/add-labor.html",
  "text!views/add-returned-part.html",
  "text!views/add-used-part.html",
  "text!views/dashboard.html",
  "text!views/invoice.html"
], function (
  oj,
  ko,
  OfscConnector,
  InventorySearchService,
  PartsCatalogDataService,
  CatalogCollection,
  requiredProperties,
  ojmodel,
  ApplicationCriticalError
) {
  const INVENTORY_ENTITY_NAME = "inventory";
  const INVENTORY_TYPE_PART = "part";
  const INVENTORY_TYPE_PART_SN = "part_sn";
  const INVENTORY_TYPE_LABOR = "labor";
  const INVENTORY_TYPE_EXPENSE = "expense";
  const DELETE_ACTION_NAME = "delete";

  class ControllerViewModel {
    constructor() {
      /*
       * Set up router
       */
      this.router = this.getRouterInstance();
      this.router.configure({
        dashboard: { label: "Dashboard", isDefault: true },
        "add-labor": { label: "Add Labor" },
        "add-expense": { label: "Add Expense" },
        "add-used-part": { label: "Add Used Part" },
        "add-returned-part": { label: "Add Returned Part" },
        "service-checklist": { label: "Service Checklist" },
        invoice: { label: "Invoice" }
      });

      oj.Router.defaults["urlAdapter"] = new oj.Router.urlParamAdapter();

      this.router.moduleConfig.params.app = this;

      /*
       * Initialize instance fields
       */
      this.dateTimeConverter = oj.Validation.converterFactory("datetime").createConverter();
      this.openData = ko.observable("");

      this._initModels();
      this.dialogHeading = ko.observable("");
      this.dialogMessage = ko.observable("");

      /*
       * OFSC Plugin API integration
       */
      this.ofscConnector = new OfscConnector();

      this.ofscConnector.debugMessageReceivedSignal.add((data) => {
        console.info("-> DEBRIEFING: ", data);
      });

      this.ofscConnector.debugMessageSentSignal.add((data) => {
        console.info("<- DEBRIEFING: ", data);
      });

      this.ofscConnector.debugIncorrectMessageReceivedSignal.add((error, data) => {
        console.error("-> DEBRIEFING: incorrect message: ", error, data);
      });
    }

    getRouterInstance() {
      return oj.Router.rootInstance;
    }

    getInvTypePartConst() {
      return INVENTORY_TYPE_PART;
    }

    getInvTypePartSnConst() {
      return INVENTORY_TYPE_PART_SN;
    }

    getLogoUrl() {
      return this.logoUrl;
    }

    terminatePlugin() {
      this.ofscConnector
        .sendMessage({
          method: "close"
        })
        .then((data) => {
          console.log("RESPONSE DATA: ", data);
        })
        .catch((e) => {
          console.error(e);
        });
    }

    load() {
      return new Promise((resolve, reject) => {
        console.log("Load is being called");
        this.ofscConnector
          .sendMessage({
            method: "ready",
            sendInitData: true
          })
          .then((message) => {
            switch (message.method) {
              case "init":
                let attributeDescription = message.attributeDescription;

                window.localStorage.setItem("debriefing_attributeDescription", JSON.stringify(attributeDescription));

                this.ofscConnector.sendMessage({
                  method: "initEnd"
                });

                break;
              case "open":
                console.log("Message in case open" + message);
                this.openData(message);

                this.attributeDescription = JSON.parse(window.localStorage.getItem("debriefing_attributeDescription"));

                let errorsMsg = this._verifyProperties(requiredProperties, this.attributeDescription);

                if (errorsMsg !== "") {
                  throw new ApplicationCriticalError("Critical Error", errorsMsg);
                } else if (message.activity.astatus !== "started") {
                  throw new ApplicationCriticalError(
                    "Critical Error",
                    "The queue must be activated and the activity must be started. The plugin will be terminated."
                  );
                } else if (message.entity !== "activity") {
                  throw new ApplicationCriticalError(
                    "Critical Error",
                    "The plugin should be opened from an activity page. The plugin will be terminated."
                  );
                } else {
                  this.loadData()
                    .then(() => {
                      this.open();
                    })
                    .then(resolve);
                }
                break;
              case "error":
                this._showErrorAlert(message);
                break;
            }
          })
          .catch((e) => {
            if (e instanceof ApplicationCriticalError) {
              return reject(e);
            }
            console.error("Unable to start application: ", e);
          });
      });
    }

    loadData() {
      console.log("LoadData is being called");
      this.partsCatalogDataService = new PartsCatalogDataService(this.ofscConnector);
      this.catalogCollection = new CatalogCollection();

      return this.partsCatalogDataService.getPartsCatalogsStructure().then((catalogModelList) => {
        catalogModelList.forEach((catalogModel) => {
          this.catalogCollection.add(catalogModel);
        });
      });
    }

    _initModels() {
      // Items collections
      this.laborItems = ko.observableArray([]);
      this.expenseItems = ko.observableArray([]);
      this.serialNums = ko.observableArray([]);
      this.logoUrl = ko.observable("");

      this.partModelConstructor = oj.Model.extend({
        idAttribute: "part_item_number"
      });

      this.resourcePartsCollection = new ojmodel.Collection(null, {
        model: this.partModelConstructor
      });

      this.createdDeinstalledPartsCollection = new ojmodel.Collection(null, {
        model: this.partModelConstructor
      });

      this.customerPartsCollection = new ojmodel.Collection(null, {
        model: this.partModelConstructor
      });

      this.usedPartsCollection = new ojmodel.Collection(null, {
        model: this.partModelConstructor
      });

      this.returnedPartsCollection = new ojmodel.Collection(null, {
        model: this.partModelConstructor
      });

      this.partsInventoryActionsCollection = new ojmodel.Collection();
    }

    open() {
      console.log("Open is being called");
      // Labor activities enumeration
      let laborActivities = [];

      Object.entries(this.attributeDescription.labor_service_activity.enum).forEach(([id, { text, inactive }]) => {
        if (inactive) {
          return;
        }

        laborActivities.push({ id, text });
      });

      this.laborActivityEnumCollection = new ojmodel.Collection(laborActivities);

      // Labor items enumeration
      let laborItems = [];

      Object.entries(this.attributeDescription.labor_item_number.enum).forEach(([id, { text, inactive }]) => {
        if (inactive) {
          return;
        }

        laborItems.push({
          id,
          label: text,
          text: this.attributeDescription.labor_item_desc.enum[id]
            ? this.attributeDescription.labor_item_desc.enum[id].text
            : ""
        });
      });

      this.laborItemEnumCollection = new ojmodel.Collection(laborItems);

      // Expense activities enumeration
      let expenseActivities = [];

      Object.entries(this.attributeDescription.expense_service_activity.enum).forEach(([id, { text, inactive }]) => {
        if (inactive) {
          return;
        }

        expenseActivities.push({ id, text });
      });

      this.expenseActivityEnumCollection = new ojmodel.Collection(expenseActivities);

      // Expense items enumeration
      let expenseItems = [];

      Object.entries(this.attributeDescription.expense_item_number.enum).forEach(([id, { text, inactive }]) => {
        if (inactive) {
          return;
        }

        expenseItems.push({
          id,
          label: text,
          text: this.attributeDescription.expense_item_desc.enum[id]
            ? this.attributeDescription.expense_item_desc.enum[id].text
            : ""
        });
      });

      this.expenseItemEnumCollection = new ojmodel.Collection(expenseItems);

      // Expense currency enumeration
      let expenseCurrencies = [];

      Object.entries(this.attributeDescription.expense_currency_code.enum).forEach(([id, { text, inactive }]) => {
        if (inactive) {
          return;
        }

        let textFields = text.match(/^(.+?)\|(.+)/);

        expenseCurrencies.push({
          id,
          sign: textFields[1],
          text: textFields[2]
        });
      });

      this.expenseCurrencyEnumCollection = new ojmodel.Collection(expenseCurrencies);

      // Activity codes for added parts
      let partActivityUsed = [];

      Object.entries(this.attributeDescription.part_service_activity_used.enum).forEach(([id, { text, inactive }]) => {
        if (inactive) {
          return;
        }

        partActivityUsed.push({ id, text });
      });

      this.partActivityUsedEnumCollection = new ojmodel.Collection(partActivityUsed);

      // Activity codes for returned parts
      let partActivityReturned = [];

      Object.entries(this.attributeDescription.part_service_activity_returned.enum).forEach(
        ([id, { text, inactive }]) => {
          if (inactive) {
            return;
          }

          partActivityReturned.push({ id, text });
        }
      );

      this.partActivityReturnedEnumCollection = new ojmodel.Collection(partActivityReturned);

      // Pre-fill the models and collections

      // Resource
      let resourceOpenData = this.openData().resource;

      this.resource = new oj.Model({
        id: resourceOpenData.pid || "",
        name: resourceOpenData.pname || ""
      });

      // Activity
      let activityOpenData = this.openData().activity;

      this.customer = new oj.Model({
        name: activityOpenData.cname || "",
        address: activityOpenData.caddress || "",
        city: activityOpenData.ccity || "",
        state: activityOpenData.cstate || "",
        zip: activityOpenData.czip || "",
        workorder: activityOpenData.appt_number || "",
        company: activityOpenData.ccompany || ""
      });

      this.ofscActivityModel = new (oj.Model.extend({
        idAttribute: "aid"
      }))({
        aid: activityOpenData.aid
      });

      // Parts, Labor and Expenses
      let inventoryOpenData = this.openData().inventoryList;

      this.installedInventoriesSummary = {};
      this.deinstalledInventoriesSummary = {};
      Object.entries(inventoryOpenData).forEach(([invid, inventory]) => {
        if (activityOpenData.aid && inventory.inv_aid && activityOpenData.aid !== String(inventory.inv_aid)) {
          return;
        }
        if (INVENTORY_TYPE_PART === inventory.invtype || INVENTORY_TYPE_PART_SN === inventory.invtype) {
          let invpool = inventory.invpool;
          inventory.part_item_number = inventory.part_item_number_rev + "~" + inventory.invsn;
          if (inventory.quantity === null) {
            inventory.quantity = 0;
          }
          switch (invpool) {
            case "provider":
              this.resourcePartsCollection.add(inventory);
              break;
            case "customer":
              this.customerPartsCollection.add(inventory);
              break;
            case "install":
              let id = inventory.part_item_number_rev;
              if (inventory.invsn !== "") {
                id = id + "~" + inventory.invsn;
              }
              this.installedInventoriesSummary[id] = {
                invid: inventory.invid,
                model: inventory.part_item_number_rev,
                quantity_delta: 0,
                invsn: inventory.invsn
              };
              this.usedPartsCollection.add(inventory);
              break;
            case "deinstall":
              let identifier = inventory.part_item_number_rev;
              if (inventory.invsn !== "") {
                identifier = identifier + "~" + inventory.invsn;
              }
              this.deinstalledInventoriesSummary[identifier] = {
                invid: inventory.invid,
                model: inventory.part_item_number_rev,
                quantity_delta: 0,
                invsn: inventory.invsn
              };
              this.returnedPartsCollection.add(inventory);
              break;
            default:
              throw new Error(`Unknown inventory pool: '${invpool}' (invid = '${invid}')`);
          }
        } else if (INVENTORY_TYPE_LABOR === inventory.invtype) {
          this.addLabor({
            activityId: inventory.labor_service_activity,
            itemId: inventory.labor_item_number,
            startTime: inventory.labor_start_time,
            endTime: inventory.labor_end_time,
            recordId: invid
          });
        } else if (INVENTORY_TYPE_EXPENSE === inventory.invtype) {
          this.addExpense({
            activityId: inventory.expense_service_activity,
            itemId: inventory.expense_item_number,
            amount: inventory.expense_amount,
            currencyKey: inventory.expense_currency_code,
            recordId: invid
          });
        }
      });

      //secured params
      if (null != this.openData().securedData) {
        this.logoUrl(this.openData().securedData.logoUrl);
      }
      this.timeConverter = new oj.IntlDateTimeConverter({ pattern: "hh:mm a" });

      /** @type InventorySearchService */
      this.inventorySearchService = new InventorySearchService(
        this.resourcePartsCollection,
        this.attributeDescription,
        // searchable properties:
        ["part_item_number_rev", "part_item_desc", "invsn"],
        // order by:
        "part_item_number_rev"
      );
    }

    getIdFromArray(array) {
      let id = 0;

      if (array.length === 0) {
        id = 1;
      } else {
        array.forEach((item) => {
          id = id <= item.id ? item.id : id;
        });
        id++;
      }

      return id;
    }

    addLabor({ activityId, itemId, startTime, endTime, recordId = null }) {
      let props = { id: this.getIdFromArray(this.laborItems()), activityId, itemId, startTime, endTime };

      if (recordId) {
        props.recordId = recordId;
      }

      Object.entries(this.laborItemEnumCollection.get(itemId).toJSON()).forEach(([key, value]) => {
        props["item_" + key] = value;
      });

      Object.entries(this.laborActivityEnumCollection.get(activityId).toJSON()).forEach(([key, value]) => {
        props["activity_" + key] = value;
      });

      let tempDuration =
        this.dateTimeConverter.compareISODates(
          this.dateTimeConverter.parse(endTime),
          this.dateTimeConverter.parse(startTime)
        ) /
        1000 /
        60;

      props.duration = tempDuration < 0 ? +tempDuration + 24 * 60 : tempDuration;

      this.laborItems.push(props);
    }

    removeLabor(id) {
      const index = this.laborItems().findIndex((labor) => labor.id === id);

      const deletedList = this.laborItems.splice(index, 1);

      const listWithRecordId = deletedList.filter((item) => !!item.recordId);

      if (listWithRecordId.length) {
        this.addInventoryListToDeleted(listWithRecordId);
      }
    }

    addExpense({ activityId, itemId, amount, currencyKey, recordId }) {
      let props = { id: this.getIdFromArray(this.expenseItems()), activityId, itemId, amount, currencyKey };

      if (recordId) {
        props.recordId = recordId;
      }

      Object.entries(this.expenseItemEnumCollection.get(itemId).toJSON()).forEach(([key, value]) => {
        props["item_" + key] = value;
      });

      Object.entries(this.expenseActivityEnumCollection.get(activityId).toJSON()).forEach(([key, value]) => {
        props["activity_" + key] = value;
      });

      Object.entries(this.expenseCurrencyEnumCollection.get(currencyKey).toJSON()).forEach(([key, value]) => {
        props["currency_" + key] = value;
      });

      this.expenseItems.push(props);
    }

    removeExpense(id) {
      const index = this.expenseItems().findIndex((expense) => expense.id === id);

      const deletedList = this.expenseItems.splice(index, 1);

      const listWithRecordId = deletedList.filter((item) => !!item.recordId);

      if (listWithRecordId.length) {
        this.addInventoryListToDeleted(listWithRecordId);
      }
    }
    checkValidationGroup() {
      const tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        return true;
      } else {
        // show messages on all the components that are invalidHiddden, i.e., the
        // required fields that the user has yet to fill out.
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
        return false;
      }
    }

    submitPluginData() {
      this.ofscConnector
        .sendMessage(this._getOfscCloseData())
        .then((data) => {
          console.log("RESPONSE DATA: ", data);
        })
        .catch((e) => {
          this._showErrorAlert(e);
          console.error(e);
        });
    }

    /*
     * Inventory actions
     *
     * - Updates possible only for install and deinstall pools (customer and provider ones aren't shown in the list)
     * - Update changes fields and properties of previous install/deinstall action. No real update.
     * - Remove from used/returned parts does undo_install/undo_deinstall. No property update, no update action possible (they become hidden). Previous update is removed from list.
     * - Add to used/returned removes undo_install/undo_deinstall action if any, but updates properties and quantity.
     */

    addUsedPart(model, activityId, quantity, serialNum) {
      let sourcePart = this.resourcePartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
      let index = "";
      let invid = null;
      if (serialNum) {
        index = model + "~" + serialNum;
      } else {
        index = model;
      }
      if (!sourcePart) {
        return false;
      }
      let targetPart = this.usedPartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
      if (!targetPart) {
        let copiedProperties = sourcePart.toJSON();
        delete copiedProperties.invid;
        copiedProperties.quantity = 0;
        copiedProperties.invpool = "install";
        copiedProperties.invsn = serialNum;
        targetPart = new this.partModelConstructor(copiedProperties);
        this.usedPartsCollection.add(targetPart);
      }

      sourcePart.set("quantity", (parseInt(sourcePart.get("quantity"), 10) || 0) - quantity);
      targetPart.set("quantity", (parseInt(targetPart.get("quantity"), 10) || 0) + quantity);
      targetPart.set("part_service_activity_used", activityId);

      let metadata = this.installedInventoriesSummary[index];

      if (!metadata) {
        metadata = this.installedInventoriesSummary[index] = {
          invid: invid,
          model: model,
          activityId: activityId,
          quantity_delta: 0,
          serialNum: serialNum
        };
      }

      metadata.quantity_delta += quantity;
    }

    removeUsedPart(model, serialNum) {
      let resourcePart = this.resourcePartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
      let installedPart = this.usedPartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
      if (!installedPart) {
        return false;
      }
      let quantity = parseInt(installedPart.get("quantity"), 10) || 0;
      if (!resourcePart) {
        let copiedProperties = installedPart.toJSON();

        delete copiedProperties.invid;

        copiedProperties.quantity = 0;
        copiedProperties.invpool = "provider";
        resourcePart = new this.partModelConstructor(copiedProperties);

        this.resourcePartsCollection.add(resourcePart);
      }
      resourcePart.set("quantity", (parseInt(resourcePart.get("quantity"), 10) || 0) + quantity);
      installedPart.set("quantity", (parseInt(installedPart.get("quantity"), 10) || 0) - quantity);
      let metadata = this.installedInventoriesSummary[model];
      if (!metadata) {
        metadata = this.installedInventoriesSummary[model] = {
          invid: installedPart.get("invid"),
          model: model,
          quantity_delta: 0
        };
      }
      metadata.quantity_delta -= quantity;
    }

    addReturnedPart(inventoryModel, activityId, quantity, serialNum) {
      let id = inventoryModel.get("part_item_number_rev");
      let sourcePart = this.customerPartsCollection.findWhere({ part_item_number_rev: id, invsn: serialNum });
      let targetPart = this.returnedPartsCollection.findWhere({ part_item_number_rev: id, invsn: serialNum });
      if (serialNum) {
        id = id + "~" + serialNum;
      }
      if (!targetPart) {
        let copiedProperties = inventoryModel.toJSON();
        delete copiedProperties.invid;
        copiedProperties.quantity = 0;
        copiedProperties.invpool = "deinstall";
        copiedProperties.invsn = serialNum;
        targetPart = new this.partModelConstructor(copiedProperties);
        targetPart.set("part_item_number", id);
        this.returnedPartsCollection.add(targetPart);
      }
      if (sourcePart) {
        sourcePart.set("quantity", (parseInt(sourcePart.get("quantity"), 10) || 0) - quantity);
      } else {
        let foundCreatedPart = this.createdDeinstalledPartsCollection.findWhere({
          part_item_number_rev: inventoryModel.get("part_item_number_rev"),
          invsn: serialNum
        });
        if (!foundCreatedPart) {
          inventoryModel.set("quantity", parseInt(quantity, 10) || 0);
          inventoryModel.set("part_item_number", id);
          this.createdDeinstalledPartsCollection.add(inventoryModel);
        } else {
          foundCreatedPart.set("quantity", (parseInt(foundCreatedPart.get("quantity"), 10) || 0) + quantity);
        }
      }
      targetPart.set("quantity", (parseInt(targetPart.get("quantity"), 10) || 0) + quantity);
      targetPart.set("part_service_activity_returned", activityId);
      let metadata = this.deinstalledInventoriesSummary[id];
      if (!metadata) {
        metadata = this.deinstalledInventoriesSummary[id] = {
          invid: null,
          model: inventoryModel.get("part_item_number_rev"),
          activityId: activityId,
          quantity_delta: 0,
          invsn: serialNum
        };
      }
      metadata.quantity_delta += quantity;
    }

    removeReturnedPart(model, serialNum) {
      let id = model;
      let customerPart = this.customerPartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
      let deinstalledPart = this.returnedPartsCollection.findWhere({ part_item_number_rev: model, invsn: serialNum });
      if (!deinstalledPart) {
        return false;
      }
      let quantity = parseInt(deinstalledPart.get("quantity"), 10) || 0;
      if (!customerPart) {
        let copiedProperties = deinstalledPart.toJSON();
        delete copiedProperties.invid;
        copiedProperties.quantity = 0;
        copiedProperties.invpool = "customer";
        copiedProperties.invsn = serialNum;
        customerPart = new this.partModelConstructor(copiedProperties);
        this.customerPartsCollection.add(customerPart);
      }
      customerPart.set("quantity", (parseInt(customerPart.get("quantity"), 10) || 0) + quantity);
      deinstalledPart.set("quantity", (parseInt(deinstalledPart.get("quantity"), 10) || 0) - quantity);
      if (serialNum) {
        id = id + "~" + serialNum;
      }
      let metadata = this.deinstalledInventoriesSummary[id];
      if (!metadata) {
        metadata = this.deinstalledInventoriesSummary[id] = {
          invid: deinstalledPart.get("invid"),
          model: model,
          quantity_delta: 0,
          invsn: serialNum
        };
      }
      metadata.quantity_delta -= quantity;
    }

    _addInstallInventoryAction({ invid, inv_aid, invsn, quantity, properties }) {
      this.partsInventoryActionsCollection.add({
        action: "install",
        invid,
        inv_aid,
        invsn,
        quantity,
        properties: properties || {}
      });
    }

    _addDeinstallInventoryAction({ invid, inv_pid, quantity, properties }) {
      this.partsInventoryActionsCollection.add({
        action: "deinstall",
        invid,
        inv_pid,
        quantity,
        properties: properties || {}
      });
    }

    _createDeinstallInventoryAction(inventoryModel, additionalProperties = {}) {
      let properties = inventoryModel.toJSON();
      let part_item_number = properties.part_item_number.split("~")[0];

      delete properties.invid;
      delete properties.inv_aid;
      delete properties.inv_pid;
      delete properties.quantity;
      delete properties.invpool;
      delete properties.invtype;
      delete properties.invsn;

      if (inventoryModel.get("invtype") === INVENTORY_TYPE_PART_SN) {
        this.partsInventoryActionsCollection.add({
          action: "create",
          entity: "inventory",
          inv_aid: inventoryModel.get("inv_aid"),
          inv_pid: inventoryModel.get("inv_pid"),
          invtype: inventoryModel.get("invtype"),
          invpool: inventoryModel.get("invpool"),
          properties: Object.assign(properties || {}, additionalProperties)
        });
      } else {
        this.partsInventoryActionsCollection.add({
          action: "create",
          entity: "inventory",
          inv_aid: inventoryModel.get("inv_aid"),
          inv_pid: inventoryModel.get("inv_pid"),
          invtype: inventoryModel.get("invtype"),
          quantity: inventoryModel.get("quantity"),
          invpool: inventoryModel.get("invpool"),
          properties: Object.assign(properties || {}, additionalProperties)
        });
      }
    }

    _addUndoInstallInventoryAction({ invid, quantity, invsn, properties }) {
      this.partsInventoryActionsCollection.add({
        action: "undo_install",
        invid,
        quantity,
        invsn,
        properties: properties || {}
      });
    }

    _addUndoDeinstallInventoryAction({ invid, quantity, properties }) {
      this.partsInventoryActionsCollection.add({
        action: "undo_deinstall",
        invid,
        quantity,
        properties: properties || {}
      });
    }

    _generatePartsActions() {
      // parts added:
      Object.entries(this.installedInventoriesSummary).forEach(([model, summary]) => {
        let serialNum = null;
        if (model.indexOf("~") !== -1) {
          let splitArray = [];
          splitArray = model.split("~");
          model = splitArray[0];
          serialNum = splitArray[1];
        }
        if (summary.quantity_delta > 0) {
          // install action:
          let sourceInventory = this.resourcePartsCollection.findWhere({
            part_item_number_rev: model,
            invsn: serialNum
          });
          if (!sourceInventory || !sourceInventory.get("invid")) {
            console.error("Unable to locate resource part, part_item_number_rev = " + model);
            return;
          }

          if (INVENTORY_TYPE_PART_SN === sourceInventory.get("invtype")) {
            this._addInstallInventoryAction({
              invid: sourceInventory.get("invid"),
              inv_aid: this.ofscActivityModel.get("aid"),
              properties: {
                part_service_activity_used: summary.activityId,
                invsn: summary.serialNum
              }
            });
          } else {
            this._addInstallInventoryAction({
              invid: sourceInventory.get("invid"),
              inv_aid: this.ofscActivityModel.get("aid"),
              quantity: summary.quantity_delta,
              properties: {
                part_service_activity_used: summary.activityId
              }
            });
          }
        } else if (summary.quantity_delta < 0) {
          // undo install action:
          let sourceInventory = this.usedPartsCollection.findWhere({ part_item_number_rev: model });

          if (!sourceInventory || !sourceInventory.get("invid")) {
            console.error("Unable to undo install of inventory, part_item_number_rev = " + model);
            return;
          }
          if (INVENTORY_TYPE_PART_SN === sourceInventory.get("invtype")) {
            this._addUndoInstallInventoryAction({
              invid: summary.invid,
              invsn: summary.serialNum
            });
          } else {
            this._addUndoInstallInventoryAction({
              invid: sourceInventory.get("invid"),
              quantity: Math.abs(summary.quantity_delta),
              invsn: summary.serialNum
            });
          }
        }
      });

      // parts returned:
      Object.entries(this.deinstalledInventoriesSummary).forEach(([model, summary]) => {
        let serialNum = null;
        if (model.indexOf("~") !== -1) {
          let splitArray = [];
          splitArray = model.split("~");
          model = splitArray[0];
          serialNum = splitArray[1];
        }
        if (summary.quantity_delta > 0) {
          // deinstall action:
          let sourceInventory = this.customerPartsCollection.findWhere({
            part_item_number_rev: model,
            invsn: serialNum
          });
          let inventoryFound = false;

          let additionalProperties = {
            part_service_activity_returned: summary.activityId,
            invsn: summary.invsn
          };

          if (!sourceInventory || !sourceInventory.get("invid")) {
            let createdInventoryModel = this.createdDeinstalledPartsCollection.findWhere({
              part_item_number_rev: model,
              invsn: serialNum
            });

            if (createdInventoryModel) {
              if (summary.invsn) {
                createdInventoryModel.set("invtype", INVENTORY_TYPE_PART_SN);
              }
              this._createDeinstallInventoryAction(createdInventoryModel, additionalProperties);
            } else {
              console.error("Unable to locate customer part, part_item_number_rev = " + model);
            }
          } else {
            inventoryFound = true;
          }

          if (inventoryFound) {
            if (sourceInventory.get("invtype") === INVENTORY_TYPE_PART_SN) {
              this._addDeinstallInventoryAction({
                invid: sourceInventory.get("invid"),
                inv_pid: this.resource.GetId(),
                properties: additionalProperties
              });
            } else {
              this._addDeinstallInventoryAction({
                invid: sourceInventory.get("invid"),
                inv_pid: this.resource.GetId(),
                quantity: summary.quantity_delta,
                properties: additionalProperties
              });
            }
          }
        } else if (summary.quantity_delta < 0) {
          // undo deinstall action:
          let sourceInventory = this.returnedPartsCollection.findWhere({
            part_item_number_rev: model,
            invsn: serialNum
          });

          if (!sourceInventory || !sourceInventory.get("invid")) {
            console.error("Unable to undo deinstall of inventory, part_item_number_rev = " + model);
            return;
          }

          if (sourceInventory.get("invtype") === INVENTORY_TYPE_PART_SN) {
            this._addUndoDeinstallInventoryAction({
              invid: sourceInventory.get("invid")
            });
          } else {
            this._addUndoDeinstallInventoryAction({
              invid: sourceInventory.get("invid"),
              quantity: Math.abs(summary.quantity_delta)
            });
          }
        }
      });
    }

    _getOfscCloseData() {
      // generate installed\deinstalled parts actions:
      this._generatePartsActions();

      return {
        method: "close",
        activity: this.ofscActivityModel.toJSON(),
        inventoryList: this._getOfscInventoryListUpdates(),
        actions: [].concat(
          this._getOfscPartsInventoryActions(),
          this._getOfscCreateLaborInventoryActions(),
          this._getOfscCreateExpenseInventoryActions(),
          this._getOfscDeleteInventoryActions()
        )
      };
    }

    _getOfscInventoryListUpdates() {
      let inventoryList = {};

      this.partsInventoryActionsCollection.where({ action: "update" }).forEach((action) => {
        inventoryList[action.get("invid")] = Object.assign(
          {
            invid: action.get("invid"),
            invtype: action.get("invtype"),
            inv_aid: action.get("inv_aid"),
            inv_pid: action.get("inv_pid"),
            quantity: action.get("quantity")
          },
          action.properties
        );
      });

      return inventoryList;
    }

    _getOfscPartsInventoryActions() {
      return this.partsInventoryActionsCollection
        .filter((action) => "update" !== action.get("action"))
        .map((action) => {
          return Object.assign({ entity: "inventory" }, action.toJSON());
        });
    }

    _getOfscCreateLaborInventoryActions() {
      return this.laborItems()
        .filter((labor) => !labor["recordId"])
        .map((labor) => {
          return {
            entity: "inventory",
            action: "create",
            invpool: "install",
            invtype: INVENTORY_TYPE_LABOR,
            inv_aid: this.ofscActivityModel.GetId(),
            inv_pid: this.resource.GetId(),
            properties: {
              labor_service_activity: labor["activityId"],
              labor_item_number: labor["itemId"],
              labor_item_desc: labor["itemId"],
              labor_start_time: labor["startTime"],
              labor_end_time: labor["endTime"]
            }
          };
        });
    }

    _getOfscCreateExpenseInventoryActions() {
      return this.expenseItems()
        .filter((expense) => !expense["recordId"])
        .map((expense) => {
          return {
            entity: "inventory",
            action: "create",
            invpool: "install",
            invtype: INVENTORY_TYPE_EXPENSE,
            inv_aid: this.ofscActivityModel.GetId(),
            inv_pid: this.resource.GetId(),
            properties: {
              expense_service_activity: expense["activityId"],
              expense_item_number: expense["itemId"],
              expense_item_desc: expense["itemId"],
              expense_amount: "" + expense["amount"],
              expense_currency_code: expense["currencyKey"]
            }
          };
        });
    }

    /**
     *
     * @returns {Array}
     * @private
     */
    _getOfscDeleteInventoryActions() {
      const deletedInventoryList = this.getDeletedInventoryList();

      if (deletedInventoryList.length) {
        return deletedInventoryList.map(mapInventoryToDeleteAction);
      } else {
        return [];
      }
    }

    _verifyProperties(requiredPropertiesJSON, attributeDescription) {
      let config = JSON.parse(requiredPropertiesJSON).properties;
      let errorsArray = [];

      Object.values(config).forEach((property) => {
        if (!attributeDescription[property.label]) {
          errorsArray.push(property.label);
        }
      });

      if (!errorsArray.length) {
        return "";
      } else if (errorsArray.length === 1) {
        return "The following property must be configured: " + errorsArray[0] + ".";
      } else {
        return "The following properties must be configured: " + errorsArray.join(", ") + ".";
      }
    }

    _showErrorAlert(data) {
      let errorArray = data.errors.map((error) => {
        switch (error.code) {
          case "CODE_ACTION_INVENTORY_ACTIVITY_STATUS_INVALID":
            return "The activity must be started";

          case "CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED":
            return "The activity shouldn't be in the past";

          default:
            return error;
        }
      });

      if (errorArray.length === 0) {
        return;
      }
      errorArray = errorArray.filter((v, i, a) => a.findIndex((v2) => ["code"].every((k) => v2[k] === v[k])) === i);
      if (errorArray.length === 1 && typeof errorArray[0] === "string") {
        this.errorAlertPopup("Critical Error", errorArray.join(), "");
      } else {
        this.errorAlertPopup("Critical Error", JSON.stringify(errorArray, null, 4), "");
      }
    }

    errorAlertPopup(heading, message) {
      this.resolveAlertCallback = null;
      this.dialogHeading(heading);
      this.dialogMessage(message);
      document.getElementById("alertDialog").open();
      return new Promise((resolve, reject) => {
        this.resolveAlertCallback = resolve;
      });
    }

    closeDialog(event) {
      document.getElementById("alertDialog").close();
      if (this.resolveAlertCallback instanceof Function) {
        this.resolveAlertCallback();
      }
    }

    /**
     * @param {Array} list
     */
    addInventoryListToDeleted(list) {
      const deletedList = this.getDeletedInventoryList();

      if (deletedList.length) {
        this.setDeleteInventoryList(deletedList.concat(list));
      } else {
        this.setDeleteInventoryList(list);
      }
    }

    /**
     * @param {Array} list
     */
    setDeleteInventoryList(list) {
      this.deleteInventoryList = list;
    }

    /**
     * @returns {Array}
     */
    getDeletedInventoryList() {
      return this.deleteInventoryList || [];
    }
  }

  /**
   * @param {Object} inventory
   * @returns {{invid: string | *, action: string, entity: string}}
   */
  function mapInventoryToDeleteAction(inventory) {
    return {
      entity: INVENTORY_ENTITY_NAME,
      action: DELETE_ACTION_NAME,
      invid: inventory.recordId
    };
  }

  return ControllerViewModel;
});
