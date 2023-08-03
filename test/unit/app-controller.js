define(['appController', 'knockout', 'ofsc-connector', 'ojs/ojmodel'], (ControllerViewModel, ko, OfscConnector, ojmodel) => {
    suite('App Controller', () => {
        let controller;
        let routerConfigureStub;
        suiteSetup(async () => {
            routerConfigureStub = sinon.stub();

            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }

                getRouterInstance() {
                    return {
                        configure: routerConfigureStub, moduleConfig: {params: {}}
                    };
                }
            }

            controller = new TestControllerViewModel();
            let laborItems = [];


            laborItems.push({
                id: '1', label: 'FS Overtime Labor', text: 'FS Overtime Labor',
            });
            controller.laborItemEnumCollection = new oj.Collection(laborItems);

        });

        suiteTeardown(async () => {
        });

        setup(() => {
        });

        teardown(() => {
        });
/*
        test('Constructor is working', (() => {
            controller.should.be.instanceOf(ControllerViewModel);
        }));

        test('Constructor configures routing', (() => {
            routerConfigureStub.should.have.been.calledOnce;
            routerConfigureStub.lastCall.lastArg.should.have.all.keys('dashboard', 'add-labor', 'add-expense', 'add-used-part', 'add-returned-part', 'invoice');
            expect(controller.getInvTypePartConst()).equal('part');
            expect(controller.getInvTypePartSnConst()).equal('part_sn');
            controller.logoUrl = 'https://google.com';
            expect(controller.getLogoUrl()).equal('https://google.com');


        }));
 */
    });
        test('addLabor is working', (() => {
            class TestControllerViewModel extends ControllerViewModel {
                constructor() {
                    super();
                }
            }

            const controller = new TestControllerViewModel();
            controller.laborItems = ko.observableArray([]);
            controller.laborActivities = ['1', 'text'];
            controller.laborItemEnumCollection = new oj.Collection([{
                id: "1" || '',
                label: "FS Overtime Labor" || '',
                text: "FS Overtime Labor" || '',
                itemId: "FS Overtime Labor" || ''
            }]);


            controller.laborActivityEnumCollection = new oj.Collection([{
                id: "1" || '',
                label: "FS Overtime Labor" || '',
                text: "FS Overtime Labor" || '',
                itemId: "FS Overtime Labor" || ''
            }]);
            let result;
            expect(controller.addLabor({
                id: "1", activityId: "1", itemId: '1', startTime: 'T00:00:00', endTime: 'T01:00:00'
            })).equals(result);
            expect(controller.addLabor({
                id: "2", activityId: "1", itemId: '1', startTime: 'T00:00:00', endTime: 'T01:00:00', recordId: '123'
            })).equals(result);

        }));




    test('add expense is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.laborItems = ko.observableArray([]);
        controller.expenseItems = ko.observableArray([{
            'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '50', 'currencyKey': 'USD'
        }, {
            'id': '2',
            'activityId': 'Expense',
            'itemId': 'FS Parking',
            'amount': '50',
            'currencyKey': 'USD',
            'recordId': '2'
        }]);
        controller.laborActivities = ['1', 'text'];
        controller.expenseItemEnumCollection = new oj.Collection([{
            id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
        }]);


        controller.expenseActivityEnumCollection = new oj.Collection([{
            id: "1" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
        }]);
        controller.expenseCurrencyEnumCollection = new oj.Collection([{
            id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
        }]);
        let result;
        expect(controller.addExpense({
            activityId: "1", itemId: '1', amount: '50', currencyKey: 'USD'
        })).equals(result);
        expect(controller.addExpense({
            activityId: "1", itemId: '1', amount: '50', currencyKey: 'USD', recordId: '123'
        })).equals(result);
        controller.load();
    }));


    test('removeLabor from is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.laborItems = ko.observableArray([{
            'id': '1',
            'activityId': 'com',
            'itemId': 'FS Overtime Labor',
            'startTime': 'T00:00:00',
            'endTime': 'T01:00:00'
        }, {
            'id': '2',
            'activityId': 'drp',
            'itemId': 'Diagnose & Repair',
            'startTime': 'T00:00:00',
            'endTime': 'T01:00:00',
            'recordId': '2'
        }]);
        controller.deleteInventoryList = [{
            'id': '2',
            'activityId': 'drp',
            'itemId': 'Diagnose & Repair',
            'startTime': 'T00:00:00',
            'endTime': 'T01:00:00',
            'recordId': '2'
        }];
        let result;
        expect(controller.removeLabor(1)).equals(result);

        controller.laborItems = ko.observableArray([{
            'id': '1',
            'activityId': 'com',
            'itemId': 'FS Overtime Labor',
            'startTime': 'T00:00:00',
            'endTime': 'T01:00:00'
        }, {
            'id': '2',
            'activityId': 'drp',
            'itemId': 'Diagnose & Repair',
            'startTime': 'T00:00:00',
            'endTime': 'T01:00:00',
            'recordId': '2'
        }]);
        controller.deleteInventoryList = [];
        expect(controller.removeLabor(1)).equals(result);
    }));

    test('removeExpense is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.expenseItems = ko.observableArray([{
            'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '50', 'currencyKey': 'USD'
        }, {
            'id': '2',
            'activityId': 'Expense',
            'itemId': 'FS Parking',
            'amount': '50',
            'currencyKey': 'USD',
            'recordId': '2'
        }]);
        controller.deleteInventoryList = [{
            'id': '2',
            'activityId': 'Expense',
            'itemId': 'FS Toll',
            'amount': '40',
            'currencyKey': 'USD',
            'recordId': '2'
        }];
        let result;
        expect(controller.removeExpense(1)).equals(result);

        controller.laborItems = ko.observableArray([{
            'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '30', 'currencyKey': 'USD'
        }, {
            'id': '2',
            'activityId': 'Expense',
            'itemId': 'FS Parking',
            'amount': '20',
            'currencyKey': 'USD',
            'recordId': '2'
        }]);
        controller.deleteInventoryList = [];
        expect(controller.removeExpense(1)).equals(result);
    }));

    test('submitPluginData is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
            invid: "2" || '', model: "ECM100001~1234" || '', quantity_delta: 2, invsn: "1234" || ''
        });
        controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
            invid: "2" || '', model: "ECM100005~2345" || '', quantity_delta: 2, invsn: "2345" || ''
        });
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001~1234',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part_sn'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part_sn',
            "invsn": "2345"
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        let result;
        expect(controller.submitPluginData()).equals(result);

    }));


    test('Add and Remove parts is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: 2,
            invsn: "1234" || '',
            "invtype": "part_sn" || ''
        });
        controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: 2,
            invsn: "2345" || '',
            "invtype": "part_sn" || ''
        });
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001~1234',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part_sn'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part_sn',
            "invsn": "2345"
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;

        expect(controller.addUsedPart('ECM100005~2345', "123", 1, '2345')).equals();
        expect(controller.addUsedPart('ECM100005~2345', "123", 1, '2345')).equals();
        expect(controller.removeUsedPart('ECM100005~2345', '2345')).equals();

        expect(controller.removeUsedPart('ECM100006~8888', '8888')).equals(false);

        expect(controller.addReturnedPart(model2, 1, 1, '2345')).equals();

        expect(controller.loadData());

        expect(controller._createDeinstallInventoryAction(model2)).equals();
        expect(controller._generatePartsActions()).equals();

        controller.customerPartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        expect(controller.removeReturnedPart('ECM100005~2345', '2345')).equals();
        controller.returnedPartsCollection = resourcePartsCollection;
        expect(controller.removeReturnedPart('ECM100006~1111', '1111')).equals(false);

    }));


    test('_createDeinstallInventoryAction for part is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: 2,
            invsn: "1234" || '',
            "invtype": "part" || ''
        });
        controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: 2,
            invsn: "2345" || '',
            "invtype": "part" || ''
        });
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001~1234',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part',
            "invsn": "2345"
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;

        expect(controller.addReturnedPart(model2, 1, 1, '2345')).equals();



        expect(controller._createDeinstallInventoryAction(model2)).equals();


    }));

    test('addReturnedPart negative sceanrio is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = new ojmodel.Model({
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: 2,
            invsn: "1234" || '',
            "invtype": "part" || ''
        });
        controller.deinstalledInventoriesSummary["ECM100005~2345"] = new ojmodel.Model({
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: 2,
            invsn: "2345" || '',
            "invtype": "part" || ''
        });
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let resourcePartsCollection1 = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001~1234',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part',
            "invsn": "2345"
        });

        let model3 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100006~2345',
            'part_item_number_rev': 'ECM100006~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1111',
            "invtype": 'part'
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection.add(model3);
        expect(controller.addReturnedPart(model3, 1, 1, '2345')).equals();
        expect(controller.removeUsedPart('ECM100006~2345', '1111')).equals();
        controller.resourcePartsCollection = resourcePartsCollection1;

        expect(controller.removeUsedPart('ECM100006~2345', '1111')).equals();
    }));

    test('_generatePartsActions 1 is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = {
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: 2,
            invsn: "1234" || '',
            "invtype": "part_sn" || ''
        };
        controller.deinstalledInventoriesSummary["ECM100005~2345"] ={
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: -1,
            invsn: "2345" || '',
            "invtype": "part_sn" || ''
        };
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part_sn',
            "invid" : 'ECM100001'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part_sn',
            "invsn": "2345",
            "invid" : 'ECM100001'
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;

        expect(controller.addUsedPart('ECM100005~2345', "123", 1, '2345')).equals();
        expect(controller._generatePartsActions()).equals();

    }));


    test('_generatePartsActions 2 is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = {
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: 10,
            invsn: "1234" || '',
            "invtype": "part" || ''
        };
        controller.deinstalledInventoriesSummary["ECM100005~2345"] ={
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: 10,
            invsn: "2345" || '',
            "invtype": "part" || ''
        };
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part',
            "invid" : 'ECM100001'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part',
            "invsn": "2345",
            "invid" : 'ECM100001'
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;

        //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
        expect(controller._generatePartsActions()).equals();

    }));



    test('_generatePartsActions negative qualtity is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = {
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: -1,
            invsn: "1234" || '',
            "invtype": "part" || ''
        };
        controller.deinstalledInventoriesSummary["ECM100005~2345"] ={
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: -1,
            invsn: "2345" || '',
            "invtype": "part" || ''
        };
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part',
            "invid" : 'ECM100001'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part',
            "invsn": "2345",
            "invid" : 'ECM100001'
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;

        //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
        expect(controller._generatePartsActions()).equals();

    }));

    test('_generatePartsActions negative qualtity for serial number is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = {
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: -1,
            invsn: "1234" || '',
            "invtype": "part_sn" || ''
        };
        controller.deinstalledInventoriesSummary["ECM100005~2345"] ={
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: -1,
            invsn: "2345" || '',
            "invtype": "part_sn" || ''
        };
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part_sn',
            "invid" : 'ECM100001'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part_sn',
            "invsn": "2345",
            "invid" : 'ECM100001'
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;

        //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
        expect(controller._generatePartsActions()).equals();

    }));

    test('_generatePartsActions negative qualtity for serial number is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = {
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: -1,
            invsn: "1234" || '',
            "invtype": "part_sn" || ''
        };
        controller.deinstalledInventoriesSummary["ECM100005~2345"] ={
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: -1,
            invsn: "2345" || '',
            "invtype": "part_sn" || ''
        };
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001~1234',
            'part_item_number_rev': 'ECM100001',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part_sn',
            "invid" : 'ECM100001'
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005~2345',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part_sn',
            "invsn": "2345",
            "invid" : 'ECM100001'
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;

        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;
        //expect(controller.addUsedPart('ECM100001~1234', "123", 1, '1234')).equals();
        expect(controller._generatePartsActions()).equals();

    }));

    test('_generatePartsActions for deinstallInventory part_sn is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = {
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: -1,
            invsn: "1234" || '',
            "invtype": "part_sn" || ''
        };
        controller.deinstalledInventoriesSummary["ECM100005~2345"] ={
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: -1,
            invsn: "2345" || '',
            "invtype": "part_sn" || ''
        };
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001',
            'part_item_number_rev': 'ECM100001',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part_sn',
            "invid" : 1
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part_sn',
            "invsn": "2345",
            "invid" : 2
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;
        expect(controller._generatePartsActions()).equals();

    }));

    test('_generatePartsActions for deinstallInventory for part is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        controller.installedInventoriesSummary = {};
        controller.deinstalledInventoriesSummary = {};
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: "1"
        });
        controller.installedInventoriesSummary["ECM100001~1234"] = {
            invid: "2" || '',
            model: "ECM100001~1234" || '',
            quantity_delta: -1,
            invsn: "1234" || '',
            "invtype": "part" || ''
        };
        controller.deinstalledInventoriesSummary["ECM100005~2345"] ={
            invid: "2" || '',
            model: "ECM100005~2345" || '',
            quantity_delta: -1,
            invsn: "2345" || '',
            "invtype": "part" || ''
        };
        let partModelConstructor = oj.Model.extend({
            idAttribute: 'part_item_number'
        });

        let resourcePartsCollection = new ojmodel.Collection(null, {
            model: partModelConstructor
        });
        let model1 = new ojmodel.Model({
            'id': '5',
            'quantity': 1,
            'part_item_number': 'ECM100001',
            'part_item_number_rev': 'ECM100001',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '1234',
            "invtype": 'part',
            "invid" : 1
        });
        let model2 = new ojmodel.Model({
            'id': '6',
            'quantity': 1,
            'part_item_number': 'ECM100005~2345',
            'part_item_number_rev': 'ECM100005',
            'part_uom_code': 'ea',
            'part_disposition_code': 'M',
            "invsn": '2345',
            "invtype": 'part',
            "invsn": "2345",
            "invid" : 2
        });
        resourcePartsCollection.add(model1);
        resourcePartsCollection.add(model2);
        controller.resourcePartsCollection = resourcePartsCollection;
        controller.customerPartsCollection = resourcePartsCollection;
        controller.returnedPartsCollection = resourcePartsCollection;
        controller.usedPartsCollection = resourcePartsCollection;
        controller.createdDeinstalledPartsCollection  = resourcePartsCollection;
        expect(controller._generatePartsActions()).equals();

    }));

    test('terminatePlugin is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        controller.ofscConnector.sendMessage = function () {
            return Promise.reject(new Error('Communication chanel is busy'));
        }
        let result;
        expect(controller.terminatePlugin()).equals(result);

        controller.ofscConnector.sendMessage = function () {
            return new Promise((resolve, reject) => {
                return resolve({
                    'data': {
                        'actions': [{
                            entity: 'inventory',
                            action: 'create',
                            invpool: 'install',
                            invtype: 'labor',
                            inv_aid: '4232516'
                        }], 'Activity': {'aid': '4232516'}, inventory: {}
                    }
                });
            });
        }
        expect(controller.terminatePlugin()).equals(result);
    }));


    test('_showErrorAlert is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        let data = {
            'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': [{
                'type': 'TYPE_ENTITY_ACTION',
                'code': 'CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED',
                'entity': 'activity',
                'entityId': '4232516'
            }]
        };
        try {
            controller._showErrorAlert(data);
        }catch(e){

        }

        data = {
            'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': [{
                'type': 'TYPE_ENTITY_ACTION',
                'code': 'CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED',
                'entity': 'activity',
                'entityId': '4232516'
            }, {
                'type': 'TYPE_ENTITY_ACTION1',
                'code': 'CODE_ACTION_INVENTORY_ACTIVITY_STATUS_INVALID',
                'entity': 'activity',
                'entityId': '4232517'
            }]
        };
        try {
            controller._showErrorAlert(data);
        }catch(e){

        }

        data = {
            'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': []
        };
        controller._showErrorAlert(data);
        data = {
            'apiVersion': '1', 'method': 'error', 'entity': 'activity', 'errors': [{
                'type': 'TYPE_ENTITY_ACTION',
                'code': 'CODE_ACTION_ON_PAST_DATE_NOT_ALLOWED1',
                'entity': 'activity',
                'entityId': '4232516'
            }]
        };
        try {
           controller._showErrorAlert(data);
        }catch(e){

        }
    }));

    test('_addInstallInventoryAction is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.partsInventoryActionsCollection = new oj.Collection();
        expect(controller._addInstallInventoryAction({
            'invid': '21475998',
            'inv_aid': '4232743',
            'invsn': '',
            'quantity': '3',
            'properties': {'part_service_activity_used': 'Install', 'invsn': 'RI600040'}
        })).equals();
    }));

    test('_addDeinstallInventoryAction is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.partsInventoryActionsCollection = new oj.Collection();
        expect(controller._addDeinstallInventoryAction({
            'invid': '21475998',
            'inv_pid': '4232743',
            'quantity': '3',
            'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
        })).equals();
    }));

    test('_addUndoInstallInventoryAction is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.partsInventoryActionsCollection = new oj.Collection();
        expect(controller._addUndoInstallInventoryAction({
            'invid': '21475998',
            'invsn': '4232743',
            'quantity': '3',
            'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
        })).equals();
    }));

    test('_addUndoDeinstallInventoryAction is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.partsInventoryActionsCollection = new oj.Collection();
        expect(controller._addUndoDeinstallInventoryAction({
            'invid': '21475998',
            'quantity': '3',
            'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
        })).equals();
    }));

    test('_getOfscInventoryListUpdates is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.partsInventoryActionsCollection = new oj.Collection({
            'action': 'update',
            'invid': '123455',
            'inv_aid': '4353454',
            'invtype': 'part_sn',
            'inv_pid': '745884',
            'invsn': 'MF50004',
            'quantity': '3',
            'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
        });
        expect(controller._getOfscInventoryListUpdates()).to.have.property('123455');
    }));

    test('_getOfscPartsInventoryActions is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.partsInventoryActionsCollection = new oj.Collection({
            'action': 'install',
            'invid': '123455',
            'inv_aid': '4353454',
            'invtype': 'part_sn',
            'inv_pid': '745884',
            'invsn': 'MF50004',
            'quantity': '3',
            'properties': {'part_service_activity_used': 'de_Install', 'invsn': 'RI600040'}
        });
        expect(controller._getOfscPartsInventoryActions()).to.have.lengthOf(1);
    }));

    test('_getOfscCreateLaborInventoryActions is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.laborItems = ko.observableArray([{
            'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '30', 'currencyKey': 'USD'
        }, {'id': '2', 'activityId': 'Expense', 'itemId': 'FS Parking', 'amount': '20', 'currencyKey': 'USD'}]);

        controller.resource = new oj.Model({
            id: 12345 || '', name: 'Anton' || ''
        });
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: '234234'
        });

        expect(controller._getOfscCreateLaborInventoryActions()).to.have.lengthOf(2);
    }));

    test('_getOfscCreateExpenseInventoryActions is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.expenseItems = ko.observableArray([{
            'id': '1', 'activityId': 'Expense', 'itemId': 'FS Toll', 'amount': '50', 'currencyKey': 'USD'
        }, {'id': '2', 'activityId': 'Expense', 'itemId': 'FS Parking', 'amount': '50', 'currencyKey': 'USD'}]);
        controller.resource = new oj.Model({
            id: 12345 || '', name: 'Anton' || ''
        });
        controller.ofscActivityModel = new (oj.Model.extend({
            idAttribute: 'aid'
        }))({
            aid: '234234'
        });
        expect(controller._getOfscCreateExpenseInventoryActions()).to.have.lengthOf(2);
    }));

    test('_getOfscDeleteInventoryActions is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.deleteInventoryList = [{
            'id': '2',
            'activityId': 'drp',
            'itemId': 'Diagnose & Repair',
            'startTime': 'T00:00:00',
            'endTime': 'T01:00:00',
            'recordId': '2'
        }];
        const INVENTORY_ENTITY_NAME = "inventory";
        const DELETE_ACTION_NAME = 'delete';
        controller.mapInventoryToDeleteAction = function (inventory) {
            return {
                entity: INVENTORY_ENTITY_NAME, action: DELETE_ACTION_NAME, invid: inventory.recordId
            }
        }
        expect(controller._getOfscDeleteInventoryActions()).to.have.lengthOf(1);
    }));

    test('_verifyProperties is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
        let requiredJson = "{  \"properties\": [{    \n" + "      \"label\": \"part_uom_code\",\n" + "      \"create\": true,\n" + "      \"entity\": \"inventory\",\n" + "      \"type\": \"enum\",\n" + "      \"gui\": \"combobox\",\n" + "      \"duplicate\": 0,\n" + "      \"line_count\": 0,\n" + "      \"name\": {\n" + "        \"lang\": \"en\",\n" + "        \"active\": 0,\n" + "        \"val\": \"Part Unit of Measure\"\n" + "      },\n" + "      \"lookups\": [\n" + "        {\n" + "          \"lang\": \"en\",\n" + "          \"active\": 1,\n" + "          \"val\": \"ea\",\n" + "          \"index\": \"ea\"\n" + "        },\n" + "        {\n" + "          \"lang\": \"en\",\n" + "          \"active\": 1,\n" + "          \"val\": \"m\",\n" + "          \"index\": \"m\"\n" + "        },\n" + "        {\n" + "          \"lang\": \"en\",\n" + "          \"active\": 1,\n" + "          \"val\": \"in\",\n" + "          \"index\": \"in\"\n" + "        }\n" + "      ]\n" + "    }]}"
        const controller = new TestControllerViewModel();
        expect(controller._verifyProperties(requiredJson, attributeDesc)).equals("The following property must be configured: part_uom_code.")


    }));

    test('init load is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";

        controller.ofscConnector.sendMessage = function () {
            return new Promise((resolve, reject) => {
                return resolve({
                    'method': 'init', 'attributeDescription': attributeDesc, 'data': {
                        'actions': [{
                            entity: 'inventory',
                            action: 'create',
                            invpool: 'install',
                            invtype: 'labor',
                            inv_aid: '4232516'
                        }], 'Activity': {'aid': '4232516'}, inventory: {}
                    }
                });
            });
        }
        controller.load();
    }));

    test('load - open is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
       // let attributeDesc = JSON.parse("{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n");
        let attributeDesc1 = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
        let attributeDesc = JSON.parse(attributeDesc1);
       // let attributeDesc = JSON.parse("{ \n" + "    \"part_uom_code\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_uom_code\",\n" + "        \"title\": \"Part Unit of Measure\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\"ea\": {\"text\": \"ea\"  },\n" + "                  \"zzu\": {\"text\": \"ea\" },\n" + "                  \"in\": {\"text\": \"in\" },\n" + "                  \"m\": {\"text\": \"m\"}\n" + "                 }\n" + "        }\n" + "    }");
        controller.ofscConnector.sendMessage = function () {
            return new Promise((resolve, reject) => {
                return resolve({
                    'method': 'open', 'attributeDescription': attributeDesc, 'data': {
                        'actions': [{
                            entity: 'inventory',
                            action: 'create',
                            invpool: 'install',
                            invtype: 'labor',
                            inv_aid: '4232516'
                        }], 'Activity': {'aid': '4232516'}, inventory: {}
                    }
                });
            });
        }
        try{
            controller.load();
        }catch(e){

        }

    }));

    test('load - error is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();
        let attributeDesc = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";

        controller.ofscConnector.sendMessage = function () {
            return new Promise((resolve, reject) => {
                return resolve({
                    'method': 'error', 'attributeDescription': attributeDesc, 'data': {
                        'actions': [{
                            entity: 'inventory',
                            action: 'create',
                            invpool: 'install',
                            invtype: 'labor',
                            inv_aid: '4232516'
                        }], 'Activity': {'aid': '4232516'}, inventory: {}
                    }
                });
            });
        }
        controller.load();
    }));

    test('load - open - flow 1 is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();

        let attributeDesc = "   { \"labor_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_service_activity\",\n" + "        \"title\": \"Labor Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"com\": {\n" + "                \"text\": \"Commute\"\n" + "            },\n" + "            \"drp\": {\n" + "                \"text\": \"Diagnose and Repair\"\n" + "            },\n" + "            \"Labor\": {\n" + "                \"text\": \"Labor\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_number\",\n" + "        \"title\": \"Labor Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"FS Overtime Labor\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"FS Overtime Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"FS Reg Labor\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"FS Regular Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel Time\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_desc\",\n" + "        \"title\": \"Labor Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"trv\": {\n" + "                \"text\": \"FS Tech Actual Travel\"\n" + "            },\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"Overtime Labor (Hours)\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"Overtime Labor Time\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"Regular Labor (Hours)\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"Regular Labor Time\",\n" + "                \"inactive\": true\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_service_activity\",\n" + "        \"title\": \"Expense Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"Expense\": {\n" + "                \"text\": \"Expense\"\n" + "            },\n" + "            \"msc\": {\n" + "                \"text\": \"Miscellaneous\"\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_number\",\n" + "        \"title\": \"Expense Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Toll\": {\n" + "                \"text\": \"FS Toll\"\n" + "            },\n" + "            \"prk\": {\n" + "                \"text\": \"Parking\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_desc\",\n" + "        \"title\": \"Expense Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"prk\": {\n" + "                \"text\": \"Parking Charges for Service\"\n" + "            },\n" + "            \"FS Toll\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges for Service\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_used\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_used\",\n" + "        \"title\": \"Activity (Used)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"IN\": {\n" + "                \"text\": \"Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Install\": {\n" + "                \"text\": \"Install\"\n" + "            },\n" + "            \"W_IN\": {\n" + "                \"text\": \"Warranty Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Install\": {\n" + "                \"text\": \"Warranty Install\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_returned\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_returned\",\n" + "        \"title\": \"Activity (returned)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"RET\": {\n" + "                \"text\": \"Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Return\": {\n" + "                \"text\": \"Return\"\n" + "            },\n" + "            \"W_RET\": {\n" + "                \"text\": \"Warranty Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Return\": {\n" + "                \"text\": \"Warranty Return\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_currency_code\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_currency_code\",\n" + "        \"title\": \"Expense Currency\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"USD\": {\n" + "                \"text\": \"$|US Dollars\"\n" + "            },\n" + "            \"GBP\": {\n" + "                \"text\": \"£|UK Pound\"\n" + "            },\n" + "            \"EUR\": {\n" + "                \"text\": \"€|Euro\"\n" + "            }\n" + "        }\n" + "    }\n" + "}";
        controller.attributeDescription = JSON.parse(attributeDesc);

        let data = JSON.parse("{\n" + "                \"apiVersion\": 1,\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"provider\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"customer\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
        let test = ko.observableArray();
        controller.expenseItemEnumCollection = new oj.Collection([{
            id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
        }]);
        controller.expenseActivityEnumCollection = new oj.Collection([{
            id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "trv" || ''
        }]);
        controller.expenseCurrencyEnumCollection = new oj.Collection([{
            id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
        }]);
        controller.openData = ko.observable(data);
        try {
            controller.open();
        }catch(e){

        }
    }));

    test('load - open - flow 2 is working', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.ofscConnector = new OfscConnector();

        let attributeDesc = "   { \"labor_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_service_activity\",\n" + "        \"title\": \"Labor Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"com\": {\n" + "                \"text\": \"Commute\"\n" + "            },\n" + "            \"drp\": {\n" + "                \"text\": \"Diagnose and Repair\"\n" + "            },\n" + "            \"Labor\": {\n" + "                \"text\": \"Labor\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_number\",\n" + "        \"title\": \"Labor Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"FS Overtime Labor\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"FS Overtime Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"FS Reg Labor\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"FS Regular Labor\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel Time\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"labor_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"labor_item_desc\",\n" + "        \"title\": \"Labor Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"trv\": {\n" + "                \"text\": \"FS Tech Actual Travel\"\n" + "            },\n" + "            \"FS Overtime Labor\": {\n" + "                \"text\": \"Overtime Labor (Hours)\"\n" + "            },\n" + "            \"ovr\": {\n" + "                \"text\": \"Overtime Labor Time\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"FS Reg Labor\": {\n" + "                \"text\": \"Regular Labor (Hours)\"\n" + "            },\n" + "            \"reg\": {\n" + "                \"text\": \"Regular Labor Time\",\n" + "                \"inactive\": true\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_service_activity\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_service_activity\",\n" + "        \"title\": \"Expense Activity\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"Expense\": {\n" + "                \"text\": \"Expense\"\n" + "            },\n" + "            \"msc\": {\n" + "                \"text\": \"Miscellaneous\"\n" + "            },\n" + "            \"trv\": {\n" + "                \"text\": \"Travel\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_number\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_number\",\n" + "        \"title\": \"Expense Item\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"FS Toll\": {\n" + "                \"text\": \"FS Toll\"\n" + "            },\n" + "            \"prk\": {\n" + "                \"text\": \"Parking\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_item_desc\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_item_desc\",\n" + "        \"title\": \"Expense Item Description\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"prk\": {\n" + "                \"text\": \"Parking Charges for Service\"\n" + "            },\n" + "            \"FS Toll\": {\n" + "                \"text\": \"Toll Charges\"\n" + "            },\n" + "            \"tol\": {\n" + "                \"text\": \"Toll Charges for Service\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_used\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_used\",\n" + "        \"title\": \"Activity (Used)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"IN\": {\n" + "                \"text\": \"Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Install\": {\n" + "                \"text\": \"Install\"\n" + "            },\n" + "            \"W_IN\": {\n" + "                \"text\": \"Warranty Install\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Install\": {\n" + "                \"text\": \"Warranty Install\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"part_service_activity_returned\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"part_service_activity_returned\",\n" + "        \"title\": \"Activity (returned)\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"RET\": {\n" + "                \"text\": \"Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Return\": {\n" + "                \"text\": \"Return\"\n" + "            },\n" + "            \"W_RET\": {\n" + "                \"text\": \"Warranty Return\",\n" + "                \"inactive\": true\n" + "            },\n" + "            \"Warranty Return\": {\n" + "                \"text\": \"Warranty Return\"\n" + "            }\n" + "        }\n" + "    },\n" + "    \"expense_currency_code\": {\n" + "        \"fieldType\": \"property\",\n" + "        \"entity\": \"ENTITY_INVENTORY\",\n" + "        \"gui\": \"combobox\",\n" + "        \"label\": \"expense_currency_code\",\n" + "        \"title\": \"Expense Currency\",\n" + "        \"type\": \"enum\",\n" + "        \"access\": \"READ_WRITE\",\n" + "        \"enum\": {\n" + "            \"USD\": {\n" + "                \"text\": \"$|US Dollars\"\n" + "            },\n" + "            \"GBP\": {\n" + "                \"text\": \"£|UK Pound\"\n" + "            },\n" + "            \"EUR\": {\n" + "                \"text\": \"€|Euro\"\n" + "            }\n" + "        }\n" + "    }\n" + "}";
        controller.attributeDescription = JSON.parse(attributeDesc);

        let data = JSON.parse("{\n" + "                \"apiVersion\": 1,\n" + "                \"method\": \"open\",\n" + "                \"entity\": \"activity\",\n" + "                \"user\": {\n" + "                    \"allow_desktop_notifications\": 0,\n" + "                    \"allow_vibration\": 0,\n" + "                    \"design_theme\": 12,\n" + "                    \"format\": {\n" + "                        \"date\": \"m/d/y\",\n" + "                        \"long_date\": \"l, F jS, Y\",\n" + "                        \"time\": \"h:i A\",\n" + "                        \"datetime\": \"m/d/y h:i A\"\n" + "                    },\n" + "                    \"providers\": [\n" + "                        2\n" + "                    ],\n" + "                    \"sound_theme\": 0,\n" + "                    \"su_zid\": 2,\n" + "                    \"uid\": 2315,\n" + "                    \"ulanguage\": 1,\n" + "                    \"ulogin\": \"admin\",\n" + "                    \"uname\": \"Admin\",\n" + "                    \"week_start\": 1,\n" + "                    \"languageCode\": \"en\"\n" + "                },\n" + "                \"resource\": {\n" + "                    \"pid\": 8100422,\n" + "                    \"pname\": \"HOLM, Billy\",\n" + "                    \"currentTime\": \"2022-11-07 17:32:31\",\n" + "                    \"deviceUTCDiffSeconds\": 1,\n" + "                    \"timeZoneDiffSeconds\": -18000\n" + "                },\n" + "                \"team\": {\n" + "                    \"teamMembers\": {},\n" + "                    \"assistingTo\": {},\n" + "                    \"assistingMe\": []\n" + "                },\n" + "                \"queue\": {\n" + "                    \"date\": \"2022-11-07\",\n" + "                    \"status\": \"activated\",\n" + "                    \"isActual\": true,\n" + "                    \"activationTime\": \"2022-11-07 17:32:00\"\n" + "                },\n" + "                \"activity\": {\n" + "                    \"caddress\": \"3621 Vineyard Drive\",\n" + "                    \"ccity\": \"Cleveland\",\n" + "                    \"cname\": \"Cathy V France\",\n" + "                    \"czip\": \"44103\",\n" + "                    \"cstate\": \"OH\",\n" + "                    \"appt_number\": null,\n" + "                    \"ETA\": \"05:32 PM\",\n" + "                    \"astatus\": \"started\",\n" + "                    \"aid\": \"4232035\",\n" + "                    \"travel\": null,\n" + "                    \"csign\": null,\n" + "                    \"ccompany\": null,\n" + "                    \"invoice\": null,\n" + "                    \"XA_DEBRIEF_COMPLETED\": null,\n" + "                    \"temporary_aid\": \"16678602780-4394\"\n" + "                },\n" + "                \"activityList\": {\n" + "                    \"4232035\": {\n" + "                        \"caddress\": \"3621 Vineyard Drive\",\n" + "                        \"ccity\": \"Cleveland\",\n" + "                        \"cname\": \"Cathy V France\",\n" + "                        \"czip\": \"44103\",\n" + "                        \"cstate\": \"OH\",\n" + "                        \"appt_number\": null,\n" + "                        \"ETA\": \"05:32 PM\",\n" + "                        \"astatus\": \"started\",\n" + "                        \"aid\": \"4232035\",\n" + "                        \"travel\": null,\n" + "                        \"csign\": null,\n" + "                        \"ccompany\": null,\n" + "                        \"invoice\": null,\n" + "                        \"XA_DEBRIEF_COMPLETED\": null,\n" + "                        \"temporary_aid\": \"16678602780-4394\"\n" + "                    }\n" + "                },\n" + "                \"inventoryList\": {\n" + "                   \"5\": {\n" + "                       \"id\": \"5\",\n" + "                       \"quantity\": 1,\n" + "                       \"part_item_number\": \"ECM100001~1234\",\n" + "                       \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                       \"part_uom_code\": \"ea\",\n" + "                       \"part_disposition_code\": \"M\",\n" + "                       \"invsn\": \"1234\",\n" + "                       \"invtype\": \"part\",\n" + "                       \"invpool\": \"provider\"\n" + "                   },\n" + "                    \"6\": {\n" + "                        \"id\": \"6\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"customer\"\n" + "                    },\n" + "                    \"7\": {\n" + "                        \"id\": \"7\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"install\"\n" + "                    },\n" + "                    \"8\": {\n" + "                        \"id\": \"8\",\n" + "                        \"quantity\": 1,\n" + "                        \"part_item_number\": \"ECM100001~1234\",\n" + "                        \"part_item_number_rev\": \"ECM100001~1234\",\n" + "                        \"part_uom_code\": \"ea\",\n" + "                        \"part_disposition_code\": \"M\",\n" + "                        \"invsn\": \"1234\",\n" + "                        \"invtype\": \"part\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"9\": {\n" + "                        \"id\": \"9\",\n" + "                        \"quantity\": 1,\n" + "                        \"labor_service_activity\": \"FS Reg Labour\",\n" + "                        \"labor_item_number\": \"ECM100001~1234\",\n" + "                        \"labor_start_time\": \"ea\",\n" + "                        \"labor_end_time\": \"M\",\n" + "                        \"invid\": \"1234\",\n" + "                        \"invtype\": \"labour\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    },\n" + "                    \"FS Toll\": {\n" + "                        \"id\": \"FS Toll\",\n" + "                        \"quantity\": 1,\n" + "                        \"expense_service_activity\": \"FS Toll\",\n" + "                        \"expense_item_number\": \"FS Toll\",\n" + "                        \"expense_amount\": \"10\",\n" + "                        \"expense_currency_code\": \"USD\",\n" + "                        \"invid\": \"12345\",\n" + "                        \"invtype\": \"expense\",\n" + "                        \"invpool\": \"deinstall\"\n" + "                    }\n" + "                },\n" + "                \"buttonId\": \"20634\",\n" + "                \"openParams\": {},\n" + "                \"allowedProcedures\": {\n" + "                    \"openLink\": true,\n" + "                    \"searchParts\": true,\n" + "                    \"searchPartsContinue\": true,\n" + "                    \"getParts\": true,\n" + "                    \"getPartsCatalogsStructure\": true,\n" + "                    \"print\": true,\n" + "                    \"share\": true,\n" + "                    \"updateIconData\": true,\n" + "                    \"updateButtonsIconData\": true\n" + "                }\n" + "            }");
        let test = ko.observableArray();
        controller.expenseItemEnumCollection = new oj.Collection([{
            id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "FS Toll" || ''
        }]);
        controller.expenseActivityEnumCollection = new oj.Collection([{
            id: "10" || '', label: "FS Toll" || '', text: "FS Toll" || '', itemId: "trv" || ''
        }]);
        controller.expenseCurrencyEnumCollection = new oj.Collection([{
            id: "USD" || '', label: "USD" || '', text: "USD" || '', itemId: "USD" || ''
        }]);
        controller.openData = ko.observable(data);
        try {
            controller.open();
        }catch(e){

        }
    }));

    test('Get Constants', (() => {
        class TestControllerViewModel extends ControllerViewModel {
            constructor() {
                super();
            }
        }

        const controller = new TestControllerViewModel();
        controller.getInvTypePartConst();
        controller.getInvTypePartSnConst();
        controller.getLogoUrl();
    }));


});