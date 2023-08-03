const attributeDescription = require("./attribute-description-mock");

module.exports = {
    openIframe: async (page) => {

        await page.goto('http://localhost:49443/test/test.html', {waitUntil: 'domcontentloaded'});
        await page.click('#openIframeButton');
        await page.waitForSelector('#receivedMessageJson-1');

    },
    signAndSave: async (frame) => {

        let signAndSave = (await frame.$x("//*[contains(text(),'Sign and Save')]/ancestor::button"))[0];
        await signAndSave.click({delay: 3000});
        await new Promise(resolve => setTimeout(resolve, 3000));
        let signature = (await frame.$x("//*[@id=\"canvas_invoice\"]"))[0];
        await signature.click({delay: 2000});
        const submitReport = (await frame.$x("//*[contains(text(),'Submit')]/ancestor::button"))[0];
        await submitReport.click({delay: 2000});
    },
    openPlugin: async (page) => {
        await page.goto('http://localhost:49443/test/test.html', {waitUntil: 'domcontentloaded'});
        await page.click('#openIframeButton');

        const readyMessageJsonElem = await page.waitForSelector('#receivedMessageJson-1');
        const readyMessageJson = await readyMessageJsonElem.evaluate(el => el.textContent);

        JSON.parse(readyMessageJson).should.eql({
            "apiVersion": 1,
            "method": "ready",
            "sendInitData": true
        });
    },
    initializePlugin: async (page) => {
        await page.goto('http://localhost:49443/test/test.html', {waitUntil: 'domcontentloaded'});
        await page.click('#openIframeButton');

        await page.waitForSelector('#receivedMessageJson-1');

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "init",
            "attributeDescription": attributeDescription,
            "buttons": [
                {
                    "buttonId": "20634",
                    "params": {}
                },
                {
                    "buttonId": "32278",
                    "params": {}
                }
            ]
        }, 0, 4));

        await page.click('#sendMessageButton');

        const initEndMessageJsonElem = await page.waitForSelector('#receivedMessageJson-2');
        const initEndMessageJson = await initEndMessageJsonElem.evaluate(el => el.textContent);

        JSON.parse(initEndMessageJson).should.eql({
            "apiVersion": 1,
            "method": "initEnd"
        });

        await page.screenshot({path: 'initend.png', fullPage: true});

    },
    openNewActivity: async (page, activity) => {
        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify(activity, 0, 4));

        await page.click('#sendMessageButton');

        const callProcedureMessageJsonElem = await page.waitForSelector('#receivedMessageJson-2');
        const callProcedureMessageJson = await callProcedureMessageJsonElem.evaluate(el => el.textContent);
        const callProcedureMessage = JSON.parse(callProcedureMessageJson);

        callProcedureMessage.should.have.property('apiVersion', 1);
        callProcedureMessage.should.have.property('method', "callProcedure");
        callProcedureMessage.should.have.property('callId');
        callProcedureMessage.should.have.property('procedure', "getPartsCatalogsStructure");

        const callId = callProcedureMessage.callId;

        await page.$eval('#sendMessageJson', (el, json) => el.value = json, JSON.stringify({
            "apiVersion": 1,
            "method": "callProcedureResult",
            "callId": callId,
            "resultData": []
        }, 0, 4));

        await page.click('#sendMessageButton');

    }
};