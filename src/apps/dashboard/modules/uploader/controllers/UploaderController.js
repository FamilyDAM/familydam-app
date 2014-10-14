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

var UploaderController = function($window, $document, $scope, $rootScope, $location)
{
    $scope.fileList = [];

    $scope.uploadFile = function(e){
        console.log("upload file = " +e);
        $window.uploadFile(e.path);
    };


    $scope.removeFile = function(e){
        console.dir("remove file = " + e.path);

        var pos = $scope.fileList.indexOf(e);
        if( pos > -1){
            $scope.fileList.splice(pos, 1);
        }
    };

    // our directive can't see the local $scope, but if we store this in the root scope we are ok (bad hack, but it works)
    $rootScope.selectFilesHandler = function(data) {
        console.log("{UploaderController} root selectFiles");
        console.dir(data);
        for (var i = 0; i < data.length; i++)
        {
            var obj = data[i];
            if ($scope.fileList.indexOf(obj) == -1){
                $scope.fileList.push(obj);
            }
        }
    };

};

UploaderController.$inject = ['$window', '$document', '$scope', '$rootScope', '$location'];
module.exports = UploaderController;
