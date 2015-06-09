module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['build-babel-dev', 'watch']);//, 'connect'
    grunt.registerTask('default-prod', ['build-babel-prod', 'watch']);//, 'connect'


    grunt.registerTask('build-css', ['compass']);
    grunt.registerTask('build-babel-js-dashboard', ['jshint', 'babel', 'browserify2:dashboard']);


    grunt.registerTask('build-babel-dev', [
        'clean:dist',  'build-css', 'babel', 'copy', 'jshint', 'browserify2:dashboard', 'copy:binary-dist'
    ]); /*, 'build-atom-shell-app'*/
    grunt.registerTask('build-babel-prod', [
        'clean:dist',  'build-css', 'babel', 'copy', 'jshint', 'browserify2:dashboard','uglify', 'copy:binary-dist'
    ]); /*, 'build-atom-shell-app'*/


    grunt.registerTask('build-electron', ['clean:binaryDist', 'electron', 'clean:binaryDashboard', 'copy:embeddedServer']);


    //deprecated
    grunt.registerTask('build-dev', [
        'clean:dist',  'build-css', 'browserify2:shared-lib', 'copy', 'build-js-dashboard'
    ]); /*, 'build-atom-shell-app'*/
    //deprecated
    grunt.registerTask('build-prod', [
        'clean:dist',  'build-css', 'browserify2:shared-lib', 'copy', 'build-js-dashboard','uglify'
    ]); /*, 'build-atom-shell-app'*/
    //deprecated
    grunt.registerTask('build-js-dashboard', ['jshint', 'react:dashboard', 'browserify2:dashboard']);




    var options = {
        port: 8081,
        app: "src",
        dist: "dist",
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
                files: ['<%= options.app %>/apps/dashboard/**/*.scss'],
                tasks: ['compass:dashboard', 'newer:copy:dashboard' ],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['<%= options.app %>/apps/dashboard/**/*.css'],
                tasks: ['copy:dashboard'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['<%= options.app %>/apps/dashboard/**/*.js'],
                tasks: ['build-babel-js-dashboard'],
                options: {
                    livereload: true
                }
            },
            'electron-js': {
                files: ['<%= options.app %>/*.js'],
                tasks: ['copy:app','build-electron'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['<%= options.app %>/apps/dashboard/*.html'],
                tasks: ['newer:copy:dashboard'],
                options: {
                    livereload: true
                }
            },
            react: {
                files: '<%= options.app %>/apps/dashboard/**/*.jsx',
                tasks: ['build-babel-js-dashboard'],
                options: {
                    livereload: true
                }
            }
,
            dist: {
                files: '<%= options.dist %>/**',
                tasks: ['copy:binary-dist'],
                options: {
                    livereload: true
                }
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
            },
            binaryDist: {
                files: [{
                    dot: true,
                    src: [
                        'binary-dist'
                    ]
                }]
            },
            binaryDashboard: {
                files: [{
                    dot: true,
                    src: [
                        'binary-dist/FamilyDAM.app/Contents/Resources/app/apps/dashboard'
                    ]
                }]
            },
            server: '.tmp'
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= options.app %>/apps/dashboard/{,*/}*.js',
                '!<%= options.app %>/apps/dashboard/bower_components/*',
                '!<%= options.app %>/apps/dashboard/stores/*.js',
                '!<%= options.app %>/apps/dashboard/actions/*.js',
                '!<%= options.app %>/apps/dashboard/shared-lib.js'
            ]
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
                    fontsDir: '<%= options.app %>/apps/dashboard/assets/fonts',
                    httpFontsPath: '<%= options.app %>/apps/dashboard/assets/fonts',
                    relativeAssets: false,
                    assetCacheBuster: false,
                    specify: [
                        '<%= options.app %>/apps/dashboard/*.scss',
                        '<%= options.app %>/apps/dashboard/modules/**/*.scss'
                    ]
                }
            }
        },

        copy: {
            app: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>',
                    dest: '<%= options.dist %>',
                    src: [
                        '*.js',
                        '**/*.json',
                        'apps/splash/**',
                        'apps/setup/**'
                    ]
                }]
            },
            dashboard: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>/apps/dashboard',
                    dest: '<%= options.dist %>/apps/dashboard',
                    src: [
                        '*.{html,ico,png,txt}',
                        '**/*.css',
                        'assets/**/*',
                        'bower_components/**/*',
                        '.htaccess'
                    ]
                }]
            },
            'binary-dist': {
                files: [
                    {
                        cwd: './dist/',
                        src: '**',
                        dest: './binary-dist/FamilyDAM.app/Contents/Resources/app/',
                        expand: true
                    }
                ]
            },
            'embeddedServer': {
                files:[{
                    src: './../server-embedded/target/FamilyDAM.jar',
                    dest: './binary-dist/FamilyDAM.app/Contents/Resources/app/resources',
                    expand: true,
                    flatten:true,
                    verbose:true
                }]
            }
        },

        react: {
            options:{
                'options.harmony': true
            },
            dashboard: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= options.app %>/apps/dashboard',
                        src: ['**/*.jsx', 'assets/js/*.js', 'stores/*.js', 'actions/**/*.js', 'services/**/*.js'],
                        dest: '<%= options.tmp %>/apps/dashboard',
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
                        dead_code: false
                    }
                },
                files: {
                    '<%= options.dist %>/apps/dashboard/app.js': [  '<%= options.dist %>/apps/dashboard/app.js']
                }
            }
        },


        browserify2: {
            'dashboard': {
                entry: './<%= options.tmp %>/apps/dashboard/app.js',
                compile: './<%= options.dist %>/apps/dashboard/app.js',
                debug: true
            },
            'shared-lib': {
                entry: './<%= options.app %>/apps/dashboard/shared-lib.js',
                compile: './<%= options.dist %>/apps/dashboard/shared-lib.js',
                debug: false,

            }
        },

        "babel": {
            options: {
                sourceMap: true,
                nonStandard: true,
                optional: ["utility.inlineEnvironmentVariables"],
                code:{ optional: ["utility.inlineEnvironmentVariables"] }
            },
            dist: {
                files: [{
                    "expand": true,
                    "cwd": "src/apps/dashboard",
                    "src": ["**/*.jsx", 'locales/*.js', 'assets/js/*.js', 'stores/*.js', 'actions/**/*.js', 'services/**/*.js'],
                    "dest": ".tmp/apps/dashboard",
                    "ext": ".js"
                }]
            }
        },


        electron: {
            osxBuild: {
                options: {
                    name: 'FamilyDAM',
                    dir: 'dist',
                    out: 'binary-dist',
                    version: '0.27.1',
                    platform: 'darwin',
                    arch: 'x64',
                    'app-bundle-id': 'com.familydam',
                    'app-version': '0.0.1'
                }
            },
            winBuild: {
                options: {
                    name: 'FamilyDAM',
                    dir: 'dist',
                    out: 'binary-dist',
                    version: '0.27.1',
                    platform: 'win32',
                    arch: 'x64'
                }
            }
        },


        'download-atom-shell': {
            version: '0.22.2',
            outputDir: '.tmp/binaries'
        },

        /** platforms: ["darwin", "win32", "linux"], **/
        'build-atom-shell-app': {
            options: {
                platforms: ["darwin"],
                app_dir:"dist",
                cache_dir:".tmp/binaries",
                build_dir:"binary-dist",
                atom_shell_version: 'v0.22.2'
            }
        }

    });

};
