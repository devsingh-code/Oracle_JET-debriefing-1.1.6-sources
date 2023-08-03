/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([
    'knockout',
    'jquery',
    'utils/dom',
    'ojs/ojcore',
    'ojs/ojarraydataprovider',
    'ojs/ojselectcombobox',
    'ojs/ojinputtext',
    'ojs/ojdatetimepicker',
    'ojs/ojmessages',
    'ojs/ojvalidationgroup',
    'ojs/ojformlayout'
], function (
    ko,
    $,
    dom,
    oj,
    ArrayDataProvider
) {
    let constructScreen = function () {
        return new AddLaborViewModel();
    };

    class AddLaborViewModel {
        constructor() {
            this.activityId = ko.observable('');
            this.laborItemId = ko.observable('');
            this.startTime = ko.observable('');
            this.endTime = ko.observable('');

            this.selectMessagesCustomBillingType = ko.observable([]);
            this.selectMessagesCustomBillingItem = ko.observable([]);

            this.dataValidation = {
                detail: "Enter a valid value.",
                summary: "",
                severity: "error",
            };

            this.isStartTimeValid = ko.observable(true);
            this.isEndTimeValid = ko.observable(true);

            this.isSubmitDisabled = ko.pureComputed(() => {
                return !(this.isStartTimeValid() && this.isEndTimeValid());
            });

            this.laborItemDescription = ko.pureComputed(() => {
                return this.laborItemId() ? this.laborItemEnumCollection.get(this.laborItemId()).get('label') : '';
            });

            this.durationHours = ko.pureComputed(() => {
                if (!this.startTime() || !this.endTime()) {
                    return '';
                }

                let duration = (this.dateTimeConverter.compareISODates(
                    this.dateTimeConverter.parse(this.endTime()),
                    this.dateTimeConverter.parse(this.startTime())
                ) / 1000 / 60 / 60).toFixed(2);
                return duration < 0 ? +duration + 24 : duration;
            });

            /**
             * Optional ViewModel method invoked when this ViewModel is about to be
             * used for the View transition.  The application can put data fetch logic
             * here that can return a Promise which will delay the handleAttached function
             * call below until the Promise is resolved.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
             * the promise is resolved
             */
            this.handleActivated = function (info) {
                this._controller = info.valueAccessor().params.app;

                this.laborActivityEnumCollection = this._controller.laborActivityEnumCollection;
                this.laborItemEnumCollection = this._controller.laborItemEnumCollection;

                this.dateTimeConverter = this._controller.dateTimeConverter;

                this.activityEnumArray = new ArrayDataProvider(this.laborActivityEnumCollection.map((model) => {
                    return {
                        value: model.get('id'),
                        label: model.get('text')
                    }
                }), {keyAttributes: "value"});
                this.activityId(this.activityEnumArray.data[0].value);
                this.laborItemEnumArray = new ArrayDataProvider(this.laborItemEnumCollection.map((model) => {
                    return {
                        value: model.get('id'),
                        label: model.get('label')
                    }
                }), {keyAttributes: "value"});
                this.laborItemId(this.laborItemEnumArray.data[0].value);
            };

            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
             */
            this.handleAttached = function (info) {
                // Implement if needed
            };


            /**
             * Optional ViewModel method invoked after the bindings are applied on this View.
             * If the current View is retrieved from cache, the bindings will not be re-applied
             * and this callback will not be invoked.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             */
            this.handleBindingsApplied = function (info) {
                dom.resetScrolling();
            };

            /*
             * Optional ViewModel method invoked after the View is removed from the
             * document DOM.
             * @param {Object} info - An object with the following key-value pairs:
             * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
             */
            this.handleDetached = function (info) {
                // Implement if needed
                this.activityId('');
                this.laborItemId('');
            };

            this.startTime.subscribe(() => {
                document.getElementById('endTimeEl').validate();
            });

            this.appMessages = ko.observable();

            this.durationValidator = {
                validate: value => {
                    let compareTo = this.startTime();
                    if (!value && !compareTo) {
                        throw new oj.ValidatorError("Time should be indicated", "Please, input time.");
                    } else if (value < compareTo) {
                        this.appMessages([{
                            summary: 'Info',
                            detail: 'Overnight',
                            severity: oj.Message.SEVERITY_TYPE['INFO']
                        }]);

                    } else {
                        return;
                    }
                }
            }

            this.onStartTimeValidChanged = event => {
                this.isStartTimeValid(event.detail.value === 'valid');
            }

            this.onEndTimeValidChanged = event => {
                this.isEndTimeValid(event.detail.value === 'valid');
            }
        }

        addLabor() {
            const valid = this._controller.checkValidationGroup();
            const validBillingType = this._validateBillingType(this.activityId);
            const validBillingItem = this._validateBillingItem(this.laborItemId);

            if (valid && !validBillingType)
                this.selectMessagesCustomBillingType([this.dataValidation]);
            if (valid && !validBillingItem)
                this.selectMessagesCustomBillingItem([this.dataValidation]);

            if (valid && validBillingType && validBillingItem) {
                this._controller.addLabor({
                    activityId: this.activityId(),
                    itemId: this.laborItemId(),
                    startTime: this.startTime(),
                    endTime: this.endTime()
                });

                this._controller.router.go('dashboard', {historyUpdate: 'replace'});
            }
        }

        _validateBillingType() {
            return !!this.activityEnumArray.data.find(e => e.value === this.activityId())
        }

        _validateBillingItem() {
            return !!this.laborItemEnumArray.data.find(e => e.value === this.laborItemId())
        }

        onCloseButtonClick() {
            this._controller.router.go('dashboard', {historyUpdate: 'replace'});
        }

    }

    return constructScreen;
});
