const should = require('chai').should();
const puppeteer = require('puppeteer');
const helper = require('../mocks/helper');
const openActivity = require('../mocks/open-activity');
const partsAddedFromInventory = require('../mocks/open-with-parts-added-from-inventory');
const withAddAndReturnParts = require('../mocks/open-with-add-and-return-parts');

suite('Acceptance', () => {

    let browser = null;
    let page = null;

    setup(async function () {
        this.timeout(300000);
        browser = await puppeteer.launch();
        page = await browser.newPage();
        page.setViewport({width: 1920, height: 1080});
        page.on('console', msg => console.log('PUPPETEER CONSOLE LOG:', msg.text()));
        await helper.openPlugin(page);
        await helper.initializePlugin(page);
        await helper.openIframe(page);
    });

    test('Debrief Landing page is getting displayed without any data and having options to add labor, expense , add parts and return parts', (async function () {
        this.timeout(300000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null, menuButtonText = null;
        let laborButtonElem = null, expenseButtonElem = null, addPartsButtonElem = null, returnPartsButtonElem = null;
        let laborButtonText = null, expenseButtonText = null, addPartsButtonText = null, returnPartsButtonText = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        menuButtonElem = await frame.waitForSelector('#emptyDashboard-container #menuButton1');

        menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.equal('Add Charges');
        //To Validate the dashboard content
        dashboardElem = await frame.waitForSelector('#emptyDashboard-container');
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');

        //To Validate the menu options or dropdown
        await frame.focus('#menuButton1');
        await frame.click('#menuButton1');

        laborButtonElem = await frame.waitForSelector('#debriefMenu1 #iconFont5');
        expenseButtonElem = await frame.waitForSelector('#debriefMenu1 #iconFont6');
        addPartsButtonElem = await frame.waitForSelector('#debriefMenu1 #iconFont7');
        returnPartsButtonElem = await frame.waitForSelector('#debriefMenu1 #iconFont8');

        laborButtonText = await laborButtonElem.evaluate(el => el.innerText);
        laborButtonText.should.equal('Labor');

        expenseButtonText = await expenseButtonElem.evaluate(el => el.innerText);
        expenseButtonText.should.equal('Expenses');

        addPartsButtonText = await addPartsButtonElem.evaluate(el => el.innerText);
        addPartsButtonText.should.equal('Add Parts');

        returnPartsButtonText = await returnPartsButtonElem.evaluate(el => el.innerText);
        returnPartsButtonText.should.equal('Return Parts');
        //To Take screenshot of final page
        await page.screenshot({path: 'WithEmptyDashboard.png', fullPage: true});
    }));

    test('Validate the debief page by adding labor', (async function () {
        this.timeout(500000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let laborOption = null;
        let billingType = null, billingItem = null;
        let inputStartTime = null, inputEndTime = null;
        let submitButton = null;
        let closeJsonElem = null, closeJson = null, closeMessage = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#emptyDashboard-container #menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add Labor Charge
        laborOption = await frame.waitForSelector('oj-option#iconFont5 > a');
        await laborOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        billingType = await frame.waitForSelector('#oj-combobox-choice-activity a');
        await billingType.click();
        await frame.click('#oj-listbox-results-activity li:first-child');

        billingItem = await frame.waitForSelector('#oj-combobox-choice-laborItem a');
        await billingItem.click();
        await frame.click('#oj-listbox-results-laborItem li:first-child');

        inputStartTime = await frame.waitForSelector('#startTimeEl');
        inputEndTime = await frame.waitForSelector('#endTimeEl');

        await inputStartTime.click({delay: 1000});
        inputStartTime.type('7:00 AM', {delay: 1000});
        await inputStartTime.click();

        await inputEndTime.click({delay: 1000});
        inputEndTime.type('8', {delay: 3000});

        let okButton =(await frame.$x("//*[contains(@id,'__oj_zorder_container')]//a[contains(text(),'OK')]"))[0];
        okButton.click({delay:2000});
        // await page.keyboard.press("Enter",{delay :2000});
        // await inputStartTime.click({delay: 3000});

        await new Promise(resolve => setTimeout(resolve, 3000));
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 3000});
        await new Promise(resolve => setTimeout(resolve, 3000));

        //To generate proforma invoice
        await page.screenshot({path: 'WithLabor.png', fullPage: true});
        await helper.signAndSave(frame);

        closeJsonElem = await page.waitForSelector('#receivedMessageJson-3');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method').that.equals('close');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0].properties).should.have.property('labor_item_number').that.equals('FS Overtime Labor');
        (closeMessage.actions[0].properties).should.have.property('labor_item_desc').that.equals('FS Overtime Labor');
        //To take screenshot of final page
        await page.screenshot({path: 'WithLabor.png', fullPage: true});

    }));

    test('Validate deleting the added labor items in Debrief plugin', (async function () {
        this.timeout(300000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null;
        let laborOption = null;
        let billingType = null, billingItem = null;
        let inputStartTime = null, inputEndTime, amount = null;
        let submitButton = null;
        let deleteLaborButton = null;
        let removeLaborElem = null, removeLaborText = null, removeButton = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#emptyDashboard-container #menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add Labor
        laborOption = await frame.waitForSelector('oj-option#iconFont5 > a');
        await laborOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        billingType = await frame.waitForSelector('#oj-combobox-choice-activity a');
        await billingType.click();
        await frame.click('#oj-listbox-results-activity li:first-child');

        billingItem = await frame.waitForSelector('#oj-combobox-choice-laborItem a');
        await billingItem.click();
        await frame.click('#oj-listbox-results-laborItem li:first-child');

        inputStartTime = await frame.waitForSelector('#startTimeEl');
        inputEndTime = await frame.waitForSelector('#endTimeEl');

        await inputStartTime.click({delay: 1000});
        inputStartTime.type('7:00 AM', {delay: 1000});
        await inputStartTime.click({delay: 1000});

        await inputEndTime.click({delay: 1000});
        inputEndTime.type('8', {delay: 1000});
        await inputStartTime.click({delay: 1000});

        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));
        //To Delete Labor
        deleteLaborButton = (await frame.$x("//*[contains(@id,'labor')]/button"))[0];
        await deleteLaborButton.click({delay: 1000});

        removeLaborElem = await frame.waitForSelector('#modalDialog  oj-bind-text');
        removeLaborText = await removeLaborElem.evaluate(el => el.innerText);
        removeLaborText.should.contain('Remove FS Overtime Labor?');

        await new Promise(resolve => setTimeout(resolve, 1000));
        removeButton = (await frame.$x("//*[contains(text(),'Remove')]/ancestor::button"))[0];
        await removeButton.click({delay: 2000});
        //To Validate Empty dashboard
        dashboardElem = await frame.waitForSelector('#emptyDashboard-container');
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');
        //To take screenshot of final screen
        await page.screenshot({path: 'WithDeleteLabor.png', fullPage: true});

    }));

    test('Validate adding expense in Debrief plugin', (async function () {
        this.timeout(300000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let expenseOption = null;
        let billingType = null, billingItem = null;
        let amount = null;
        let submitButton = null;
        let closeJsonElem = null, closeJson = null, closeMessage = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add expense
        await frame.focus('oj-option#iconFont6 > a');
        expenseOption = (await frame.$x("//a[contains(text(),'Expenses')]"))[0];
        await expenseOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        billingType = await frame.waitForSelector('#oj-combobox-choice-activity a');
        await billingType.click({delay: 1000});

        await frame.click('#oj-listbox-results-activity > li:first-child');
        billingItem = await frame.waitForSelector('#oj-combobox-choice-laborItem a');
        await billingItem.click({delay: 5000});

        await frame.click('#oj-listbox-results-laborItem > li:first-child');
        amount = await frame.waitForSelector('#amount');
        amount.type("5", {delay: 1000});

        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));
        //To Generate Proforma invoice
        await helper.signAndSave(frame);

        //To Validate the details submitted
        closeJsonElem = await page.waitForSelector('#receivedMessageJson-3');
        closeJson = await closeJsonElem.evaluate(el => el.textContent);
        closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method').that.equals('close');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('invpool').that.equals('install');
        (closeMessage.actions[0]).should.have.property('invtype').that.equals('expense');
        (closeMessage.actions[0].properties).should.have.property('expense_service_activity').that.equals('Expense');
        (closeMessage.actions[0].properties).should.have.property('expense_item_number').that.equals('FS Toll');
        (closeMessage.actions[0].properties).should.have.property('expense_item_desc').that.equals('FS Toll');
        (closeMessage.actions[0].properties).should.have.property('expense_amount').that.equals('5');
        //To take screenshot of final screen
        await page.screenshot({path: 'WithExpense.png', fullPage: true});

    }));

    test('Validate deleting the added expense in Debrief plugin', (async function () {
        this.timeout(300000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null;
        let expenseOption = null;
        let billingType = null, billingItem = null;
        let amount = null;
        let submitButton = null;
        let deleteExpenseButton = null, removeExpensesButton = null, removeExpensesText = null;
        let removeButton = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add expense
        await frame.focus('oj-option#iconFont6 > a');
        expenseOption = (await frame.$x("//a[contains(text(),'Expenses')]"))[0];
        await expenseOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        billingType = await frame.waitForSelector('#oj-combobox-choice-activity a');
        await billingType.click({delay: 1000});

        await frame.click('#oj-listbox-results-activity > li:first-child');
        billingItem = await frame.waitForSelector('#oj-combobox-choice-laborItem a');
        await billingItem.click({delay: 5000});

        await frame.click('#oj-listbox-results-laborItem > li:first-child');
        amount = await frame.waitForSelector('#amount');
        amount.type("5", {delay: 1000});

        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));
        //To delete expense
        deleteExpenseButton = (await frame.$x("//*[contains(@id,'expenses')]/button"))[0];
        await deleteExpenseButton.click({delay: 1000});

        removeExpensesButton = await frame.waitForSelector('#modalDialog oj-bind-text');
        removeExpensesText = await removeExpensesButton.evaluate(el => el.innerText);
        await removeExpensesText.should.contain('Remove FS Toll?');

        await new Promise(resolve => setTimeout(resolve, 1000));
        removeButton = (await frame.$x("//*[contains(text(),'Remove')]/ancestor::button"))[0];
        await removeButton.click({delay: 1000});
        //To Validate empty dashboard
        dashboardElem = await frame.waitForSelector('div#emptyDashboard-container');
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');
        //To take screenshot of final page
        await page.screenshot({path: 'WithDeleteExpense.png', fullPage: true});

    }));

    test('Verify Installing/Deinstalling inventories from Activity Inventory page reflects in new Debrief UI', (async function () {
        this.timeout(300000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null, menuButtonText = null;
        let menuAddedPart = null, menuAddedPartText = null;

        //To Open Activity
        await helper.openNewActivity(page, partsAddedFromInventory)

        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To validate the menu with non-empty dashboard
        menuButtonElem = await frame.waitForSelector('oj-menu-button#menuButton2');
        menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.equal('Add Charges');
        //To validate the inventory added from the Inventory page
        menuAddedPart = (await frame.$x("//*[contains(@class,'oj-listitemlayout-textslots')]"))[0];
        menuAddedPartText = await menuAddedPart.evaluate(el => el.innerText);
        menuAddedPartText.should.contain('ECM100001');
        //To Take screenshot of the final page
        await page.screenshot({path: 'WithInstallingDeInstallingFromInventories.png', fullPage: true});

    }));

    test('Debrief Redwood - Verify search functionality and results details for Return parts', (async function () {
        this.timeout(300000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let expenseOption = null;
        let submitButton = null, searchPart = null, returnPart = null,
            returnPartSerialNumber = null;
        let menuAddedReturnPart = null, menuAddedReturnPartText = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To add return parts
        await frame.focus('#iconFont8 > a');
        expenseOption = (await frame.$x("//a[contains(text(),'Return Parts')]"))[0];
        await expenseOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //Search Serialized inventory
        searchPart = (await frame.$x("//*[contains(@class, 'oj-inputsearch-input')]"))[0];
        await searchPart.type('ECM200002', {delay: 2000});
        await page.keyboard.press('Enter', {delay: 1000});

        //To Load the Search result of Serialized inventory
        const callProcedureMessageSearchInvJsonElem = await page.waitForSelector('#receivedMessageJson-3');
        const callProcedureMessageSearchInvJson = await callProcedureMessageSearchInvJsonElem.evaluate(el => el.textContent);
        const callProcedureMessageSearchInv = JSON.parse(callProcedureMessageSearchInvJson);

        callProcedureMessageSearchInv.should.have.property('apiVersion').that.equals(1);
        callProcedureMessageSearchInv.should.have.property('method').that.equals('callProcedure');
        callProcedureMessageSearchInv.should.have.property('callId');
        callProcedureMessageSearchInv.should.have.property('procedure').that.equals('searchParts');

        const callIdSearchInv = callProcedureMessageSearchInv.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callIdSearchInv,
            "resultData": {
                "items": [
                    {
                        "catalogId": 599,
                        "itemId": 37294,
                        "label": "ECM200002",
                        "itemType": "part",
                        "linkedItems": [],
                        "fields": {
                            "part_disposition_code": "",
                            "part_item_number": "ECM200002",
                            "part_item_revision": "A",
                            "part_item_desc": "Safety Clip",
                            "part_uom_code": "zzu"
                        },
                        "images": []
                    }
                ],
                "isContinueAvailable": true,
                "source": "cache",
                "searchId": 1
            }
        }, 0, 4));
        await page.click('#sendMessageButton');

        //To Select the search result
        returnPart = (await frame.$x("//*[contains(@class,'inventory-information')]"))[0];
        await returnPart.click({delay: 1000});
        //Enter Serial Number
        returnPartSerialNumber = (await frame.$x("//input[contains(@class,'oj-inputtext-input')]"))[0];
        await returnPartSerialNumber.type('SN100', {delay: 2000});
        //Submit Return Part
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));
        //To Validate the Return parts added after searching
        menuAddedReturnPart = (await frame.$x("//*[contains(@class,'oj-listitemlayout-textslots')]"))[0];
        menuAddedReturnPartText = await menuAddedReturnPart.evaluate(el => el.innerText);
        menuAddedReturnPartText.should.contain('ECM200002');
        //To take screenshot of final page
        await page.screenshot({path: 'WithReturnPartsSearched.png', fullPage: true});

    }));

    test('Validate adding parts/Validate deleting the added parts in Debrief Plugin/Valdiate the debrief plugin by adding return parts/Validate deleting the added return parts in Debrief plugin', (async function () {
        this.timeout(500000);

        let frameHandle = null;
        let frame = null;
        let dashboardElem = null, dashboardText = null;
        let menuButtonElem = null, menuButtonText = null;
        let deletePartsButton = null, removePartsButton = null, removePartsText = null;
        let deleteReturnPartsButton = null, removeReturnParts = null, removeReturnPartsText = null,
            removeReturnPartsButton = null;
        let menuAddedPart = null, menuAddedPartText = null,
            menuAddedReturnPart = null, menuAddedReturnPartText = null;
        let removeButton = null;

        //To Open Activity
        await helper.openNewActivity(page, withAddAndReturnParts);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To validate menu option with non-empty dashboard
        menuButtonElem = await frame.waitForSelector('#menuButton2');
        menuButtonText = await menuButtonElem.evaluate(el => el.innerText);
        menuButtonText.should.equal('Add Charges');
        //To validate the added parts
        menuAddedPart = (await frame.$x("//ul[contains(@aria-label,'Added Parts')]//*[contains(@class,'oj-listitemlayout-textslots')]"))[0];
        menuAddedPartText = await menuAddedPart.evaluate(el => el.innerText);
        menuAddedPartText.should.contain('ECM300001');
        //To validate the added return parts
        menuAddedReturnPart = (await frame.$x("//ul[contains(@aria-label,'Returned Parts')]//*[contains(@class,'oj-listitemlayout-textslots')]"))[0];
        menuAddedReturnPartText = await menuAddedReturnPart.evaluate(el => el.innerText);
        menuAddedReturnPartText.should.contain('ECM200002');
        //To delete the added parts
        deletePartsButton = (await frame.$x("//*[contains(@id,'usedParts')]/button"))[0];
        await deletePartsButton.evaluate(b => b.click());

        removePartsButton = await frame.waitForSelector('#modalDialog oj-bind-text');
        removePartsText = await removePartsButton.evaluate(el => el.innerText);
        removePartsText.should.contain('Remove ECM300001');

        await new Promise(resolve => setTimeout(resolve, 1000));
        removeButton = (await frame.$x("//*[contains(text(),'Remove')]/ancestor::button"))[0];
        await removeButton.evaluate(b => b.click({delay: 1000}));
        //To delete the return parts
        deleteReturnPartsButton = (await frame.$x("//*[contains(@id,'returnParts')]/button"))[0];
        await deleteReturnPartsButton.evaluate(b => b.click({delay: 1000}));

        removeReturnParts = await frame.waitForSelector('#modalDialog oj-bind-text');
        removeReturnPartsText = await removeReturnParts.evaluate(el => el.innerText);
        removeReturnPartsText.should.contain('Remove ECM200002');

        await new Promise(resolve => setTimeout(resolve, 1000));
        removeReturnPartsButton = (await frame.$x("//*[contains(text(),'Remove')]/ancestor::button"))[0];
        await removeReturnPartsButton.evaluate(b => b.click({delay: 1000}));
        //To validate the empty dashboard
        dashboardElem = await frame.waitForSelector('div#emptyDashboard-container');
        dashboardText = await dashboardElem.evaluate(el => el.innerText);
        dashboardText.should.contain('Please report your service summary');
        dashboardText.should.contain('You can add Labor Hours, Expense Charges, Installed Parts and Part Returns details');
        //To take screenshot of the final screen
        await page.screenshot({path: 'WithDeleteAddedAndReturnPartsAdded.png', fullPage: true});

    }));

    test('Debrief Plugin - To validate add parts with Inventory having 2 different serial numbers', (async function () {
        this.timeout(600000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let menuOptionWithCharges = null;
        let addPartOption = null;
        let submitButton = null, searchPart = null, searchPartResult = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add parts
        await frame.focus('#iconFont7 > a');
        addPartOption = (await frame.$x("//a[contains(text(),'Add Parts')]"))[0];
        await addPartOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //Search using serial number
        searchPart = (await frame.$x("//*[contains(@class, 'oj-inputsearch-input')]"))[0];
        await searchPart.type('SN005');
        await page.keyboard.press('Enter');
        await searchPart.click({delay: 1000});

        //Select the search result
        searchPartResult = await frame.waitForSelector('#tracker li:first-child');
        await searchPartResult.click({delay: 1000});

        //Click on Submit Button
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 2000});

        //To add second part
        await new Promise(resolve => setTimeout(resolve, 3000));
        menuOptionWithCharges = (await frame.$x("//*[@id=\"menuButton2\"]/button"))[0];
        await menuOptionWithCharges.click({delay: 1000});

        await new Promise(resolve => setTimeout(resolve, 1000));
        addPartOption = (await frame.$x("//*[contains(@id,'debriefMenu2')] //a[contains(text(),'Add Parts')]"))[0];

        await addPartOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        searchPart = (await frame.$x("//*[contains(@class,'oj-inputsearch-input')]"))[0];
        await searchPart.type('SN004', {delay: 2000});
        await page.keyboard.press('Enter', {delay: 2000});

        //Select the search result
        searchPartResult = await frame.waitForSelector('#tracker li:first-child');
        await searchPartResult.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 3000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        //To generate proforma invoice
        await helper.signAndSave(frame);
        //To validate the charges added
        const closeJsonElem = await page.waitForSelector('#receivedMessageJson-3');
        const closeJson = await closeJsonElem.evaluate(el => el.textContent);
        const closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method').that.equals('close');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('install');
        (closeMessage.actions[0].properties).should.have.property('part_service_activity_used').that.equals('Install');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN005');

        (closeMessage.actions[1]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[1]).should.have.property('action').that.equals('install');
        (closeMessage.actions[1].properties).should.have.property('part_service_activity_used').that.equals('Install');
        (closeMessage.actions[1].properties).should.have.property('invsn').that.equals('SN004');
        //To take the final screenshot
        await page.screenshot({path: 'WithMultipleInventoryWithDistinctSRs.png', fullPage: true});

    }));

    test('Debrief Plugin - To validate add parts by adding same inventory with same serial number multiple times', (async function () {
        this.timeout(500000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let menuOptionWithCharges = null;
        let addPartOption = null;
        let submitButton = null, searchPart = null, searchPartResult = null;
        let criticalError = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add parts
        await frame.focus('#iconFont7 > a');
        addPartOption = (await frame.$x("//a[contains(text(),'Add Parts')]"))[0];
        await addPartOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));
        //Search using serial number
        searchPart = (await frame.$x("//*[contains(@class,'oj-inputsearch-input')]"))[0];
        await searchPart.type('SN005');
        await page.keyboard.press('Enter');
        await searchPart.click({delay: 1000});

        //Select the search result
        searchPartResult = await frame.waitForSelector('#tracker li:first-child');
        await searchPartResult.click({delay: 1000});

        //Click on Submit Button
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 2000});

        //To add second part
        await new Promise(resolve => setTimeout(resolve, 3000));
        menuOptionWithCharges = (await frame.$x("//*[@id=\"menuButton2\"]/button"))[0];
        await menuOptionWithCharges.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        addPartOption = (await frame.$x("//*[contains(@id,'debriefMenu2')] //a[contains(text(),'Add Parts')]"))[0];
        await addPartOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        searchPart = (await frame.$x("//*[contains(@class,'oj-inputsearch-input')]"))[0];
        await searchPart.type('SN005', {delay: 2000});
        await page.keyboard.press('Enter', {delay: 2000});

        //Select the search result
        searchPartResult = await frame.waitForSelector('#tracker li:first-child');
        await searchPartResult.click({delay: 1000});

        //Validate the error
        criticalError = (await frame.$x("//*[contains(@class,'oj-dialog-body')]"))[0];
        const criticalErrorText = await criticalError.evaluate(el => el.innerText);
        criticalErrorText.should.contain('is not available in your inventory. Please update your inventory with this item and proceed.');

        //To take screenshot of final screen
        await page.screenshot({path: 'WithDuplicateInventoryError.png', fullPage: true});

    }));

    test('Debrief Plugin - To validate return parts for a serialised inventory in OFS', (async function () {
        this.timeout(600000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let returnPartsOption = null;
        let submitButton = null, searchPart = null, returnPart = null,
            returnPartSerialNumber = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add parts
        await frame.focus('#iconFont8 > a');
        returnPartsOption = (await frame.$x("//a[contains(text(),'Return Parts')]"))[0];
        await returnPartsOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        searchPart = (await frame.$x("//*[contains(@class,'oj-inputsearch-input')]"))[0];
        //Search Serialized inventory
        await searchPart.type('ECM300001', {delay: 2000});

        await page.keyboard.press('Enter');

        //To Load the Search result of Serialized inventory
        const callProcedureMessageSearchInvJsonElem = await page.waitForSelector('#receivedMessageJson-3');
        const callProcedureMessageSearchInvJson = await callProcedureMessageSearchInvJsonElem.evaluate(el => el.textContent);
        const callProcedureMessageSearchInv = JSON.parse(callProcedureMessageSearchInvJson);

        callProcedureMessageSearchInv.should.have.property('apiVersion').that.equals(1);
        callProcedureMessageSearchInv.should.have.property('method').that.equals('callProcedure');
        callProcedureMessageSearchInv.should.have.property('callId');
        callProcedureMessageSearchInv.should.have.property('procedure').that.equals('searchParts');

        const callIdSearchInv = callProcedureMessageSearchInv.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callIdSearchInv,
            "resultData": {
                "items": [
                    {
                        "catalogId": 599,
                        "itemId": 37294,
                        "label": "ECM300001",
                        "itemType": "part_sn",
                        "linkedItems": [],
                        "fields": {
                            "part_disposition_code": "",
                            "part_item_number": "ECM300001",
                            "part_item_revision": "A",
                            "part_item_desc": "Multi-Directional Joint assembly",
                            "part_uom_code": "zzu"
                        },
                        "images": []
                    }
                ],
                "isContinueAvailable": true,
                "source": "cache",
                "searchId": 1
            }
        }, 0, 4));
        await page.click('#sendMessageButton');

        //To Select the search result
        returnPart = (await frame.$x("//*[contains(@class,'inventory-information')]"))[0];
        await returnPart.click({delay: 1000});
        //Enter Serial Number
        returnPartSerialNumber = (await frame.$x("//input[contains(@class,'oj-inputtext-input')]"))[0];
        await returnPartSerialNumber.type('SN100', {delay: 2000});
        //Submit Return Part
        await new Promise(resolve => setTimeout(resolve, 3000));
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 3000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        //To Submit and sign proforma invoice
        await helper.signAndSave(frame);
        //To valdiate the charges added
        const closeJsonElem = await page.waitForSelector('#receivedMessageJson-4');
        const closeJson = await closeJsonElem.evaluate(el => el.textContent);
        const closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method').that.equals('close');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');
        //To Validate the return items added
        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('create');
        (closeMessage.actions[0]).should.have.property('invtype').that.equals('part_sn');
        (closeMessage.actions[0]).should.have.property('invpool').that.equals('deinstall');
        (closeMessage.actions[0].properties).should.have.property('part_item_number_rev').that.equals('ECM300001');
        (closeMessage.actions[0].properties).should.have.property('part_service_activity_returned').that.equals('Return');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN100');
        //Screenshot of final screen
        await page.screenshot({path: 'WithReturnPartsWithSerializedInventory.png', fullPage: true});

    }));

    test('Debrief Plugin - To validate add parts and return parts with serial number', (async function () {
        this.timeout(600000);

        let frameHandle = null;
        let frame = null;
        let menuButtonElem = null;
        let menuOptionWithCharges = null;
        let addPartOption = null, returnPartsOption = null;
        let submitButton = null, searchPart = null, searchPartResult = null, returnPart = null,
            returnPartSerialNumber = null;

        //To Open Activity
        await helper.openNewActivity(page, openActivity);
        //To switch to frame
        frameHandle = await page.$('#pluginFrame');
        frame = await frameHandle.contentFrame();
        //To identify the menu option and click
        menuButtonElem = await frame.waitForSelector('#menuButton1');
        await menuButtonElem.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //To Add parts
        await frame.focus('#iconFont7 > a');
        addPartOption = (await frame.$x("//a[contains(text(),'Add Parts')]"))[0];
        await addPartOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        //Search using serial number
        searchPart = (await frame.$x("//*[contains(@class,'oj-inputsearch-input')]"))[0];
        await searchPart.type('SN005');
        await page.keyboard.press('Enter');
        await searchPart.click({delay: 1000});

        //Select the search result
        searchPartResult = await frame.waitForSelector('#tracker li:first-child');
        await searchPartResult.click({delay: 1000});

        //Click on Submit Button
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 2000});

        //To add second part
        await new Promise(resolve => setTimeout(resolve, 3000));
        menuOptionWithCharges = (await frame.$x("//*[@id=\"menuButton2\"]/button"))[0];
        await menuOptionWithCharges.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        returnPartsOption = (await frame.$x("//*[contains(@id,'debriefMenu2')] //a[contains(text(),'Return Parts')]"))[0];
        await returnPartsOption.click({delay: 1000});
        await new Promise(resolve => setTimeout(resolve, 1000));

        searchPart = (await frame.$x("//*[contains(@class,'oj-inputsearch-input')]"))[0];
        await searchPart.type('ECM300001', {delay: 2000});
        await page.keyboard.press('Enter', {delay: 2000});

        //To Load the return parts searched
        const callProcedureMessageSearchInvJsonElem = await page.waitForSelector('#receivedMessageJson-3');
        const callProcedureMessageSearchInvJson = await callProcedureMessageSearchInvJsonElem.evaluate(el => el.textContent);
        const callProcedureMessageSearchInv = JSON.parse(callProcedureMessageSearchInvJson);

        callProcedureMessageSearchInv.should.have.property('apiVersion').that.equals(1);
        callProcedureMessageSearchInv.should.have.property('method').that.equals('callProcedure');
        callProcedureMessageSearchInv.should.have.property('callId');
        callProcedureMessageSearchInv.should.have.property('procedure').that.equals('searchParts');

        const callIdSearchInv = callProcedureMessageSearchInv.callId;
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callIdSearchInv,
            "resultData": {
                "items": [
                    {
                        "catalogId": 599,
                        "itemId": 37294,
                        "label": "ECM300001",
                        "itemType": "part_sn",
                        "linkedItems": [],
                        "fields": {
                            "part_disposition_code": "",
                            "part_item_number": "ECM300001",
                            "part_item_revision": "A",
                            "part_item_desc": "Multi-Directional Joint assembly",
                            "part_uom_code": "zzu"
                        },
                        "images": []
                    }
                ],
                "isContinueAvailable": true,
                "source": "cache",
                "searchId": 1
            }
        }, 0, 4));
        await page.click('#sendMessageButton');

        returnPart = (await frame.$x("//*[contains(@class,'inventory-information')]"))[0];
        await returnPart.click({delay: 1000});

        //Enter Serial Number
        returnPartSerialNumber = (await frame.$x("//input[contains(@class,'oj-inputtext-input')]"))[0];
        await returnPartSerialNumber.type('SN100', {delay: 2000});
        //Submit Return Part
        await new Promise(resolve => setTimeout(resolve, 3000));
        submitButton = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitButton.click({delay: 3000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        //To generate proforma invoice
        await helper.signAndSave(frame);
        //To validate the charges added
        const closeJsonElem = await page.waitForSelector('#receivedMessageJson-4');
        const closeJson = await closeJsonElem.evaluate(el => el.textContent);
        const closeMessage = JSON.parse(closeJson);

        closeMessage.should.have.property('apiVersion').that.equals(1);
        closeMessage.should.have.property('method').that.equals('close');
        closeMessage.should.have.property('inventoryList');
        closeMessage.should.have.property('actions');

        (closeMessage.actions[0]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[0]).should.have.property('action').that.equals('install');

        (closeMessage.actions[0].properties).should.have.property('part_service_activity_used').that.equals('Install');
        (closeMessage.actions[0].properties).should.have.property('invsn').that.equals('SN005');

        (closeMessage.actions[1]).should.have.property('entity').that.equals('inventory');
        (closeMessage.actions[1]).should.have.property('action').that.equals('create');
        (closeMessage.actions[1]).should.have.property('invtype').that.equals('part_sn');
        (closeMessage.actions[1]).should.have.property('invpool').that.equals('deinstall');
        (closeMessage.actions[1].properties).should.have.property('part_item_number_rev').that.equals('ECM300001');
        (closeMessage.actions[1].properties).should.have.property('part_service_activity_returned').that.equals('Return');
        (closeMessage.actions[1].properties).should.have.property('invsn').that.equals('SN100');
        //To take screenshot of final screen
        await page.screenshot({path: 'WithMultipleInventoryWithAddAndReturnSRPart.png', fullPage: true});

    }));

    teardown(async () => {
        await browser.close();
    });

});