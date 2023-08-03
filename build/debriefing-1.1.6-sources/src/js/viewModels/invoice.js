/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([
    'knockout',
    'jquery',
    'ojs/ojcore',
    '../utils/signature',
    '../utils/html-page',
    '../utils/dom',
    'ojs/ojknockout-model',
    'ojs/ojdatetimepicker',
    'ojs/ojcollectiontabledatasource'
], function (
    ko,
    $,
    oj,
    Signature,
    HtmlPage,
    dom
) {

    var constructScreen = function () {
        var screen = new InvoiceViewModel();
        return screen;
    };
    const pageBreakHTML = '<div class="html2pdf__page-break"></div>';
    const htmlPage = new HtmlPage(1000);
    const html2pdfOptions = {
        jsPDF: {
            unit: 'pt',
            format: 'a4',
            orientation: 'p'
        },
        margin: 20,
        image: { type: 'jpeg' },
        html2canvas: { useCORS: true, scale: 2 }
    };

    class InvoiceViewModel {
        constructor() {

            this.invoiceSignature = null;
            this.printableForm = null;
            this.printableFormId = 'printableForm';
            this.canvasID = 'canvas_invoice';
            this.canvasClearButtonID = "button_clear_canvas";
            this.printableCanvasID = 'printableSignatureCanvas';

            this.fileName = 'pro_forma_invoice.pdf';


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

                this.laborItems = this._controller.laborItems;
                this.dateTimeConverter = this._controller.dateTimeConverter;
                this.timeConverter = this._controller.timeConverter;

                this._activityModel = this._controller.ofscActivityModel;

                this.customer = oj.KnockoutUtils.map(this._controller.customer);
                this.resource = oj.KnockoutUtils.map(this._controller.resource);
                this.logoUrl = this._controller.logoUrl();
                this.isEmptyLogo = ko.pureComputed(() => (this.logoUrl.length > 0) );

                //Labor
                this.totalHoursText = ko.observable("");

                this.laborsTotalHours = ko.pureComputed(function () {

                    let overallDuration = 0;

                    if (this.laborItems().length > 0) {
                        this.laborItems().forEach((labor) => {

                            let duration = (this.dateTimeConverter.compareISODates(
                                this.dateTimeConverter.parse(labor.endTime),
                                this.dateTimeConverter.parse(labor.startTime)
                            ) / 1000 / 60 / 60).toFixed(2);

                            duration = duration < 0 ? +duration + 24 : duration;

                            overallDuration += parseFloat(duration);
                        });
                    }
                    this.totalHoursText("hrs");
                    return overallDuration.toFixed(2);
                }.bind(this));


                //Expense
                this.expenseItems = this._controller.expenseItems;

                this.currencySign = ko.observable("");

                this.totalExpensesAmount = ko.pureComputed(function () {

                    let overallAmount = 0;

                    if (this.expenseItems().length > 0) {
                        this.expenseItems().forEach((expense) => {
                            overallAmount += parseFloat(expense.amount);
                            this.currencySign(expense.currency_sign);
                        });
                    }

                    return overallAmount;
                }.bind(this));

                this.stateCityText = ko.pureComputed(function () {

                    let state =  this.customer.state();
                    let city = this.customer.city();

                    if (state && city) {
                        return state + ", " + city;
                    }
                    else if (state && !city) {
                        return state;
                    }
                    else if (!state && city) {
                       return city;
                    }
                    else {
                        return "";
                    }
                }.bind(this));

                 this.workOrderText= ko.pureComputed(function () {

                     let workorder =  this.customer.workorder();

                     if (workorder) {
                         return "WO" + workorder;
                     }
                     else {
                         return "";
                     }
                 }.bind(this));

                this.currentDate = ko.pureComputed(function () {

                    let m_names = ["Jan", "Feb", "Mar",
                        "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                        "Oct", "Nov", "Dec"];

                    let d = new Date();
                    let curr_date = d.getDate();
                    let curr_month = d.getMonth();
                    let curr_year = d.getFullYear();

                    return curr_date + " " + m_names[curr_month] + " " + curr_year;
                }.bind(this));

                this.usedPartsList = this._controller.usedPartsCollection
                    .filter(model => model.get('quantity') > 0)
                    .map(model => this.getInventoryViewModel(model))
                    .sort((first, second) => {
                        let firstName = first.inventory.get('part_item_number') || '';
                        let secondName = second.inventory.get('part_item_number') || '';
                        return firstName.toString().localeCompare(secondName);
                    });

                this.returnedPartsList = this._controller.returnedPartsCollection
                    .filter(model => model.get('quantity') > 0)
                    .map(model => this.getInventoryViewModel(model))
                    .sort((firstReturn, secondReturn) => {
                        let firstName = firstReturn.inventory.get('part_item_number') || '';
                        let secondName = secondReturn.inventory.get('part_item_number') || '';
                        return firstName.toString().localeCompare(secondName);
                    });
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

                this.printableForm = document.getElementById(this.printableFormId);

                this._initSignature();
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
             * @param {Node} info.element - DOM element or         * @param {Number} duration - duration in minutes
             * @return {String} - duration in the format of h:i (0:59, 10:08 etc) where the binding is attached. This may be a 'virtual' element (comment node).
             * @param {Function} info.valueAccessor - The binding's value accessor.
             * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
             */
            this.handleDetached = function (info) {
                // Implement if needed

                //TODO really needed?
                this.invoiceSignature = null;
            };
        }

        getInventoryViewModel(inventory) {
            let uomText = '';

            if (this._controller.attributeDescription.part_uom_code && this._controller.attributeDescription.part_uom_code.enum && this._controller.attributeDescription.part_uom_code.enum[inventory.get('part_uom_code')]) {
                uomText = this._controller.attributeDescription.part_uom_code.enum[inventory.get('part_uom_code')].text;
            }

            if (uomText !== '') {
                uomText = ' ' + uomText;
            }


            return {
                id: inventory.get('part_item_number_rev'),
                inventory: inventory,
                measuredQuantity: `${inventory.get('quantity')}${uomText}`,
                dispositionText: inventory.get('part_disposition_code') &&
                    this._controller.attributeDescription.part_disposition_code &&
                    this._controller.attributeDescription.part_disposition_code.enum &&
                    this._controller.attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')] &&
                    this._controller.attributeDescription.part_disposition_code.enum[inventory.get('part_disposition_code')].text
            };
        }

        formatDuration(data) {

           let startTime = data.startTime;
           let endTime = data.endTime;

            let hrsText = "";

            hrsText = "hrs";
            let formatedDuration = (this.dateTimeConverter.compareISODates(
                this.dateTimeConverter.parse(endTime),
                this.dateTimeConverter.parse(startTime)
            ) / 1000 / 60 / 60).toPrecision(2);

            formatedDuration = formatedDuration < 0 ? +formatedDuration + 24 : formatedDuration;

            return formatedDuration + " " + hrsText;

        }

        formatTime(isoTime) {
            return this.timeConverter.format(isoTime);
        }

        _initSignature() {

            let canvas = document.getElementById(this.canvasID);

            let canvasChangeHandler = function () {// This is intentional
                 };

            let clearHandler = document.getElementById(this.canvasClearButtonID);

            this.invoiceSignature = new Signature(canvas, clearHandler, false);
            clearHandler.signature = this.invoiceSignature;
            canvas.signature = this.invoiceSignature;

            if (clearHandler) {
                clearHandler.addEventListener(
                    'click',
                    function () {
                        this.signature.clear();
                    },
                    false
                );

                canvas.addEventListener('mouseup', canvasChangeHandler);
                canvas.addEventListener('touchend', canvasChangeHandler);
                canvas.addEventListener('pointerup', canvasChangeHandler);
            }
        }

        onCloseButtonClick() {
            this._controller.router.go('dashboard', {historyUpdate: 'replace'});
        }

        onSubmitButtonClick() {
            this.copySignatureCanvasToPrintableElementAsImage();

            this.insertPageBreaks(this.printableForm);

            this.generatePDF();
        }

        copySignatureCanvasToPrintableElementAsImage() {
            let context =document.getElementById(this.printableCanvasID).getContext('2d');
            context.scale(0.5,0.5);
            context.canvas.width = 450;
            context.canvas.height= 300;
            context.drawImage(document.getElementById(this.canvasID), 0, 0);

        }

        /**
         *
         * @param {HTMLElement} parentElement
         * @param {Number} startVerticalPosition
         * @param {Number} callLevel
         * @returns {Number} vertical position
         */
        insertPageBreaks (parentElement, startVerticalPosition = 0, callLevel = 0) {
            const childrenElements = parentElement.children;
            const isMaxCallLevel = (callLevel === 2);

            let verticalPosition = Number(startVerticalPosition);

            [...childrenElements].forEach(el => {
                const elHeight = (callLevel === 0) ?
                    el.offsetHeight :
                    dom.offsetHeightWithMargin(el);
                const nextHeight = verticalPosition + elHeight;

                if (htmlPage.isExceedPageHeight(elHeight) && !isMaxCallLevel) {
                    verticalPosition = this.insertPageBreaks(el, verticalPosition, callLevel + 1);

                } else if (htmlPage.isExceedPageHeight(nextHeight) && !isMaxCallLevel) {
                    verticalPosition = this.insertPageBreaks(el, verticalPosition, callLevel + 1);

                } else if (htmlPage.isExceedPageHeight(nextHeight) && isMaxCallLevel) {
                    dom.insertHTMLBeforeElement(pageBreakHTML, el);
                    verticalPosition = htmlPage.remainingPageHeight(elHeight);

                } else {
                    verticalPosition = htmlPage.remainingPageHeight(nextHeight);

                }

            });

            return verticalPosition;
        }

        generatePDF() {
            
           html2pdf().from(this.printableForm).set(html2pdfOptions).outputPdf('blob').then((result) => {
              this.saveForm(new Blob([result], {type: "application/pdf"}));
            });

          
        }

        /**
         * @param {jsPDF|String} fileData
         */
        saveForm(blob) {
            this.setActivityModelInvoice(blob);

            if (!this.invoiceSignature.isEmpty()) {
                this.setActivityModelSignature(this.invoiceSignature.getDataString());
            }

            this._controller.submitPluginData();
        }

        /**
         * @param {jsPDF|String} fileData
         */
        setActivityModelInvoice(fileData) {
            this._activityModel.set('invoice', {
                fileName: this.fileName,
                fileContents: fileData
            });
        }

        /**
         * @param {String} signature
         */
        setActivityModelSignature(signature) {
            this._activityModel.set('csign', signature);
        }
    }

    return constructScreen;
});
