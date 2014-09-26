angular.module('dashboard.templates', ['apps/dashboard/modules/files/files.tpl.html', 'apps/dashboard/modules/login/login.tpl.html', 'apps/dashboard/modules/main/main.tpl.html']);

angular.module("apps/dashboard/modules/files/files.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/files/files.tpl.html",
    "<!--\n" +
    "  ~ This file is part of FamilyDAM Project.\n" +
    "  ~\n" +
    "  ~     The FamilyDAM Project is free software: you can redistribute it and/or modify\n" +
    "  ~     it under the terms of the GNU General Public License as published by\n" +
    "  ~     the Free Software Foundation, either version 3 of the License, or\n" +
    "  ~     (at your option) any later version.\n" +
    "  ~\n" +
    "  ~     The FamilyDAM Project is distributed in the hope that it will be useful,\n" +
    "  ~     but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
    "  ~     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
    "  ~     GNU General Public License for more details.\n" +
    "  ~\n" +
    "  ~     You should have received a copy of the GNU General Public License\n" +
    "  ~     along with the FamilyDAM Project.  If not, see <http://www.gnu.org/licenses/>.\n" +
    "  -->\n" +
    "\n" +
    "<script src=\"components/platform/platform.js\"></script>\n" +
    "\n" +
    "TODO FILE LIST");
}]);

angular.module("apps/dashboard/modules/login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/login/login.tpl.html",
    "<script src=\"components/platform/platform.js\"></script>\n" +
    "<link rel=\"import\" href=\"modules/login/components/login-users/login-user.html\"/>\n" +
    "\n" +
    "<div class=\"header\">\n" +
    "    <div class=\"timestamp\">{{nowTimestamp|date:'h:mm:ss a'}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<login-user id=\"loginUsersList\"\n" +
    "            validationMessage=\"{{validationErrorMessage}}\"\n" +
    "            login-event-bridge></login-user>\n" +
    "");
}]);

