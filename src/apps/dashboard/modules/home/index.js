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

module.exports = angular.module('dashboard.main', ['ui.router'])
    .controller('HomeController', require('../home/controllers/HomeController'))


    .directive('openfilebrowser', function() {
        return function(scope, element, attrs) {

            element.bind('openFileBrowser', function(e){
                // Do something
                console.dir(scope);

                //var ipc = require('ipc');
                //console.log(ipc.sendSync('openFileAndFolderDialogRequest'));
            });
        };
    })

    .directive('addfilebridge', function() {
        return function(scope, element, attrs) {

            element.bind('toggle', function(e){
                // Do something
                console.dir(scope);
                document.querySelector("#uploaderOverlay").toggle();
            });
        };
    })


    .directive('leftdrawerbridge', function() {
        this.openLeftDrawer = function () {
            document.querySelector("#leftDrawer").style.width = "265px";
            document.querySelector("#leftDrawer").style.display = "block";
            document.querySelector("#leftDrawer #content").style.display = "block";
        };

        this.closeLeftDrawer = function () {
            document.querySelector("#leftDrawer").style.width = "45px";
            document.querySelector("#leftDrawer #content").style.display = "none";
        };

        this.toggleLeftDrawer = function () {
            var w = document.querySelector("#leftDrawer").style.width;
            var d = document.querySelector("#leftDrawer").style.display;
            if (w == "45px" || d == "none")
            {
                openLeftDrawer();
            } else
            {
                closeLeftDrawer();
            }
        };

        return function(scope, element, attrs) {

            element.bind('toggle', function(e){
                // Do something
                //console.log("directive captured toggle event");
                //console.dir(scope);
                toggleLeftDrawer();
                 //console.log('left-drawer');toggleLeftDrawer()
            });
        };
    })
    .directive('rightDrawerBridge', function() {
        this.openRightDrawer = function () {
            document.querySelector("#rightDrawer").style.width = "350px";
            document.querySelector("#rightDrawer").style.display = "block";
            document.querySelector("#rightDrawer #content").style.display = "block";
        };

        this.closeRightDrawer = function () {
            document.querySelector("#rightDrawer").style.display = "none";
        };

        this.toggleRightDrawer = function () {
            var d = document.querySelector("#rightDrawer").style.display;
            if ( d == "none")
            {
                openRightDrawer();
            } else
            {
                closeRightDrawer();
            }

            //document.querySelector("#photoList").layout();
        };

        return function(scope, element, attrs) {

            element.bind('toggle', function(e){
                // Do something
                //console.log("directive captured foo event");
                //console.dir(scope);
                toggleRightDrawer();
                 //console.log('left-drawer');toggleLeftDrawer()
            });
        };
    })

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: "modules/home/home.tpl.html"
        });
    }]);