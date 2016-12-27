module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean', 'jshint', 'copy:app', 'copy:splash', 'babel', 'copy:app-configwizard', 'copy:repository']);
    grunt.registerTask('build-dev', ['build', 'watch']);
    //grunt.registerTask('build-electron', ['clean:binaryDist', 'electron']);



    var options = {
        port: 8081,
        app: "src",
        build: ".build-app",
        tmp: ".tmp",
        repoVersion: "0.1.0"
    };

    grunt.initConfig({
        options: options,
        pkg: grunt.file.readJSON('package.json'),



        babel: {
            "options": {
                "sourceMap": true,
                "plugins": ["transform-es2015-modules-commonjs"] //This is the line to be added.
            },
            dist: {
                files: [{
                    "expand": true,
                    "cwd": "src/apps/splash",
                    "src": ["*.js"],
                    "dest": ".build-app/apps/splash",
                    "ext": ".js"
                }]
            }
        },

        watch: {
            src: {
                files: '<%= options.app %>/**',
                tasks: ['build'],
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
                        '.tmp'
                    ]
                }]
            },
            buildApp: {
                files: [{
                    dot: true,
                    src: [
                        '.build-app'
                    ]
                }]
            },
            binaryDist: {
                files: [{
                    dot: true,
                    src: [
                        '.binary-dist'
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
                    dest: '<%= options.build %>',
                    src: [
                        '*.js',
                        '**/*.json',
                        '*.{html,ico,png,txt}',
                        '**/*.css',
                        '**/*.ttf',
                        'assets/**/*',
                        '.htaccess'
                    ]
                }]
            },
            splash: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= options.app %>/apps',
                    dest: '<%= options.build %>/apps',
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
                        dest: './<%= options.build %>/apps/config',
                        expand: true
                    }
                ]
            },
            'repository': {
                files:[{
                    src: '../client-repository/target/FamilyDAM-<%= options.repoVersion %>.jar',
                    dest: './<%= options.build %>/resources/',
                    expand: true,
                    flatten:true,
                    verbose:true
                }]
            },
            'binary-dist': {
                files: [
                    {
                        cwd: './<%= options.build %>/',
                        src: '**',
                        dest: './.binary-dist/FamilyDAM-darwin-x64/FamilyDAM.app/Contents/Resources/app/',
                        expand: true
                    }
                ]
            }
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

    });

};