angular.module("apps/dashboard/modules/main/main.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/main/main.tpl.html",
    "<div class=\"navbar\">\n" +
    "    <div class=\"navbar-inner\">\n" +
    "        <div class=\"container\">\n" +
    "            <a class=\"navbar-brand\" ui-sref=\"home\"><span>Family D.A.M.</span></a>\n" +
    "            <!-- start: Header Menu -->\n" +
    "            <!-- start: Main Menu -->\n" +
    "            <nav class=\"navbar navbar-default pull-right\" ng-disabled=\"( user == undefined )\">\n" +
    "                <div class=\"container-fluid\">\n" +
    "                    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "                    <div class=\"navbar-header\">\n" +
    "                        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\"\n" +
    "                                data-target=\"#bs-example-navbar-collapse-1\">\n" +
    "                            <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                            <span class=\"icon-bar\"></span>\n" +
    "                            <span class=\"icon-bar\"></span>\n" +
    "                            <span class=\"icon-bar\"></span>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "                    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n" +
    "                        <ul class=\"nav navbar-nav main-menu\">\n" +
    "\n" +
    "                            <li class=\"dropdown\" ng-class=\"{ active: $state.includes('files') }\">\n" +
    "                                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">Files <b class=\"caret\"></b></a>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li><a ui-sref=\"files\">All Files</a></li>\n" +
    "                                    <li class=\"divider\"></li>\n" +
    "                                    <li><a ui-sref=\"photos:files\">Photos</a></li>\n" +
    "                                    <li><a ui-sref=\"music:files\">Music</a></li>\n" +
    "                                    <li><a ui-sref=\"movies:files\">Movies</a></li>\n" +
    "                                    <!--\n" +
    "                                    <li class=\"divider\"></li>\n" +
    "                                    <li><a ui-sref=\"web\">Google Drive</a></li>\n" +
    "                                    <li><a href=\"#\">Dropbox</a></li>\n" +
    "                                    <li><a href=\"#\">box.net</a></li>\n" +
    "                                    <li><a href=\"#\">Amazon S3</a></li>\n" +
    "                                    -->\n" +
    "                                </ul>\n" +
    "                            </li>\n" +
    "                            <li ng-class=\"{ active: $state.includes('photos:files') || $state.includes('photos:grid') || $state.includes('photos:details') }\">\n" +
    "                                <a ui-sref=\"photos:grid\"><i class=\"icon-bar-chart\"></i><span\n" +
    "                                        class=\"hidden-sm\">Photos</span></a>\n" +
    "                            </li>\n" +
    "                            <li ng-class=\"{ active: $state.includes('music:files') }\">\n" +
    "                                <a ui-sref=\"music:files\"><i class=\"icon-bar-chart\"></i><span\n" +
    "                                        class=\"hidden-sm\">Music</span></a>\n" +
    "                            </li>\n" +
    "                            <li ng-class=\"{ active: $state.includes('movies:files') }\">\n" +
    "                                <a ui-sref=\"movies:files\"><i class=\"icon-bar-chart\"></i><span\n" +
    "                                        class=\"hidden-sm\">Movies</span></a>\n" +
    "                            </li>\n" +
    "                            <!--\n" +
    "                            <li>\n" +
    "                                <a class=\"dropmenu\" href=\"\"><i class=\"icon-edit\"></i><span class=\"hidden-sm\"> Email</span></a>\n" +
    "                            </li>\n" +
    "                            -->\n" +
    "                            <!--\n" +
    "                            <li class=\"dropdown\">\n" +
    "                                <a class=\"dropdown-toggle\" data-toggle=\"dropdown\">Social Web <b class=\"caret\"></b></a>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li><a ui-sref=\"web\">Facebook</a></li>\n" +
    "                                    <li><a href=\"#\">Twitter</a></li>\n" +
    "                                    <li><a href=\"#\">Instagram</a></li>\n" +
    "                                </ul>\n" +
    "                            </li>\n" +
    "                            -->\n" +
    "\n" +
    "                            <li class=\"dropdown\">\n" +
    "                                <a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" href=\"ui-sliders-progress.html#\">\n" +
    "                                    <i class=\"halflings-icon white user\"></i> MIKE NIMER\n" +
    "                                    <span class=\"caret\"></span>\n" +
    "                                </a>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li><a href=\"#/user/manager\"><i class=\"halflings-icon white user\"></i> User\n" +
    "                                        Manger</a></li>\n" +
    "                                    <li><a ui-sref=\"login\"><i class=\"halflings-icon white off\"></i> Logout</a></li>\n" +
    "                                    <li class=\"divider\"></li>\n" +
    "                                    <li><a href=\"/.explorer.html\" target=\"_blank\">JCR Explorer</a></li>\n" +
    "                                    <li><a href=\"/system/console\" target=\"_blank\">System Console</a></li>\n" +
    "                                </ul>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </nav>\n" +
    "            <!-- end: Main Menu -->\n" +
    "            <!-- end: Header Menu -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- start: Header -->\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <div>\n" +
    "        <div class=\"row primaryView\">\n" +
    "            <div class=\"col-xs-12 section\">\n" +
    "                <div ui-view ng-animate=\"'view'\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <a id=\"widgets-area-button\" class=\"hidden-sm hidden-xs open\"><i class=\"icon-reorder\"></i></a>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!--\n" +
    "<div class=\"clearfix\"></div>\n" +
    "    <footer>\n" +
    "    <div class=\"container\">\n" +
    "        <span id=\"systemStatus\">...</span>\n" +
    "        <span id=\"toolbar\" class=\"pull-right\">\n" +
    "            <button type=\"button\" class=\"glyphicon glyphicon-fullscreen btn btn-default btn-sm\" ng-click=\"toggleFullScreenMode()\"></button>\n" +
    "            <span class=\"hidden-phone\" style=\"text-align:right;float:right\">Powered by: FamilyDAM Project</span>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</footer>\n" +
    "-->");
}]);
