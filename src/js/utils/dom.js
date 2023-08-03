/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

define([], () => {

    const dom = {};

    /**
     * Outer height with margin
     * @param {HTMLElement} el
     * @returns {Number}
     */
    dom.offsetHeightWithMargin = (el) =>  {
        const offsetHeight = el.offsetHeight;
        const style = getComputedStyle(el);
        const margin = parseInt(style.marginTop) + parseInt(style.marginBottom);

        return offsetHeight + margin;
    };

    /**
     * @param {String} html to insert
     * @param {HTMLElement} el
     */
    dom.insertHTMLBeforeElement = (html, el) => el.insertAdjacentHTML('beforebegin', html);

    dom.resetScrolling = () => {
        // Workaround for iOS 13
        // to avoid shifting of a clickable area of the element after iframe body is scrolled
        window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
    };

    return dom;
});
