define(['knockout', 'viewModels/add-labor', 'appController'], (ko, AddLaborViewModel, ControllerViewModel) => {

    suite('AddLaborViewModel', () => {

        suiteSetup(async () => {

        });

        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('AddLaborViewModel - handleActivated - branch1 is working', (() => {

            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }]),
                                isStartTimeValid: true,
                                isEndTimeValid: true,
                                addLabor: function (){},
                                router: oj.Router.rootInstance,
                                onStartTimeValidChanged: function (){},
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleActivated(info);
                screen.startTime.subscribe('07:00');
                screen.durationHours();
                screen.addLabor();
            }).should.not.throw();
            expect(screen.laborItemDescription()).equals("FS Travel Labor");
            expect(screen.isSubmitDisabled()).equals(false);
        }));


        test('AddLaborViewModel - handleActivated - branch2 is working', (() => {

            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '',
                                    'label': 'FS Travel Labor'
                                }]),
                                isStartTimeValid: true,
                                isEndTimeValid: true,
                                addLabor: function (){},
                                router: oj.Router.rootInstance,
                                onStartTimeValidChanged: function (){},
                                checkValidationGroup(){
                                    return true;
                                }
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleActivated(info);
                screen.startTime.subscribe('07:00');
                screen.durationHours();
                screen.addLabor();
            }).should.not.throw();
            expect(screen.laborItemDescription()).equals('');
        }));

        test('AddLaborViewModel - handleDetached is working', (() => {

            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'text': 'Commute',
                                    'id': '2',
                                    'text': 'Diagnose and Repair',
                                    'id': '3',
                                    'text': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'text': 'FS Overtime Labor',
                                    'id': '2',
                                    'text': 'FS Reg Labor',
                                    'id': '3',
                                    'text': 'FS Travel Labor'
                                }])
                            }
                        }
                    };
                }
            };
            (() => {
                screen.durationHours()
                screen.handleDetached(info);
            }).should.not.throw();
        }));

        test('AddLaborViewModel - handleBindingsApplied is working', (() => {

            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }])
                            }
                        }
                    };
                }
            };
            (() => {
                screen.handleBindingsApplied(info);
            }).should.not.throw();
        }));

        test('AddLaborViewModel - addLabor is working', (() => {
            var screen = new AddLaborViewModel();

            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }]),
                                startTime: '07:00',
                                endTime: '07:15',
                                checkValidationGroup(){
                                    return false;
                                }
                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen._validateBillingType = function (){
                return false;
            }
            screen._validateBillingItem = function (){
                return false;
            }
            screen.addLabor(info);
        }));

        test('AddLaborViewModel - onCloseButtonClick is working', (() => {
            var screen = new AddLaborViewModel();
            var addLaborStub = sinon.spy();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }])
                            }
                        }
                    };
                }
            };
            screen.handleActivated(info);
            addLaborStub.should.have.been.calledOnce;
        }));

        test('AddLaborViewModel - durationHours - branch1 is working', () => {
            var screen = new AddLaborViewModel();
            var info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                laborActivityEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'Commute',
                                    'id': '2',
                                    'label': 'Diagnose and Repair',
                                    'id': '3',
                                    'label': 'Labor'
                                }]),
                                laborItemEnumCollection: new oj.Collection([{
                                    'id': '1',
                                    'label': 'FS Overtime Labor',
                                    'id': '2',
                                    'label': 'FS Reg Labor',
                                    'id': '3',
                                    'label': 'FS Travel Labor'
                                }])
                            }
                        }
                    };
                }
            };
            (() => {
                screen._controller = info.valueAccessor().params.app;
                screen.durationHours();
            }).should.not.throw();
        });

        test('AddLaborViewModel - durationHours - branch2 is working', () => {
            var screen = new AddLaborViewModel();
            let dateTimeConverterStub = sinon.stub();
            (() => {
                screen.startTime = ko.observable(' ');
                screen.endTime = ko.observable('07:00');
                screen.dateTimeConverter = dateTimeConverterStub;
                screen.dateTimeConverter.parse = function (){};
                screen.dateTimeConverter.compareISODates = function (){};
                screen.durationHours();
            }).should.not.throw();
            dateTimeConverterStub.should.have.been.calledOnce;
        });

        test('AddLaborViewModel - startTime is empty', () => {
            var screen = new AddLaborViewModel();
            var startTime = " ";
            screen.durationValidator.validate(startTime);
            assert.should.throw()
        });

        test('AddLaborViewModel - durationHours is valid', () => {
            var screen = new AddLaborViewModel();
            var startTime = "07:00";

            (() => {
                screen.durationValidator.validate(startTime);
            }).should.not.throw();
        });

        test('AddLaborViewModel - durationHours is invalid', () => {
            var screen = new AddLaborViewModel();
            var startTime = '';

            (() => {
                screen.durationValidator.validate(startTime);
            }).should.throw(oj.ValidatorError);
        });

        test('onCloseButtonClick is working', (() => {
            let screen = new AddLaborViewModel();
            let info = {
                valueAccessor: () => {
                    return {
                        params: {
                            app: {
                                router: oj.Router.rootInstance

                            }
                        }
                    };
                }
            };
            screen._controller = info.valueAccessor().params.app;
            screen.onCloseButtonClick();
        }));

    });

});