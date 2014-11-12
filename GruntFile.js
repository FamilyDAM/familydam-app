/*
 * This file is part of FamilyDAM Project.
 *
 *     The FamilyDAM Project is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     The FamilyDAM Project is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = function (grunt) {

	var os = require("os");

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // some other cool plugins to look at...
	// https://npmjs.org/package/grunt-phonegap-build
	// https://npmjs.org/package/grunt-s3

	/* grunt: build a develop dist
	 * grunt: release: build a release dist
	 * grunt server: start server and build a develop dist any time a file changes
	 */

	// default task
	grunt.registerTask('default', ['clean', 'build']);

	// build tasks
	//grunt.registerTask('build', ['copy']);



	// default task
	grunt.registerTask('default', ['clean','copy','build-shared-libs','build']);
	grunt.registerTask('default-quick', ['copy','build-quick']);

	// build tasks
	grunt.registerTask('build', ['build-css', 'build-js', 'build-atom-shell-app']);
	grunt.registerTask('build-css', ['compass:develop']);
	grunt.registerTask('build-js', ['jshint','html2js','browserify2:dashboard']);
	grunt.registerTask('build-shared-libs', ['browserify2:shared-libs']);
	grunt.registerTask('build-quick', ['build-css', 'build-js']);
	//grunt.registerTask('deploy', ['slingPost']);

	// server task
	grunt.registerTask('server', ['clean','copy','build', 'build-shared-libs', 'server-start', 'open', 'watch']);




	grunt.initConfig({

		// ========================================
		// Common
		// ========================================

		// config
		assetsVersion: 1, // increment each release
		distdir: 'dist',
		tempdir: '.temp',
		pkg: grunt.file.readJSON('package.json'),
        'bower-install': {
            target: {
                html: '<%= src %>/index.html',
                ignorePath: '<%= src %>/'
            }
        },
        banner:
			'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
				' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
		src: {
			js: ['src/**/*.js'],
			html: ['src/**/*.tpl.html']
		},


		// clean
		clean: ['./dist/*', '<%= tempdir %>/*', './binary-dist/*',],

        // copy
        copy: {
            'dashboard-assets': {
                files: [
                    {
                        cwd: './src/apps/dashboard/assets/',
                        src: '**',
                        dest: './dist/apps/dashboard/assets/',
                        expand: true
                    }
                ]
            },
            'configAssets': {
                files: [
                     {
                          cwd: './src/config',
                          src: '*',
                          dest: './dist/config',
                          expand: true
                      },
                      {
                          cwd: './src/config',
                          src: '*',
                          dest: './binary-dist/darwin/atom-shell/Atom.app/Contents/Resources/app/config',
                          expand: true
                      },
                      {
                          cwd: './src/',
                          src: '*.js',
                          dest: './dist/config',
                          expand: true
                      },
                      {
                          cwd: './src/',
                          src: '*.js',
                          dest: './binary-dist/darwin/atom-shell/Atom.app/Contents/Resources/app',
                          expand: true
                      },
                      {
                         cwd: './bower_components/',
                         src: '**',
                         dest: './dist/apps/dashboard/components/',
                         expand: true
                     }
                ]
            },
            html: {
                files: [
                    {
                        cwd: 'src/apps',
                        src: '**/*.html',
                        dest: './dist/apps',
                        expand: true
                    },
                    {
                        cwd: 'src/apps',
                        src: '**/*.html',
                        dest: './binary-dist/darwin/atom-shell/Atom.app/Contents/Resources/app/',
                        expand: true
                    }
                ]
            },
            js: {
                files: [
                    {
                        cwd: 'src/',
                        src: '*.js',
                        dest: './dist/',
                        expand: true
                    },
                    {
                        cwd: 'src/',
                        src: '*.js',
                        dest: './binary-dist/darwin/atom-shell/Atom.app/Contents/Resources/app/',
                        expand: true
                    }
                ]
            },
            json: {
                files: [
                    {
                        cwd: 'src/',
                        src: '*.json',
                        dest: './dist/',
                        expand: true
                    }
                ]
            },
            resources: {
                files: [
                    {
                        cwd: 'src/resources/',
                        src: '*',
                        dest: './dist/resources',
                        expand: true
                    },
                    {
                        cwd: '../familydam-server/target',
                        src: 'familydam-*-standalone.jar',
                        dest: './dist/resources',
                        expand: true
                    }
                ]
            },
            statichtml: {
                files: [
                    {
                        cwd: 'src/apps/dashboard/',
                        src: 'index.html',
                        dest: './dist/apps/dashboard/',
                        expand: true
                    },
                    {
                        cwd: 'src/apps/dashboard/',
                        src: '**/*.html',
                        dest: './binary-dist/darwin/atom-shell/Atom.app/Contents/Resources/app/dashboard/',
                        expand: true
                    }
                ]
            }
        },


		// ========================================
		// JavaScript
		// ========================================

		// js hint
		jshint: {
			files: ['gruntFile.js', '<%= src.js %>', '!node_modules/**/*.js', '!src/components/**/*.js', '!src/apps/dashboard/assets/js/**/*.js', '!src/config/components/**/*.js', '!src/**/*.min.js'],
			options: {
				curly:false,
				eqeqeq:false,
				immed:false,
				latedef:true,
				newcap:true,
				noarg:true,
				sub:true,
				boss:true,
				eqnull:true,
                evil:true,
				globals: {}
			}
		},

		// html2js
		html2js: {
			'dashboard': {
				src: ['src/apps/dashboard/**/*.tpl.html'],
				dest: '.temp/apps/dashboard/app-templates.js',
				module: 'dashboard.templates'
			}
		},

		// browserify
		browserify2: {
			'shared-libs': {
				entry: './src/apps/dashboard/shared-libs.js',
				compile: './dist/apps/dashboard/shared-libs.js',
				debug: true,
				options: {
					expose: {
                        jquery: './bower_components/jquery/dist/jquery.js',
                        angular: './bower_components/angular/angular.js',
                        'angular-ui-router': './bower_components/angular-ui-router/release/angular-ui-router.js',
                        'angular-resource': './bower_components/angular-resource/angular-resource.js',
                        'ui.bootstrap': './bower_components/angular-bootstrap/ui-bootstrap.js',
                        'ui.bootstrap.tpls': './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                        'moment': './bower_components/moment/moment.js',
                        'angular-momentjs': './bower_components/angular-moment/angular-moment.js',
                        'angular-moment': './bower_components/angular-moment/angular-moment.js'
                        }
				}
			},
			'dashboard': {
				entry: './src/apps/dashboard/app.js',
				compile: './dist/apps/dashboard/app.js',
				debug: true,
				options: {
                    expose: {
                        'dashboard-templates': './.temp/apps/dashboard/app-templates.js',
                        'ipc': './binaries/Atom.app/Contents/Resources/atom/renderer/api/lib/ipc.js',
                        'remote': './binaries/Atom.app/Contents/Resources/atom/renderer/api/lib/remote.js',
                        'callbacks-registry': './binaries/Atom.app/Contents/Resources/atom/common/api/lib/callbacks-registry.js',
                        'dialog': './binaries/Atom.app/Contents/Resources/atom/browser/api/lib/dialog.js',
                        'browser-window': './binaries/Atom.app/Contents/Resources/atom/browser/api/lib/browser-window.js',
                        'web-contents': './binaries/Atom.app/Contents/Resources/atom/browser/api/lib/web-contents.js',
                        'app': './binaries/Atom.app/Contents/Resources/atom/browser/api/lib/app.js',
                        'menu': './binaries/Atom.app/Contents/Resources/atom/browser/api/lib/menu.js',
                        'menu-item': './binaries/Atom.app/Contents/Resources/atom/browser/api/lib/menu-item.js',
                        //'web-view': './binaries/Atom.app/Contents/Resources/atom/renderer/api/lib/remote.js',
                        //'clipboard': './binaries/Atom.app/Contents/Resources/atom/common/api/lib/clipboard.js',
                        //'crash-reporter': './binaries/Atom.app/Contents/Resources/atom/common/api/lib/crash-reporter.js',
                        'id-weak-map': './binaries/Atom.app/Contents/Resources/atom/common/api/lib/id-weak-map.js'
                        //'screen': './binaries/Atom.app/Contents/Resources/atom/common/api/lib/screen.js',
                        //'shell': './binaries/Atom.app/Contents/Resources/atom/common/api/lib/shell.js'

                    }
                }
			}
		},



		// ========================================
		// COMPASS
		// ========================================

		compass: {
			develop: {
				options: {
					sassDir: 'src',
					cssDir: 'dist/'
				}
			},
			release: {
				options: {
					sassDir: 'src',
					cssDir: 'dist/',
					environment: 'production'
				}
			}
		},

		// ========================================
		// Server
		// ========================================

        open : {
            chrome : {
                path: 'http://localhost:80/index.html',
                app: 'Google Chrome'
            }
        },

		watch: {
			options: {
				livereload: true
			},
			'dashboardAssets': {
				files: 'src/apps/dashboard/assets/*.*',
				tasks: ['copy:dashboard-assets'] /*, 'deploy'*/
			},
			'configAssets': {
				files: 'src/config/*.*',
				tasks: ['copy:configAssets']
			},
			'configAssets2': {
				files: 'src/*.js',
				tasks: ['copy:configAssets']
			},
			css: {
				files: ['src/**/*.scss'],
				tasks: ['compass:develop'] /*, 'deploy'*/
			},
			js: {
				files: 'src/apps/**/*.js',
				tasks: ['build-js', 'browserify2', 'copy:configAssets'] /*, 'deploy'*/
			},
			html: {
				files: ['src/apps/**/*.tpl.html', 'src/**/*.html'],
				tasks: ['copy:statichtml', 'build-js']  /*, 'deploy'*/
			},
			grunt: {
				files: ['GruntFile.js'],
				tasks: ['default']
			}
		},

		// ========================================
		// Release
		// ========================================

		// uglify
		uglify: {
			dist: {
				options: {
					banner: '<%= banner %>'
				},
				files: {

				}
			}
		},

		// karma (unit tests)
		karma: {
			unit: {
				configFile: 'test/config/unit.js'
			},
			watch: {
				configFile: 'test/config/unit.js',
				autoWatch: true
			}
		},

        slingPost: {
            options: {
                host:"localhost",
                port:80,
                user:"admin",
                pass:"admin",
                exclude: ["*.git"]
            },
            dist: {
                src: "dist",
                dest: "/content/dashboard"
            }
        },

        'download-atom-shell': {
            version: '0.15.6',
            outputDir: 'binaries'
        },

        /** platforms: ["darwin", "win32", "linux"], **/
        'build-atom-shell-app': {
            options: {
                platforms: ["darwin"],
                app_dir:"dist",
                cache_dir:"binaries",
                build_dir:"binary-dist",
                atom_shell_version: 'v0.15.6'
            }
        }

	});

};