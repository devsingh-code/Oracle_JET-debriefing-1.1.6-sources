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
'use strict';

requirejs.config(
    {
      baseUrl: 'js',

      // Path mappings for the logical module names
      // Update the main-release-paths.json for release mode when updating the mappings
      paths:
      //injector:mainReleasePaths
          {
            'knockout': 'libs/knockout/knockout-3.5.1.debug',
            'jquery': 'libs/jquery/jquery-3.6.0',
            'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
            'promise': 'libs/es6-promise/es6-promise',
            'hammerjs': 'libs/hammer/hammer-2.0.8',
            'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.2',
            'ojs': 'libs/oj/11.0.0/debug',
            'ojL10n': 'libs/oj/11.0.0/ojL10n',
            'ojtranslations': 'libs/oj/11.0.0/resources',
            'text': 'libs/require/text',
            'signals': 'libs/js-signals/signals',
            'customElements': 'libs/webcomponents/custom-elements.min',
            'proj4': 'libs/proj4js/dist/proj4-src',
            'css': 'libs/require-css/css',
            'preact': 'libs/preact/dist/preact.umd',
            'preact/hooks': 'libs/preact/hooks/dist/hooks.umd',
            'preact/compat': 'libs/preact/compat/dist/compat.umd',
            'preact/devtools':  'libs/preact/devtools/dist/devtools.umd.js'
          }
      //endinjector
      ,
      // Shim configurations for modules that do not expose AMD
      shim:
          {
            'jquery':
                {
                  exports: ['jQuery', '$']
                }
          }
    }
);

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
require(['ojs/ojcore', 'knockout', 'appController', './errors/application-critical-error', 'ojs/ojcontext', 'ojs/ojknockout',
  'ojs/ojmodule', 'ojs/ojrouter', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar'],
  function (oj, ko, ControllerViewModel, ApplicationCriticalError, Context) { // this callback gets executed when all required modules are loaded

      $(function() {

      function init() {
        var app = new ControllerViewModel();

        oj.Router.sync().then(function () {
          app.load().then(() => {
            // normal start:
            ko.applyBindings(app, document.getElementById('globalBody'));
          }, error => {
            if (error instanceof ApplicationCriticalError) {
              var node = document.getElementById('alertDialog');
              var busyContext = oj.Context.getContext(node).getBusyContext();
              busyContext.whenReady().then(function () {
                app.errorAlertPopup(error.heading, error.message).then(() => {
                  app.terminatePlugin();
              });
              });
              ko.applyBindings(app, document.getElementById('globalBody'));
            }
            console.error(error);
          });
        }, function (error) {
          oj.Logger.error('Error in root start: ' + error.message);
        });
      }
           
      

        // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
        // event before executing any code that might interact with Cordova APIs or plugins.
        if ($(document.body).hasClass('oj-hybrid')) {
          document.addEventListener("deviceready", init);
        } else {
          init();
        }

      });

    }
);