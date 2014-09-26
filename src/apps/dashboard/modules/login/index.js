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


module.exports = angular.module('dashboard.login', ['ui.bootstrap'])
    .controller('LoginController', require('./controllers/LoginController'))

    .directive('loginEventBridge', function() {
        return function(scope, element, attrs) {
            element.bind('login', function(e){
                // Do something
                console.log("directive captured event");
                scope.handleLogin(e);
            });
        };
    })

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: "modules/login/login.tpl.html",
            controller: "LoginController"
        });

    }]);


/**** Alternate approach to $document.on, in controller.
 .directive('login', function ($document, $parse) {
        //@see http://www.bennadel.com/blog/2422-capturing-document-click-events-with-angularjs.htm
 var linkFunction = function ($scope, $element, $attributes) {
            var scopeExpression = $attributes.bnDocumentClick;
            var invoker = $parse(scopeExpression);
            $document.on("login", function (event) {
                $scope.$apply(
                    function () {
                        console.log('login directive');
                        // Invoke the handler on the scope, mapping the event to the $event object.
                        invoker(
                            $scope,
                            {
                                $event: event
                            }
                        );

                    }
                );
            });
        };
 }) ***/