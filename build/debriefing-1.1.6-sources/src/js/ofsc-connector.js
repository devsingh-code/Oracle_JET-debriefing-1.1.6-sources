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
"use strict";
define(['signals'], (Signal) => {
    const OFSC_API_VERSION = 1;

    class OfscConnector {
        constructor() {
            window.addEventListener("message", this.onPostMessage.bind(this), false);

            this.debugMessageSentSignal = new Signal();
            this.debugMessageReceivedSignal = new Signal();
            this.debugIncorrectMessageReceivedSignal = new Signal();

            this.messageFromOfscSignal = new Signal();

            this._currentCommunicationCallback = null;
            this._currentCommunicationPromise = null;
        }

        /**
         * @param {Object} data
         * @returns {Promise.<*>}
         */
        sendMessage(data) {
            if (this._currentCommunicationPromise) {
                return Promise.reject(new Error('Communication chanel is busy'));
            }

            this._currentCommunicationPromise = new Promise((resolve, reject) => {

                let originUrl = document.referrer || (document.location.ancestorOrigins && document.location.ancestorOrigins[0]) || '';

                if (originUrl) {
                    this._currentCommunicationCallback = (responseData) => {
                        this._currentCommunicationCallback = null;
                        this._currentCommunicationPromise = null;

                        if (responseData instanceof Error) {
                            return reject(responseData);
                        }

                        if (responseData.method && responseData.method === 'error') {
                            return reject(responseData);
                        }

                        return resolve(responseData);
                    };

                    data.apiVersion = OFSC_API_VERSION;

                    parent.postMessage(data, this.constructor._getOrigin(originUrl));
                    this.debugMessageSentSignal.dispatch(data);
                } else {
                    return reject("Unable to get referrer");
                }
            });
            return this._currentCommunicationPromise;
        }


        onPostMessage(event) {
            // Ignore internal JET messages
            if (event.source === window) {
                return;
            }

            if (typeof event.data === 'undefined') {
                this.debugIncorrectMessageReceivedSignal.dispatch("No data");
                if (this._currentCommunicationCallback) {
                    this._currentCommunicationCallback(new Error('No data'));
                    return;
                }

                return false;
            }

            let data;

            try {
                data = JSON.parse(event.data);
            } catch (e) {
                if (this._currentCommunicationCallback) {
                    this._currentCommunicationCallback(new Error('Incorrect JSON'));
                    return;
                }
                this.debugIncorrectMessageReceivedSignal.dispatch("Incorrect JSON", event.data);

                return false;
            }

            this.debugMessageReceivedSignal.dispatch(data);

            if (this._currentCommunicationCallback) {
                this._currentCommunicationCallback(data);
            } else {
                this.messageFromOfscSignal.dispatch(data);
            }
        }

        static generateCallId() {
            return btoa(String.fromCharCode.apply(null, window.crypto.getRandomValues(new Uint8Array(16))));
        }

        static _getOrigin(url) {
            if (typeof url === 'string' && url !== '') {
                if (url.indexOf("://") > -1) {
                    return (window.location.protocol || 'https:') + url.split('/')[2];
                } else {
                    return (window.location.protocol || 'https:') + url.split('/')[0];
                }
            }

            return '';
        }
    }

    return OfscConnector;
});