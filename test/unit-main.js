require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/web/js',

  // dynamically load all test files
  deps: ['/base/test/unit-index.js'],

  paths: {
    "knockout":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/knockout/knockout-3.5.1.debug",
    "jquery":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/jquery/jquery-3.6.0",
    "jqueryui-amd":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/jquery/jqueryui-amd-1.12.1",
    "promise":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/es6-promise/es6-promise",
    "hammerjs":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/hammer/hammer-2.0.8",
    "ojdnd":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/dnd-polyfill/dnd-polyfill-1.0.2",
    "ojs":"https://static.oracle.com/cdn/jet/11.0.0/default/js/debug",
    "ojL10n":"https://static.oracle.com/cdn/jet/11.0.0/default/js/ojL10n",
    "ojtranslations":"https://static.oracle.com/cdn/jet/11.0.0/default/js/resources",
    "text":"libs/require/text",
    "signals":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/js-signals/signals",
    "customElements":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/webcomponents/custom-elements.min",
    "css":"https://static.oracle.com/cdn/jet/11.0.0/3rdparty/css",
    'preact': 'libs/preact/dist/preact.umd',
    'preact/hooks': 'libs/preact/hooks/dist/hooks.umd',
    'preact/compat': 'libs/preact/compat/dist/compat.umd',
    'preact/devtools':  'libs/preact/devtools/dist/devtools.umd.js'
  },

  // we have to kickoff jasmine, as it is asynchronous
  //callback: window.__karma__.start
})
