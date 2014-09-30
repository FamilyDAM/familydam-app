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

var LoginService = function($http, AuthService)
{

    this.login = function(username_, password_)
    {
        var _config = {};
        _config.headers = {};
        _config.headers['Accept'] = "application/json";
        _config.headers['Content-Type'] = "application/x-www-form-urlencoded";
        _config.headers['X-Requested-With'] = "XMLHttpRequest";

        //var _args = $.param({ username:username, password:password });

        //todo: make port dynamic
        var method =  $http.post('http://localhost:8080/api/users/login',
            "username=" +username_ +"&password=" +password_,
            _config);

        return method.then(
            function(result){
                AuthService.isAuthenticated = true;
                AuthService.username = username_;
                AuthService.password = password_;
                return result;
            },function(responseError){
                return responseError;
            }
        );
    };



    this.listUsers = function()
    {
        var _config = {};
        _config.headers = {};
        _config.headers['Accept'] = "application/json";

        //todo: make port dynamic
        var method =  $http.get('http://localhost:8080/api/users'); //, _config);

        return method;
    };


    this.getUser = function(username)
    {
        var method =  $http.get('http://localhost:8080/api/users/' +username);
        return method.then(
            function(result){
                return result;
            }
        );
    };

};

LoginService.$inject = ['$http', 'authService'];
module.exports = LoginService;