/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

"use strict";
define(['knockout'], (ko) => {
    let entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    let escapeHtml = string => String(string).replace(/[&<>"'`=\/]/g, s => entityMap[s]);

    let searchAndSetText = (element, text, searchString) => {

        let substringPosition = -1;
        let normalizedSearchString;

        if (searchString !== null && searchString !== undefined && text !== null && text !== undefined) {
            normalizedSearchString = typeof searchString === 'string'
                ? searchString.toLowerCase().trim()
                : searchString.toString().toLowerCase().trim();
            let normalizedText = typeof text === 'string'
                ? text.toLowerCase()
                : text.toString().toLowerCase();

            if (normalizedText.length >= normalizedSearchString.length) {
                substringPosition = normalizedText.indexOf(normalizedSearchString);
            }
        }

        if (substringPosition >= 0) {
            let stringText = typeof text === 'string' ? text : text.toString();
            let searchStringLength = normalizedSearchString.length;

            let resultHTML = '';

            resultHTML += escapeHtml(stringText.substr(0, substringPosition));
            resultHTML += '<span class="highlight">';
            resultHTML += escapeHtml(stringText.substr(substringPosition, searchStringLength));
            resultHTML += '</span>';
            resultHTML += escapeHtml(stringText.substring(substringPosition + searchStringLength));

            element.innerHTML = resultHTML;
        } else {
            element.innerText = text;
        }
    };

    ko.bindingHandlers.textHighlighted = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            element.__textHighlitedSubscriptions = [];
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                element.__textHighlitedSubscriptions.forEach(subscription => subscription.dispose());
            });
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            let text = valueAccessor();
            let searchString = allBindings.get('searchString');

            if (ko.isObservable(text)) {
                element.__textHighlitedSubscriptions.push(text.subscribe((newText) => {
                    searchAndSetText(element, newText, ko.unwrap(searchString));
                }));
            }
            if (ko.isObservable(searchString)) {
                element.__textHighlitedSubscriptions.push(searchString.subscribe((newSearchString) => {
                    searchAndSetText(element, ko.unwrap(text), newSearchString);
                }));
            }
            searchAndSetText(element, ko.unwrap(text), ko.unwrap(searchString))
        }
    };
});