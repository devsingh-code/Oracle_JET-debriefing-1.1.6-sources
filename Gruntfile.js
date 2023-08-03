/*
** Oracle Field Service Debriefing plugin
**
** Copyright (c) 2023, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

'use strict';

const cssmin = require('cssmin');
const child_process = require('child_process');
const crypto = require('crypto');

module.exports = function (grunt) {
    const outputDir = 'build';

    /**
     * If this file exists then "distributeSources" task skips bump of the package version.
     * @type {string}
     */
    const BUMP_IGNORE_FILE_NAME = '.bumpignore';

    const SOURCES_FOLDER_NAME_TEMPLATE = '<%= pkg.name %>-<%= pkg.version %>-sources';
    const SOURCES_FILE_NAME_TEMPLATE = '<%= pkg.name %>-<%= pkg.version %>-sources.zip';

    const ARCHIVE_FOLDER = 'hosted'; // do not use version in directory name in order to integrate with docker build and jenkins job
    const ARCHIVE_FILE_NAME_TEMPLATE = '<%= pkg.name %>-<%= pkg.version %>-hosted.zip';

    const PACKAGE_FILE_NAME_TEMPLATE = '<%= pkg.name %>-<%= pkg.version %>-package.zip';

    const CSS_IMAGES_FILES_REGEXP = /images\/([a-z_]+\.svg)/g;

    const ORIGINAL_COMMIT_HASH_REPLACE_REGEXP = /("originalCommitHash": ")(")/g;
    const ORIGINAL_FILES_CHECKSUM_REPLACE_REGEXP = /("originalFilesChecksum": ")(")/g;

    const SRC_FILES_PATTERNS = [
        './src/**',
        './grunt-tasks/**',
        './scripts/**',
        './test/**',
        './Gruntfile.js',
        './README.md',
        './*LICENSE*.txt',
        './oraclejetconfig.json',
        '!./test/reporter-config.json',
        '!./test/run-unit-tests.sh',
        '!./test/run-tests.sh',
    ];

    const gitCommitHash = getGitCommitHash();
    const isGitTreeDirty = getIsGitTreeDirty();
    const filesChecksum = getFilesChecksum();

    grunt.registerTask('autoIncrementVersion', 'Auto increment package version (patch) on every build', () => {
        grunt.task.run('bumpup:patch');
    });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        addCopyright: {
            main: {
                files: [{
                    src: outputDir + '/' + ARCHIVE_FOLDER + '/main.js',
                    dest: outputDir + '/' + ARCHIVE_FOLDER + '/main.js'
                },{
                    src: outputDir + '/' + ARCHIVE_FOLDER + '/app.css',
                    dest: outputDir + '/' + ARCHIVE_FOLDER + '/app.css'
                }]
            }
        },

        bumpup: {
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            },
            files: ['package.json']
        },

        clean: [outputDir],

        // change variables in HTML by pattern <%= variableName %>
        processhtml: {
            dist: {
                options: {
                    data: {
                        // function is used to get version updated by bumpup task
                        getVersion: () => grunt.config.get('pkg.version'),
                        commitHash: gitCommitHash + (isGitTreeDirty ? '.DIRTY' : ''),
                        filesChecksum: filesChecksum,
                        originalCommitHash: grunt.config.get('pkg.ofscMetadata.originalCommitHash'),
                        originalFilesChecksum: grunt.config.get('pkg.ofscMetadata.originalFilesChecksum')
                    }
                },
                files: [{
                    src: [outputDir + '/' + ARCHIVE_FOLDER + '/index.html'],
                    dest: outputDir + '/' + ARCHIVE_FOLDER + '/index.html'
                }],
            }
        },

        copy: {
            html: {
                src: 'web/index.html',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/index.html'
            },
            js: {
                src: 'web/js/main.js',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/main.js'
            },
            html2pdf: {
                src: 'web/js/vendor/html2pdf/html2pdf.bundle.js',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/html2pdf.bundle.js'
            },
            manifest: {
                src: "web/manifest.appcache",
                dest: outputDir + '/' + ARCHIVE_FOLDER + "/manifest.appcache"
            },
            pluginManifest : {
                src: ['./manifest.json'],
                dest: outputDir + '/'
            },
            css_app: {
                src: 'web/css/app.css',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/app.css',
                options: {
                    process: function (content) {
                        return cssmin(content.replace(CSS_IMAGES_FILES_REGEXP, '$1'));
                    }
                }
            },
            sprite_app: {
                src: 'web/css/images/app_sprite.svg',
                dest: outputDir + '/' + ARCHIVE_FOLDER + '/app_sprite.svg'
            },
            logo: {
              src: 'web/css/images/logo.svg',
              dest: outputDir + '/' + ARCHIVE_FOLDER + '/logo.svg'
            },
            licenses : {
                src: ['./*LICENSE*.txt'],
                dest: outputDir + '/'
            },
            sources: {
                src: SRC_FILES_PATTERNS,
                dest: `${outputDir}/${SOURCES_FOLDER_NAME_TEMPLATE}/`
            },
            sources_package_json: {
                src: [
                    './package.json',
                ],
                dest: `${outputDir}/${SOURCES_FOLDER_NAME_TEMPLATE}/`,
                options: {
                    process: function (content) {
                        return content
                            .replace(ORIGINAL_COMMIT_HASH_REPLACE_REGEXP, '$1' + gitCommitHash + (isGitTreeDirty ? '.DIRTY' : '') + '$2')
                            .replace(ORIGINAL_FILES_CHECKSUM_REPLACE_REGEXP, '$1' + filesChecksum + '$2');
                    }
                }
            }
        },

        compress: {
            main: {
                options: {
                    archive: outputDir + '/' + ARCHIVE_FILE_NAME_TEMPLATE
                },
                files: [
                    {
                        expand: true,
                        cwd: outputDir + '/' + ARCHIVE_FOLDER + '/',
                        src: [ '*.*' ],
                        dest: '/'
                    }
                ]
            },
            sources: {
                options: {
                    archive: outputDir + '/' + SOURCES_FILE_NAME_TEMPLATE
                },
                files: [
                    {
                        expand: true,
                        cwd: outputDir + '/',
                        dot: true,
                        src: [
                            SOURCES_FOLDER_NAME_TEMPLATE + '/**', // put files into aggregation folder inside zip file in order to unzip be more comfortable
                        ],
                        dest: '/'
                    }
                ]
            },
            package: {
                options: {
                    archive: outputDir + '/package/' + PACKAGE_FILE_NAME_TEMPLATE
                },
                files: [
                    {
                        expand: true,
                        cwd: outputDir + '/',
                        src: [
                            ARCHIVE_FILE_NAME_TEMPLATE,
                            SOURCES_FILE_NAME_TEMPLATE,
                            'manifest.json',
                            'LICENSE.txt',
                            'THIRD_PARTY_LICENSES.txt',
                        ],
                        dest: `/`
                    }
                ]
            },
        },

        generatePluginXml: {
            options: {
                outputDir: outputDir,
                archiveFile: `${outputDir}/${ARCHIVE_FILE_NAME_TEMPLATE}`
            }
        },

        generatePropertiesXml: {
            options: {
                outputDir: outputDir
            }
        }
    });

    grunt.option('platform', 'web');

    grunt.loadNpmTasks('@oracle/grunt-oraclejet');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.loadTasks('grunt-tasks/generate-xml');
    grunt.loadTasks('grunt-tasks/add-copyright');

    grunt.registerTask('build', 'Public task. Calls oraclejet-build to build the oraclejet application. Can be customized with additional build tasks.', function () {
        grunt.registerTask('distribute', ['distributePlugin']);
        grunt.task.run([`oraclejet-build:release`]);
        // run 'distribute' task described in scripts/hooks/after_build.js
    });

    grunt.registerTask('package', function () {
        grunt.registerTask('distribute', ['distributeStandardPluginPackage']);
        grunt.task.run([`oraclejet-build:release`]);
        // run 'distribute' task described in scripts/hooks/after_build.js
    });

    grunt.registerTask('devBuild', 'Public task. Calls oraclejet-build to build the oraclejet application. Can be customized with additional build tasks.', function () {
        grunt.task.run([`oraclejet-build:dev`]);
    });

    grunt.registerTask('serve', 'Public task. Calls oraclejet-serve to serve the oraclejet application. Can be customized with additional serve tasks.', function (buildType) {
        grunt.task.run([`oraclejet-serve:${buildType}`]);
    });

    //------------------------------------------

    grunt.registerTask('distributeHosted', () => {

        // clean build directory
        grunt.task.run('clean');

        // copy files listed below into /build/hosted/ directory
        // web/js/main.js
        // web/js/vendor/html2pdf/html2pdf.bundle.js
        // web/manifest.appcache
        // web/css/app.css (+ minify css)
        // web/css/images/app_sprite.svg
        // web/css/images/logo.svg
        grunt.task.run('copyBuiltResources');

        // put some artifacts like git commit hash in metadata tags inside HTML
        grunt.task.run('processhtml');

        // add copyright to js and css
        grunt.task.run('addCopyright:main');

        // update cache manifest with some metadata
        grunt.task.run('updateManifest');

        //make hosted plugin archive
        grunt.task.run('compress:main');

        //generate properties.xml and plugins.xml in order to import them in OFS
        grunt.task.run('generateXml');
    });

    const distributeSourcesDescription = 'Copy source files and pack them into archive. ' +
        'It creates ".bumpignore" file in a copied folder and an archive';
    grunt.registerTask('distributeSources', distributeSourcesDescription, () => {
        grunt.task.run('copy:sources');
        grunt.task.run('copy:sources_package_json');

        addBumpVersionIgnore(outputDir + '/' + grunt.template.process(SOURCES_FOLDER_NAME_TEMPLATE));

        grunt.task.run('compress:sources');
    });

    grunt.registerTask('distributePackage', [
        'copy:pluginManifest',
        'copy:licenses',
        'compress:package'
    ]);

    //------------------------------------------

    grunt.registerTask('copyBuiltResources', [
        'copy:html',
        'copy:js',
        'copy:html2pdf',
        'copy:manifest',
        'copy:css_app',
        'copy:sprite_app',
        'copy:logo'
    ]);

    grunt.registerTask('updateManifest', 'Add to manifest service information', function() {
        const srcContent = grunt.file.read(outputDir + '/' + ARCHIVE_FOLDER + '/manifest.appcache');
        console.log('Running register task');
        grunt.file.write(outputDir + '/' + ARCHIVE_FOLDER + '/manifest.appcache',
            srcContent + '\n' +
            '# version ' + grunt.config.get('pkg.version') + '\n' +
            '# repo-files-checksum ' + getFilesChecksum()
        );
    });

    //------------------------------------------

    // Is run by 'oraclejet-build:release' task as defined in scripts/hooks/after_build.js
    const distributeDescription = 'Build resources, make an archive and bump package version. \n' +
        'If ".bumpignore" file exists in the current folder then "autoIncrementVersion" would be skipped. \n' +
        'The task deletes ".bumpignore" in the current folder before finished if it exists.';
    grunt.registerTask('distributePlugin', distributeDescription, () => {
        // increase version in package.json
        const ignoreBump = isBumpVersionIgnored();

        if (!ignoreBump) {
            grunt.task.run('autoIncrementVersion');
        }

        grunt.task.run('distributeHosted');
        grunt.task.run('distributeSources');
    });

    grunt.registerTask('distributeStandardPluginPackage', () => {
        grunt.task.run('distributeHosted');
        grunt.task.run('distributeSources');
        grunt.task.run('distributePackage');
    });

    /**
     * @param {String} [targetDir]
     */
    function addBumpVersionIgnore(targetDir) {
        if (targetDir) {
            grunt.file.write(targetDir + '/' + BUMP_IGNORE_FILE_NAME, null);
        } else {
            grunt.file.write(BUMP_IGNORE_FILE_NAME, null);
        }
    }

    /**
     * @param {String} [targetDir]
     */
    function deleteBumpVersionIgnore(targetDir) {
        if (targetDir) {
            grunt.file.delete(targetDir + '/' + BUMP_IGNORE_FILE_NAME);
        } else {
            grunt.file.delete(BUMP_IGNORE_FILE_NAME);
        }
    }

    /**
     * @param {String} [targetDir]
     * @returns {Boolean}
     */
    function isBumpVersionIgnored(targetDir) {
        if (targetDir) {
            return grunt.file.exists(targetDir + '/' + BUMP_IGNORE_FILE_NAME);
        } else {
            return grunt.file.exists(BUMP_IGNORE_FILE_NAME);
        }
    }

    function getIsGitTreeDirty() {

        let gitOutput;
        let changedFiles;

        try {
            gitOutput = child_process.execSync('git status --porcelain -uno', { timeout: 10000 }).toString();

            if (!gitOutput.length) {
                return false;
            }

            changedFiles = gitOutput.trim().split('\n').map(str => str.trim());
        } catch (e) {
            return true;
        }

        if (!changedFiles || changedFiles.length < 1 || (1 === changedFiles.length && 'M package.json' === changedFiles[0])) {
            return false;
        }

        return true;
    }

    function getGitCommitHash() {
        try {
            const gitOutput = child_process.execSync('git rev-parse HEAD', { timeout: 10000 }).toString();

            if (!gitOutput.length) {
                return '';
            }

            return gitOutput.trim();
        } catch (e) { }

        return '';
    }

    function getFilesChecksum() {
        const filePaths = grunt.file.expand({ filter: 'isFile' },  SRC_FILES_PATTERNS);

        const fileSums = filePaths.map(path => crypto
            .createHash('sha256')
            .update(grunt.file.read(path, null))
            .digest('hex')
        );

        return crypto
            .createHash('sha256')
            .update(fileSums.join())
            .digest('hex');
    }

    grunt.registerTask('default', ['build']);
};
