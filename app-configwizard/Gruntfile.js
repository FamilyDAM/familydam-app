module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['build-dev', 'watch']);//, 'connect'
    grunt.registerTask('default-prod', ['build-prod', 'watch']);//, 'connect'


    grunt.registerTask('build-css', ['compass']);
    grunt.registerTask('build-babel-js-dashboard', ['jshint', 'babel', 'browserify2:dashboard']);


    grunt.registerTask('build-dev', [
        'clean:dist', 'build-css', 'copy:locales', 'babel', 'copy:dashboard', 'jshint', 'browserify2:dashboard'
    ]);
    /*, 'build-atom-shell-app'*/
    grunt.registerTask('build-prod', [
        'clean:dist', 'build-css', 'babel', 'copy', 'jshint', 'browserify2:dashboard', 'uglify'
    ]);
    /*, 'build-atom-shell-app'*/


    var options = {
        port: 8081,
        app: "src",
        dist: "dist",
        binarydist: "../client-desktop/.build-binary/0.1.0/mac/FamilyDAM.app/Contents/Resources/app",
        tmp: ".tmp"
    };

    grunt.initConfig({
        options: options,
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: options.port,
                    livereload: 35729,
                    base: '.'
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:<%= options.port %>/index.html'
            }
        },

        watch: {

            styles: {
                files: ['<%= options.app %/**/*.scss'],
                tasks: ['compass', 'newer:copy:dashboard'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['<%= options.app %>/**/*.css'],
                tasks: ['copy:dashboard'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['<%= options.app %>/**/*.js'],
                tasks: ['build-babel-js-dashboard'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['<%= options.app %>/*.html'],
                tasks: ['copy:dashboard'],
                options: {
                    livereload: true
                }
            },
            react: {
                files: '<%= options.app %>/**/*.jsx',
                tasks: ['build-babel-js-dashboard'],
                options: {
                    livereload: true
                }
            },
            dist: {
                files: '<%= options.dist %>/**/*',
                tasks: ['copy:binaryDist']
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= options.dist %>/*',
                        '!<%= options.dist %>/.git*'
                    ]
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= options.app %>/{,*/}*.js',
                '!<%= options.app %>/bower_components/*',
                '!<%= options.app %>**/*.js'
            ]
        },



        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dashboard: {
                options:{
                    beautify: false,
                    screwIE8:true,
                    sourceMap: true,
                    sourceMapIncludeSources:true,
                    compress: {
                        'drop_debugger':true,
                        'drop_console':true,
                        dead_code: true
                    }
                },
                files: {
                    '<%= options.dist %>/app.min.js': [  '<%= options.dist %>/app.js']
                }
            }
        },


        // ========================================
        // COMPASS
        // ========================================

        compass: {
            dashboard: {
                options: {
                    sassDir: '<%= options.app %>',
                    cssDir: '<%= options.dist %>',
                    debugInfo: true,
                    fontsDir: '<%= options.app %>/assets/fonts',
                    httpFontsPath: '<%= options.app %>/assets/fonts',
                    relativeAssets: false,
                    assetCacheBuster: false,
                    specify: [
                        '<%= options.app %>/*.scss',
                        '<%= options.app %>/components/**/*.scss',
                        '<%= options.app %>/modules/**/*.scss'
                    ]
                }
            }
        },

        copy: {
            locales: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>',
                    dest: '<%= options.tmp %>',
                    src: [
                        'locales/**/*.json',
                    ]
                }]
            },
            dashboard: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>',
                    dest: '<%= options.dist %>',
                    src: [
                        '*.js',
                        '**/*.json',
                        'apps/splash/**',
                        'apps/setup/**',
                        '*.{html,ico,png,txt}',
                        '**/*.css',
                        'assets/**/*',
                        'bower_components/**/*',
                        '.htaccess'
                    ]
                }]
            },
            binaryDist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.dist %>',
                    dest: '<%= options.binaryDist %>',
                    src: [
                        '**/*'
                    ]
                }]
            }
        },

        react: {
            options: {
                'options.harmony': true
            },
            dashboard: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= options.app %>',
                        src: ['**/*.jsx', 'assets/js/*.js', 'stores/*.js', 'actions/**/*.js', 'services/**/*.js'],
                        dest: '<%= options.tmp %>',
                        ext: '.js'
                    }
                ]
            }
        },


        "6to5": {
            options: {
                sourceMap: true
            }
        },


        browserify2: {
            'dashboard': {
                entry: './<%= options.tmp %>/app.js',
                compile: './<%= options.dist %>/app.js',
                debug: true
            },
            'shared-lib': {
                entry: './<%= options.app %>/shared-lib.js',
                compile: './<%= options.dist %>/shared-lib.js',
                debug: false
            }
        },

        "babel": {
            options: {
                sourceMap: true,
                code: {optional: ["utility.inlineEnvironmentVariables"]}
            },
            dist: {
                files: [{
                    "expand": true,
                    "cwd": "src",
                    "src": ["**/*.jsx", 'locales/*.js', 'assets/js/*.js', 'stores/*.js', 'actions/**/*.js', 'services/**/*.js'],
                    "dest": ".tmp",
                    "ext": ".js"
                }]
            }
        }

    });

};
