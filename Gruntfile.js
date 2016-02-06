module.exports = function(grunt) {

    require('babelify');
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['build-babel-dev', 'watch']);//, 'connect'
    grunt.registerTask('default-prod', ['build-babel-prod', 'watch']);//, 'connect'


    grunt.registerTask('build-css', ['compass']);
    grunt.registerTask('build-babel-js-dashboard', ['jshint', 'babel', 'browserify']);


    grunt.registerTask('build-babel-dev', [
        'clean:dist', 'jshint', 'browserify', 'build-css', 'copy'
    ]); /*, 'build-atom-shell-app'*/
    grunt.registerTask('build-babel-prod', [
        'clean:dist', 'jshint', 'browserify', 'build-css', 'copy','uglify'
    ]); /*, 'build-atom-shell-app'*/




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
                files: ['<%= options.app %/**/*.scss'],
                tasks: ['compass:dashboard', 'newer:copy:dashboard' ],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['<%= options.app %>/**/*.css'],
                tasks: ['compass:dashboard', 'copy:dashboard'],
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
                tasks: ['newer:copy:dashboard'],
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
            tmp: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>',
                    dest: '<%= options.tmp %>',
                    src: [
                        'assets/**'
                    ]
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
                        cwd: '<%= options.app %>',
                        src: ['**/*.jsx', 'assets/js/**/*.js', 'stores/**/*.js', 'actions/**/*.js', 'services/**/*.js'],
                        dest: '<%= options.tmp %>',
                        ext: '.js'
                    }
                ]
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
                        dead_code: true
                    }
                },
                files: {
                    '<%= options.dist %>/app.js': [  '<%= options.dist %>/app.js']
                }
            }
        },


        "browserify": {
            'dist':{
                options: {
                    debug: true,
                    fullPaths:true,
                    transform: [["babelify"]]
                },
                files: {
                    './<%= options.dist %>/app.js' : ['src/*.jsx']
                }
            }
        }


    });

};
