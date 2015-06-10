module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['clean:dist', 'build-js', 'copy:app', 'copy:splash', 'copy:app-configwizard', 'copy:embeddedServer', 'watch']);

    grunt.registerTask('build-js', ['jshint']);

    grunt.registerTask('build-electron', ['clean:binaryDist', 'electron']);



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
            'electron-js': {
                files: ['<%= options.app %>/*.js'],
                tasks: ['copy:app','build-electron'],
                options: {
                    livereload: true
                }
            },
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
                        '*.{html,ico,png,txt}',
                        '**/*.css',
                        'resources/**/*',
                        '.htaccess'
                    ]
                }]
            },
            splash: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>/apps',
                    dest: '<%= options.dist %>/apps',
                    src: [
                        'splash/**/*'
                    ]
                }]
            },
            'app-configwizard': {
                files: [
                    {
                        cwd: '../app-configwizard/dist',
                        src: '**',
                        dest: './dist/apps/config',
                        expand: true
                    }
                ]
            },
            'embeddedServer': {
                files:[{
                    src: './../server-embedded/target/FamilyDAM.jar',
                    dest: './dist/resources',
                    expand: true,
                    flatten:true,
                    verbose:true
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
        },


        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= options.app %>*.js'
            ]
        },

        "6to5": {
            options: {
                sourceMap: true
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
                    arch: 'x64',
                    'app-bundle-id': 'com.familydam',
                    'app-version': '0.0.1'
                }
            }
        }

    });

};
