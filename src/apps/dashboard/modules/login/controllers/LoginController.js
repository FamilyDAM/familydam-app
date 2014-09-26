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

var LoginController = function($window, $scope, $rootScope, $location, loginService, $interval, $document)
{
    $scope.loginForm = {username:"admin", password:"admin"}; //todo:remove the hard coded login values
    $scope.nowTimestamp = new Date();
    $scope.validationErrorMessage = "";

    var timestampPromise = $interval(function(){
        $scope.nowTimestamp = new Date();
    }, 1000);


    $scope.authenticateUser = function()
    {
        var loginQ = loginService.login($scope.loginForm.username, $scope.loginForm.password);
        loginQ.then(
            function(data, status, headers, config)
            {
                $rootScope.username = $scope.loginForm.username;

                var getUserQ = loginService.getUser($scope.loginForm.username);
                getUserQ.then(
                    function(data)
                    {
                        $rootScope.user = data;
                        //$location.path("")
                        // after login, turn off full screen


                    }, function(reason) {
                        $scope.message = reason;
                    }
                );
            }, function(response){
                // todo: error handler
                $scope.message = response.data;
            }
        );
    };

    // reset the logged in user
    $rootScope.user = null;


    $scope.handleLogin = function(event){
        //$scope.validationErrorMessage = "Event Caught, Service not implemented yet";
        console.log("username=" +event.detail.username);
        console.log("password=" +event.detail.password);

        //redirect to files (todo: redirect to /dashboard)
        $location.path('/files');
    };
};

LoginController.$inject = ['$window','$scope', '$rootScope', '$location', 'loginService', '$interval', '$document'];
module.exports = LoginController;
