/*
 * boilerplate
 * https://github.com/assemble/boilerplate
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    if (!grunt.file.exists('vendor/bootstrap')) {
        grunt.fail.fatal('>> Please run "bower install" before continuing.');
    }

    // Project configuration.
    grunt.initConfig({

        // Project metadata
        pkg: grunt.file.readJSON('package.json'),
        vendor: grunt.file.readJSON('.bowerrc').directory,
        site: grunt.file.readYAML('_config.yml'),

        // Aliases
        bootstrap: '<%= vendor %>/bootstrap',

        // Build HTML from templates and data
        assemble: {
            options: {
                flatten: true,
                production: false,
                assets: '<%= site.assets %>',
                postprocess: require('pretty'),

                // Metadata
                pkg: '<%= pkg %>',
                site: '<%= site %>',
                data: ['<%= site.data %>'],

                // Templates
                partials: '<%= site.includes %>',
                layoutdir: '<%= site.layouts %>',
                layout: '<%= site.layout %>',

                // Extensions
                helpers: '<%= site.helpers %>',
                plugins: '<%= site.plugins %>'
            },
            example: {
                files: {
                    '<%= site.dest %>/': ['<%= site.templates %>/*.hbs']
                }
            },
            admin: {
                files: [{
                    cwd: '<%= site.templates %>/admin',
                    dest: '<%= site.dest %>/admin',
                    expand: true,
                    src: ['*.hbs', '**/*.md']
                }],
                options: {
                    layout: 'admin.hbs',
                },
            },
        },


        // Compile LESS to CSS
        less: {
            options: {
                paths: [
                    '<%= site.theme %>',
                    '<%= site.theme %>/bootstrap',
                    '<%= site.theme %>/components',
                    '<%= site.theme %>/utils'
                ],
            },
            site: {
                src: ['<%= site.theme %>/site.less'],
                dest: '<%= site.assets %>/css/site.css'
            }
        },


        // Copy Bootstrap's assets to site assets
        copy: {
            once: {
                files: [{
                        expand: true,
                        cwd: '<%= bootstrap %>/less',
                        src: ['*', '!{var*,mix*,util*}'],
                        dest: '<%= site.theme %>/bootstrap/'
                    },
                    {
                        expand: true,
                        cwd: '<%= bootstrap %>/less',
                        src: ['{var*,mix*}.less'],
                        dest: '<%= site.theme %>/utils'
                    },
                    {
                        expand: true,
                        cwd: '<%= bootstrap %>/less',
                        src: ['variables.less'],
                        dest: '<%= site.theme %>/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/showup',
                        src: ['showup.js'],
                        dest: '<%= site.assets %>/js/'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/showup',
                        src: ['showup.css'],
                        dest: '<%= site.theme %>/components/',
                        ext: '.less'
                    },
                ]
            },
            assets: {
                files: [{
                        expand: true,
                        cwd: '<%= bootstrap %>/dist/fonts',
                        src: ['*.*'],
                        dest: '<%= site.assets %>/fonts/'
                    },
                    {
                        expand: true,
                        cwd: '<%= bootstrap %>/dist/js',
                        src: ['*.*'],
                        dest: '<%= site.assets %>/js/'
                    },
                ]
            }
        },


        // Lint JavaScript
        jshint: {
            all: ['Gruntfile.js', 'templates/helpers/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },


        // Before generating any new files,
        // remove any previously-created files.
        clean: {
            html: ['<%= site.dest %>/*.html'],
            once: ['<%= site.theme %>/bootstrap/{var*,mix*,util*}.less']
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: 'localhost',
                    open: true,
                    base: 'dist',
                    livereload: 35729,
                }
            }
        },


        watch: {
            all: {
                files: ['<%= jshint.all %>'],
                tasks: ['jshint', 'nodeunit']
            },
            site: {
                files: ['Gruntfile.js', 'theme/**/*.less', 'templates/**/*.hbs', 'content/**/*.*'],
                tasks: 'build',
                options: {
                    livereload: true,
                }
            },
        }
    });

    // Load npm plugins to provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-verb');
    grunt.loadNpmTasks('grunt-sync-pkg');
    grunt.loadNpmTasks('assemble-less');
    grunt.loadNpmTasks('assemble');

    // Run this task once before running other tasks.
    grunt.registerTask('setup', ['copy:once', 'clean:once']);

    grunt.registerTask('localhost', function() {
        grunt.log.writeln('View on http://localhost:8000');
    });

    // Build HTML, compile LESS and watch for changes. You must first run "bower install" and "grunt setup"
    // to install Bootstrap to the "vendor" directory before running this command.
    grunt.registerTask('build', ['clean:html', 'assemble', 'less:site']);

    grunt.registerTask('serve', ['build', 'connect', 'localhost', 'watch']);

    // Default tasks to be run.
    grunt.registerTask('default', ['clean:html', 'jshint', 'copy:assets', 'assemble', 'less']);
};
