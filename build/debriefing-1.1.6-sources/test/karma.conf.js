// Karma configuration
// Generated on Wed Nov 09 2022 22:22:57 GMT+0200 (GMT+02:00)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: [ 'requirejs', 'mocha', 'chai', 'sinon', 'chai-sinon' ],

    client: {
      mocha: {
        ui: 'tdd'
      }
    },

    // list of files / patterns to load in the browser
    files: [
      'test/unit-main.js',
      'test/unit-index.js',
      { pattern: 'web/**/*.js', included: false },
      { pattern: 'web/**/*.html', included: false },
      { pattern: 'web/**/*.json', included: false },
      { pattern: 'test/unit/**/*.js', included: false },
    ],

    // optionally, configure the reporter
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
      subdir : './'
    },

    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'web/js/*.js': ['coverage'],
      'web/js/!(vendor|libs)/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/searerch?q=keywords:karma-report
    reporters: ['spec', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    customLaunchers: {
      FirefoxSnap: {
        base: 'FirefoxHeadless',
        profile: '.tmp-firefox-profile'
      }
    },

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['FirefoxSnap'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity
  })
}
