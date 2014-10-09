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

/**
 * Initial definition of the Angular Application. This class imports (requires) all of the modules for the application.
 */
require('dashboard-templates');



// Define the required modules
var App = angular.module('dashboard', [
    'ui.router',
    require('./modules/login/index').name,
    require('./modules/home/index').name,
    require('./modules/files/index').name,
    require('./modules/photos/index').name
])

    .service('appService', require('./services/AppService'))
    .service('fileService', require('./services/FileService'))
    .service('loginService', require('./services/LoginService'))
    .service('photoService', require('./services/PhotoService'))
    .service('metadataService', require('./services/MetadataService'))
    .service('userService', require('./services/UserService'))
    .service('searchService', require('./services/SearchService'))
    .service('authService', require('./services/AuthService'))

    .constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        managed: 'managed'
    })



    .factory('basicAuthInjector', ['authService', function(authService) {
        var authInjector = {
            request: function(config) {
                if (authService.isAuthenticated) {
                    config.headers['Authentication'] = authService.getToken();
                }
                return config;
            }
        };
        return authInjector;
    }])


    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider)
    {
        $httpProvider.interceptors.push('basicAuthInjector');

        $urlRouterProvider.rule(function ($injector, $location) {
            //what this function returns will be set as the $location.url
            var path = $location.path(), normalized = path.toLowerCase();
            if (path != normalized) {
                //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
                $location.replace().path(normalized);
            }

            //todo: do a security check

            // because we've returned nothing, no state change occurs
            return path;
        });

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.when('', '/login');
        $urlRouterProvider.otherwise("/login");

    }])
    .factory('constants', function () {
        return {
            title: 'FamilyDAM'
        };
    });


App.run(["$rootScope", '$state', 'appService',
    function ($rootScope, $state, appService) {
        $state.go('login');
        /***
        console.log("add run");
        appService.loadConfig().then(function(data){
            $rootScope.preferences = data;
            if( !data.initialized )
            {
                // first time into the app, we'll start on the setup wizard/view
                //$state.go('login');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            jjh');
            }
        });
         ***/
    }]);



App.$inject = ['ui.router', '$rootScope', '$state', 'appService', 'authService'];

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

