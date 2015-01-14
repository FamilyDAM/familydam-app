module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['build', 'watch']);//, 'connect'

    grunt.registerTask('build', [
        'clean:dist',  'build-css', 'build-js', 'copy:dist'
    ]);
    grunt.registerTask('build-js', ['jshint', 'react', 'browserify2']);
    grunt.registerTask('build-css', ['compass']);


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
            compass: {
                files: ['<%= options.app %>/scss/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer'],
                options: {
                    livereload: true
                }
            },
            styles: {
                files: ['<%= options.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['<%= options.app %>/*.html'],
                tasks: ['newer:copy'],
                options: {
                    livereload: true
                }
            },
            react: {
                files: '<%= options.app %>/**/*.jsx',
                tasks: ['build-js'],
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
            server: '.tmp'
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= options.app %>/scripts/{,*/}*.js',
                '!<%= options.app %>/bower_components/*'
            ]
        },

        compass: {
            options: {
                sassDir: '<%= options.app %>/scss',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= options.app %>/images',
                javascriptsDir: '<%= options.app %>/scripts',
                fontsDir: '<%= options.app %>/styles/fonts',
                importPath: '<%= options.app %>/bower_components/foundation/scss',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= options.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>',
                    dest: '<%= options.dist %>',
                    src: [
                        '*.{html,ico,png,txt}',
                        '**/*.css',
                        'bower_components/**/*.*',
                        '.htaccess'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= options.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },

        modernizr: {
            devFile: '<%= options.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= options.dist %>/bower_components/modernizr/modernizr.js',
            files: [
                '<%= options.dist %>/scripts/{,*/}*.js',
                '<%= options.dist %>/styles/{,*/}*.css',
                '!<%= options.dist %>/scripts/vendor/*'
            ],
            uglify: true
        },

        react: {
            jsx2: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= options.app %>',
                        src: ['**/*.jsx'],
                        dest: '<%= options.tmp %>',
                        ext: '.js'
                    }
                ]
            }
        },


        // browserify
        browserify2: {
            'jsx': {
                entry: './<%= options.tmp %>/app.js',
                compile: './<%= options.dist %>/app.js',
                debug: true
            }
        }
    });

};
