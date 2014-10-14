angular.module('dashboard.templates', ['apps/dashboard/modules/files/files.tpl.html', 'apps/dashboard/modules/home/home.tpl.html', 'apps/dashboard/modules/login/login.tpl.html', 'apps/dashboard/modules/photos/left-drawer.tpl.html', 'apps/dashboard/modules/photos/photos.tpl.html', 'apps/dashboard/modules/photos/right-drawer.tpl.html', 'apps/dashboard/modules/uploader/left-drawer.tpl.html', 'apps/dashboard/modules/uploader/right-drawer.tpl.html', 'apps/dashboard/modules/uploader/uploader.tpl.html']);

angular.module("apps/dashboard/modules/files/files.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/files/files.tpl.html",
    "<body unresolved onload=\"onLoadHandler()\">\n" +
    "\n" +
    "<core-drawer-panel id=\"filePanel\" class=\"right-drawer\" selected=\"main\" >\n" +
    "    <div main>\n" +
    "        <core-scroll-header-panel >\n" +
    "            <core-toolbar  class=\"medium-tall\">\n" +
    "                <core-icon-button icon=\"arrow-back\" onclick=\"window.location.href='index.html';\"></core-icon-button>\n" +
    "                <div flex>FamilyDAM</div>\n" +
    "                <paper-tabs style=\"min-width: 150px;\">\n" +
    "                    <paper-tab ui-sref=\"files\">Files</paper-tab>\n" +
    "                    <paper-tab ui-sref=\"photos\">Photos</paper-tab>\n" +
    "                </paper-tabs>\n" +
    "                <core-icon-button icon=\"search\"></core-icon-button>\n" +
    "                <core-icon-button icon=\"more-vert\"></core-icon-button>\n" +
    "                <div class=\"middle indent title\" style=\"margin-left: 100px;\">/photos/</div>\n" +
    "                <div class=\"bottom\">\n" +
    "                    <paper-fab icon=\"add\" onclick=\"toggleUploader();\" style=\"z-index: 10\"></paper-fab>\n" +
    "                </div>\n" +
    "            </core-toolbar>\n" +
    "        </core-scroll-header-panel>\n" +
    "\n" +
    "\n" +
    "\n" +
    "        <div horizontal layout style=\"height: 45px; width: 100%; background-color: #eee; top:128px; position:absolute; left:0px; right: 0px;\">\n" +
    "            <div flex></div>\n" +
    "            <div style=\"height:45px; vertical-align: bottom;font-size: 24px;margin-top: 10px; margin-bottom: 10px;\">\n" +
    "\n" +
    "            </div>\n" +
    "            <div style=\"width:80px;\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <core-drawer-panel class=\"drawer\" style=\"top:180px;\">\n" +
    "            <!-- LEFT DRAWER -->\n" +
    "            <div drawer>\n" +
    "                <div id=\"fileTree\" class=\"sidebar\">\n" +
    "\n" +
    "                    <ul style=\"margin-left: -20px;list-style: none;\">\n" +
    "\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            <a href=\"familyplanning.html\" style=\"text-decoration:none;\">Family Planning (3.0)</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            <b><i>Files</i></b>\n" +
    "                            <ul style=\"list-style: none;\">\n" +
    "                                <li>\n" +
    "                                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                                    Angela\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                                    <i><b>Mike</b></i>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                                    Kayden\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                                    Hailey\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            <a href=\"photos.html\"  style=\"text-decoration:none;\">Photos</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            <a href=\"music.html\"  style=\"text-decoration:none;\">Music</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            <a href=\"movies.html\"  style=\"text-decoration:none;\">Movies</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            <a href=\"emails.html\"  style=\"text-decoration:none;\">Email Archive (2.0)</a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            <a href=\"social.html\"  style=\"text-decoration:none;\">Social Web (2.0)</a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <!-- MAIN -->\n" +
    "            <div main>\n" +
    "                <div folders>\n" +
    "                    <h2>Folders</h2>\n" +
    "\n" +
    "                    <core-list id=\"folderList\">\n" +
    "                        <template>\n" +
    "                            <div class=\"item folder\">\n" +
    "                                <span>\n" +
    "                                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                                </span>\n" +
    "                                <span class=\"\">\n" +
    "                                    <span class=\"folderName\">{{name}}</span>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </template>\n" +
    "                    </core-list>\n" +
    "                </div>\n" +
    "\n" +
    "                <div files>\n" +
    "                    <h2>Files</h2>\n" +
    "\n" +
    "                    <core-list id=\"fileList\" height=\"80\">\n" +
    "                        <template>\n" +
    "\n" +
    "                            <div class=\"row {{ {selected: selected} | tokenList }}\" height=\"80\">\n" +
    "                                <div horizontal layout>\n" +
    "                                            <span style=\"padding-right: 10px;\">\n" +
    "                                                <img src=\"{{thumbnail}}\" style=\"width:70px; height:70px;\"/>\n" +
    "                                            </span>\n" +
    "                                            <span flex>\n" +
    "                                                <span class=\"fileName\">{{name}}</span><br/>\n" +
    "                                                <span class=\"album\">{{album}}</span><br/>\n" +
    "                                                <span class=\"timestamp\">{{dateCreated}}</span> by <span class=\"fileName\">{{owner}}</span>\n" +
    "                                            </span>\n" +
    "                                            <span style=\"width: 100px;\">\n" +
    "                                                <span class=\"status\" style=\"color:#ccc;\">debug<br/>selected:{{selected}}</span>\n" +
    "                                            </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </template>\n" +
    "                    </core-list>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </core-drawer-panel>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "    <div id=\"rightDrawer\" drawer >\n" +
    "\n" +
    "        <core-scroll-header-panel id=\"rightDrawerHeaderPanel\" condensedHeaderHeight=\"65\"\n" +
    "                                  style=\"border-bottom: 1px solid #000;\">\n" +
    "            <core-toolbar class=\"medium-tall\">\n" +
    "                <div flex></div>\n" +
    "                <core-icon-button icon=\"close\" on-click=\"$('#filePanel').closeDrawer();\"></core-icon-button>\n" +
    "            </core-toolbar>\n" +
    "        </core-scroll-header-panel>\n" +
    "\n" +
    "\n" +
    "        <div horizontal layout style=\"height: 45px; width: 100%; background-color: #eee; top:128px; position:absolute; left:0px; right: 0px;\">\n" +
    "            <div><h2>Preview</h2></div>\n" +
    "        </div>\n" +
    "        <!-- RIGHT DRAWER -->\n" +
    "        <div style=\"position: relative; top:180px;\">\n" +
    "            <preview-photo id=\"photoPreview\"\n" +
    "                           class=\"sidebar preview\"></preview-photo>\n" +
    "\n" +
    "            <preview-album id=\"musicPreview\"\n" +
    "                           class=\"sidebar preview\"></preview-album>\n" +
    "\n" +
    "            <preview-video id=\"videoPreview\"\n" +
    "                           class=\"sidebar preview\"></preview-video>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</core-drawer-panel>\n" +
    "\n" +
    "<file-uploader id=\"uploaderOverlay\"></file-uploader>\n" +
    "\n" +
    "<script>\n" +
    "\n" +
    "    // custom transformation: scale header's title\n" +
    "    var titleStyle = document.querySelector('.title').style;\n" +
    "    addEventListener('core-header-transform', function (e) {\n" +
    "        var d = e.detail;\n" +
    "        var m = d.height - d.condensedHeight;\n" +
    "        var scale = Math.max(0.75, (m - d.y) / (m / 0.25) + 0.75);\n" +
    "        titleStyle.webkitTransform = titleStyle.transform =\n" +
    "                'scale(' + scale + ') translateZ(0)';\n" +
    "    });\n" +
    "\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<script>\n" +
    "    var timerId;\n" +
    "    var firstClick = 0;\n" +
    "    var fileSelectionHandler = function (event) {\n" +
    "\n" +
    "        // update ui //todo, fix this.\n" +
    "        event.detail.data.selected = true;\n" +
    "        event.detail.item.selected = true;\n" +
    "\n" +
    "        $(\".row\").css(\"background-color\", \"#fff\");\n" +
    "        event.detail.item.style.backgroundColor = \"lightgrey\";\n" +
    "\n" +
    "        //trigger events\n" +
    "        var now = Number(new Date());\n" +
    "        if (firstClick > 0 && (now - firstClick) < 300)\n" +
    "        {\n" +
    "            now = 0;\n" +
    "            window.clearTimeout(timerId);\n" +
    "            doubleClickHandler(event);\n" +
    "        } else\n" +
    "        {\n" +
    "            firstClick = now;\n" +
    "            timerId = window.setTimeout(function () {\n" +
    "                singleClickHandler(event);\n" +
    "            }, 310);\n" +
    "        }\n" +
    "\n" +
    "    };\n" +
    "\n" +
    "    var doubleClickHandler = function (event) {\n" +
    "        console.log(\"{FileSelectAction} doubleClickHandler\");\n" +
    "        var details = event.detail.data;\n" +
    "        switch (details.type)\n" +
    "        {\n" +
    "            case \"image\":\n" +
    "                console.log(\"goto photo detail page\");\n" +
    "                break;\n" +
    "            case \"music\":\n" +
    "                console.log(\"goto audio detail page\");\n" +
    "                break;\n" +
    "            case \"movies\":\n" +
    "                console.log(\"goto music detail page\");\n" +
    "                break;\n" +
    "        }\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "    var singleClickHandler = function (event) {\n" +
    "\n" +
    "        console.log(\"{FileSelectAction} singleClickHandler\");\n" +
    "        var item = event.detail.item;\n" +
    "        var details = event.detail.data;\n" +
    "\n" +
    "        switch (details.type)\n" +
    "        {\n" +
    "            case \"image\":\n" +
    "                previewPhoto(details);\n" +
    "                break;\n" +
    "            case \"music\":\n" +
    "                previewMusic(details);\n" +
    "                break;\n" +
    "            case \"movies\":\n" +
    "                previewMovie(details);\n" +
    "                break;\n" +
    "        }\n" +
    "    }\n" +
    "\n" +
    "    var previewPhoto = function (_details) {\n" +
    "        document.querySelector(\"#rightDrawer\").style.display = \"inline-block\";\n" +
    "        document.querySelector(\"#filePanel\").openDrawer();\n" +
    "        document.querySelector(\"#photoPreview\").data = _details;\n" +
    "        document.querySelector(\"#photoPreview\").style.display = \"block\";\n" +
    "        document.querySelector(\"#musicPreview\").style.display = \"none\";\n" +
    "        document.querySelector(\"#videoPreview\").style.display = \"none\";\n" +
    "\n" +
    "\n" +
    "        //document.querySelector(\"#videoPreviewTag\").pause();\n" +
    "        //document.querySelector(\"#audioPreviewTag\").pause();\n" +
    "    };\n" +
    "\n" +
    "    var previewMusic = function (details) {\n" +
    "        document.querySelector(\"#rightDrawer\").style.display = \"inline-block\";\n" +
    "        document.querySelector(\"#filePanel\").openDrawer();\n" +
    "        document.querySelector(\"#photoPreview\").style.display = \"none\";\n" +
    "        document.querySelector(\"#musicPreview\").style.display = \"block\";\n" +
    "        document.querySelector(\"#videoPreview\").style.display = \"none\";\n" +
    "\n" +
    "        //document.querySelector(\"#videoPreviewTag\").pause();\n" +
    "    };\n" +
    "\n" +
    "    var previewMovie = function (details) {\n" +
    "        document.querySelector(\"#rightDrawer\").style.display = \"inline-block\";\n" +
    "        document.querySelector(\"#filePanel\").openDrawer();\n" +
    "        document.querySelector(\"#photoPreview\").style.display = \"none\";\n" +
    "        document.querySelector(\"#musicPreview\").style.display = \"none\";\n" +
    "        document.querySelector(\"#videoPreview\").style.display = \"block\";\n" +
    "\n" +
    "        //document.querySelector(\"#audioPreviewTag\").pause();\n" +
    "    };\n" +
    "\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<script>\n" +
    "\n" +
    "\n" +
    "    var strings = [\n" +
    "        \"PARKOUR!\",\n" +
    "        \"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...\",\n" +
    "        \"Lorem Ipsum is simply dummy text of the printing and typesetting industry.\"\n" +
    "    ];\n" +
    "\n" +
    "    var generateString = function (inLength) {\n" +
    "        var s = '';\n" +
    "        for (var i = 0; i < inLength; i++)\n" +
    "        {\n" +
    "            s += String.fromCharCode(Math.floor(Math.random() * 26) + 97);\n" +
    "        }\n" +
    "        return s;\n" +
    "    };\n" +
    "\n" +
    "    var generateName = function (inMin, inMax) {\n" +
    "        return this.generateString(Math.floor(Math.random() * (inMax - inMin + 1) + inMin));\n" +
    "    };\n" +
    "\n" +
    "\n" +
    "    var generateData = function (listCount) {\n" +
    "        var data = [];\n" +
    "        var names = ['Mike', 'Angela', 'Kayden'];\n" +
    "        var types = [\"image\", \"music\", \"movies\"];\n" +
    "        var imgWidth = [640, 1136, 640];\n" +
    "        var imgHeight = [1136, 640, 640];\n" +
    "        var imgUrls = ['http://lorempixel.com/{w}/{h}/abstract/', 'https://placeimg.com/{w}/{h}/any', 'http://placehold.it/{w}x{h}'];\n" +
    "        var musicUrl = ['http://www.vorbis.com/music/Epoq-Lepidoptera.ogg', 'http://www.vorbis.com/music/Epoq-Lepidoptera.ogg', 'http://www.vorbis.com/music/Epoq-Lepidoptera.ogg'];\n" +
    "        //var musicUrl = ['http://www.columbia.edu/cu/cuo/F2001-9.mp3', 'http://www.columbia.edu/cu/cuo/F2001-9.mp3', 'http://www.columbia.edu/cu/cuo/F2001-9.mp3'];\n" +
    "        //var movieUrl = ['http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4','http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4','http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'];\n" +
    "        var movieUrl = ['http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg', 'http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg', 'http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg'];\n" +
    "\n" +
    "\n" +
    "        for (var i = 0; i < listCount; i++)\n" +
    "        {\n" +
    "            var indx = Math.floor(Math.random() * 3);\n" +
    "            var file = {};\n" +
    "            file.type = types[indx];\n" +
    "            file.owner = names[indx];\n" +
    "            file.dateCreated = \"07/0\" + indx + \"/2014\"\n" +
    "\n" +
    "            if (file.type == \"image\")\n" +
    "            {\n" +
    "                file.name = generateName(8, 20) + \".jpg\";\n" +
    "                file.width = imgWidth[indx];\n" +
    "                file.height = imgHeight[indx];\n" +
    "                file.src = imgUrls[indx].replace(\"{w}\", file.width).replace(\"{h}\", file.height);\n" +
    "                file.thumbnail = imgUrls[indx].replace(\"{w}\", 200).replace(\"{h}\", 200);\n" +
    "            }\n" +
    "            else if (file.type == \"music\")\n" +
    "            {\n" +
    "                file.name = generateName(12, 18) + \".mp3\";\n" +
    "                file.artist = generateString(12);\n" +
    "                file.width = imgWidth[2];\n" +
    "                file.height = imgHeight[2];\n" +
    "                file.src = musicUrl[indx];\n" +
    "                file.thumbnail = imgUrls[indx].replace(\"{w}\", 70).replace(\"{h}\", 70);\n" +
    "            }\n" +
    "            else if (file.type == \"movies\")\n" +
    "            {\n" +
    "                file.name = generateName(12, 24) + \".mp4\";\n" +
    "                file.width = imgWidth[1];\n" +
    "                file.height = imgHeight[1];\n" +
    "                file.src = movieUrl[indx];\n" +
    "                file.thumbnail = imgUrls[indx].replace(\"{w}\", 70).replace(\"{h}\", 70);\n" +
    "            }\n" +
    "\n" +
    "            data.push(file);\n" +
    "        }\n" +
    "\n" +
    "        return data;\n" +
    "    };\n" +
    "\n" +
    "\n" +
    "    var onLoadHandler = function () {\n" +
    "        folders = [\n" +
    "            {name: \"2011\"},\n" +
    "            {name: \"2012\"},\n" +
    "            {name: \"2013\"},\n" +
    "            {name: \"2014\"}\n" +
    "        ];\n" +
    "        files = generateData(100);\n" +
    "        document.querySelector(\"#folderList\").data = folders;\n" +
    "        document.querySelector(\"#fileList\").data = files;\n" +
    "\n" +
    "        var selectHandler = document.querySelector(\"#fileList\");\n" +
    "        selectHandler.addEventListener('core-activate', function (event) {\n" +
    "            fileSelectionHandler(event);\n" +
    "        });\n" +
    "\n" +
    "        // by default close right preview panel\n" +
    "        document.querySelector(\"#filePanel\").closeDrawer();\n" +
    "    };\n" +
    "\n" +
    "\n" +
    "    var toggleUploader = function () {\n" +
    "        document.querySelector(\"#uploaderOverlay\").toggle();\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "</script>\n" +
    "");
}]);

angular.module("apps/dashboard/modules/home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/home/home.tpl.html",
    "<div id=\"homeTemplate\" layout horizontal>\n" +
    "\n" +
    "    <core-scroll-header-panel style=\"background-color: #fff;\" flex>\n" +
    "\n" +
    "        <core-toolbar class=\"medium-tall\" style=\"background-color: #5c6bc0;\">\n" +
    "            <core-icon-button id=\"primaryToolbarIcon\" icon=\"home\" onclick=\"toolbarIconHelper()\"></core-icon-button>\n" +
    "\n" +
    "            <div flex>FamilyDAM</div>\n" +
    "            <paper-tabs style=\"min-width: 150px;\">\n" +
    "                <paper-tab ui-sref=\"files\">Files</paper-tab>\n" +
    "                <paper-tab ui-sref=\"home.photos\">Photos</paper-tab>\n" +
    "            </paper-tabs>\n" +
    "            <core-icon-button icon=\"search\"></core-icon-button>\n" +
    "            <core-icon-button icon=\"more-vert\"></core-icon-button>\n" +
    "            <div class=\"middle indent title\" style=\"margin-left: 100px;\">/photos/</div>\n" +
    "            <div class=\"bottom\">\n" +
    "                <paper-fab icon=\"add\"\n" +
    "                           onclick=\"this.fire('addFiles');\"\n" +
    "                           add-file-bridge\n" +
    "                           style=\"z-index: 10\"></paper-fab>\n" +
    "            </div>\n" +
    "        </core-toolbar>\n" +
    "\n" +
    "        <div content>\n" +
    "            <div layout horizontal style=\"top:128px;\">\n" +
    "\n" +
    "                <aside id=\"leftDrawer\"\n" +
    "                       style=\"background-color: #eee; width:256px; height:100%;\">\n" +
    "\n" +
    "                    <div horizontal layout\n" +
    "                         style=\"height: 45px; width: 100%; position:relative; left:0px; right: 0px;\">\n" +
    "                        <div flex> </div>\n" +
    "                        <div>\n" +
    "                            <paper-icon-button id=\"navicon\" icon=\"menu\"\n" +
    "                                               onclick=\"this.fire('toggle', event)\"\n" +
    "                                               leftdrawerbridge></paper-icon-button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div ui-view=\".leftDrawer\"></div>\n" +
    "               </aside>\n" +
    "\n" +
    "                <div id=\"body\" style=\"width:100%;\">\n" +
    "                    <div horizontal layout\n" +
    "                         style=\"height: 45px; width: 100%; background-color: #eee; position:relative; left:0px; right: 0px;\">\n" +
    "                        <div flex> </div>\n" +
    "                        <div layout horizontal center>\n" +
    "                            <label>Group By:</label>\n" +
    "                            <paper-button label=\"Date\"></paper-button>\n" +
    "                            |\n" +
    "                            <paper-button label=\"Location\"></paper-button>\n" +
    "\n" +
    "                        </div>\n" +
    "                        <div style=\"width:120px;\"></div>\n" +
    "                        <div>\n" +
    "                            <paper-icon-button id=\"navicon\" icon=\"menu\"\n" +
    "                                               onclick=\"this.fire('toggle', event)\"\n" +
    "                                               right-drawer-bridge></paper-icon-button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div  ui-view=\".body\"></div>\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "                <aside id=\"rightDrawer\"\n" +
    "                       style=\"background-color:#eee;width:350px;display:none\">\n" +
    "                    <div horizontal layout\n" +
    "                         style=\"height: 45px; width: 100%; position:relative; left:0px; right: 0px;\">\n" +
    "                        <div flex></div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div ui-view=\".rightDrawer\"></div>\n" +
    "                </aside>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </core-scroll-header-panel>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<file-uploader id=\"uploaderOverlay\" openfilebrowser></file-uploader>\n" +
    "\n" +
    "<script>\n" +
    "\n" +
    "    // custom transformation: scale header's title\n" +
    "    /**  todo fix the selector since it is now in a template tag\n" +
    "     var titleStyle = document.querySelector('.title').style;\n" +
    "     addEventListener('core-header-transform', function (e) {\n" +
    "        var d = e.detail;\n" +
    "        var m = d.height - d.condensedHeight;\n" +
    "        var scale = Math.max(0.75, (m - d.y) / (m / 0.25) + 0.75);\n" +
    "        titleStyle.webkitTransform = titleStyle.transform =\n" +
    "            'scale(' + scale + ') translateZ(0)';\n" +
    "    });\n" +
    "     **/\n" +
    "\n" +
    "</script>\n" +
    "\n" +
    "");
}]);

angular.module("apps/dashboard/modules/login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/login/login.tpl.html",
    "<link rel=\"import\" href=\"modules/login/components/login-users/login-users.html\"/>\n" +
    "<div class=\"loginTemplate\">\n" +
    "<div class=\"header\">\n" +
    "    <div class=\"timestamp\">{{nowTimestamp|date:'h:mm:ss a'}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<login-users\n" +
    "        id=\"loginUsersList\"\n" +
    "        users=\"{{users}}\"\n" +
    "        validationMessage=\"{{validationErrorMessage}}\"\n" +
    "        login-event-bridge></login-users>\n" +
    "</div>");
}]);

angular.module("apps/dashboard/modules/photos/left-drawer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/photos/left-drawer.tpl.html",
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
    "<!-- LEFT DRAWER -->\n" +
    "<div>\n" +
    "\n" +
    "\n" +
    "    <div id=\"content\" style=\"background-color: #fff; position: absolute; width: 256px;\">\n" +
    "        <div id=\"users\" style=\"margin: 20px;\">\n" +
    "            <core-icon class=\"avatar\" icon=\"avatars:avatar-1\" aria-label=\"avatar-2\" role=\"img\">\n" +
    "                <svg viewBox=\"0 0 128 128\" height=\"100%\" width=\"100%\"\n" +
    "                     preserveAspectRatio=\"xMidYMid meet\" fit=\"\"\n" +
    "                     style=\"pointer-events: none; display: block;\">\n" +
    "                    <g>\n" +
    "                        <path fill=\"#B9F6CA\" d=\"M0 0h128v128h-128z\"></path>\n" +
    "                        <path fill=\"#FFCC80\"\n" +
    "                              d=\"M70.1 122.5l.6-.1c6.1-.8 12-2.4 17.7-4.8 1.2-.5 2.4-1.1 3.2-2.1 1.3-1.7-.1-5.6-.5-7.7-.7-3.8-1.3-7.7-1.9-11.5-.7-4.5-1.5-9.1-1.6-13.7-.2-7.6.7-12.3 1.9-15.3h9l-2.6-10.4c-.2-2.4-.4-4.8-.7-6.8-.2-1.9-.6-3.6-1.2-5.3-14.9 2.2-24.5.9-30.7-1.8l-23.1 4.5-.7.1h-.7c-.4-.1-.9-.2-1.2-.4-.4 0-.9 0-1.4.1-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1 5.8 5.9 8.4 13.8 7.4 22-.6 4.7-2.2 9.4-4.4 13.6-.5 1-1 1.6-1.1 2.8-.1 1.1-.1 2.3.1 3.4.4 2.3 1.5 4.4 3 6.2 2.6 3.1 6.4 5 10.4 5.8 3.8.4 7.6.3 11.4-.1zm9.5-67.6c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6c-.1-.8.7-1.6 1.6-1.6zM128 97.7c-3.3 1.9-6.6 3.7-9.9 5.3-3.2 1.5-6.3 2.9-9.6 4.2-.9.4-2.1.5-2.9 1.1-1.1.8-1.9 2.5-2.3 3.7-.6 1.6-.6 3.4.3 4.8.8 1.2 2.1 2 3.5 2.6 5.9 2.9 12.2 5.1 18.6 6.5 1.4.3 2.3 1.8 2.4.1v-28.1c-.1.1-.1-.1-.1-.2z\"></path>\n" +
    "                        <path d=\"M38.9 47.4zM39.6 47.4z\" fill=\"none\"></path>\n" +
    "                        <path fill=\"#444\"\n" +
    "                              d=\"M94.2 44.9c-.8-2.6-1.8-5-3.2-7.2l-7.2 1.4-20.4 4c6.3 2.7 15.9 4 30.8 1.8z\"></path>\n" +
    "                        <path fill=\"#E65100\"\n" +
    "                              d=\"M38.9 48.4h.7c.2 0 .5 0 .7-.1l23.1-4.5 20.4-4 23.3-4.5c1.9-.4 3.2-2 2.9-3.6-.3-1.6-2.1-2.6-4.1-2.3l-19.6 3.8-1.3-6.8c-2-10.9-15-17.7-29.1-14.9-14 2.7-23.7 13.9-21.6 24.9h.1l1.7 9v.7c.2.8.7 1.4 1.4 1.9.5.1 1 .3 1.4.4z\"></path>\n" +
    "                        <circle fill=\"#444\" cx=\"79.6\" cy=\"56.5\" r=\"2\"></circle>\n" +
    "                        <path fill=\"#689F38\"\n" +
    "                              d=\"M128 128v-1.8l-21.7-18.2-.4.2-2.9 1.3c-3 1.3-6 2.6-9.2 3.8l-1.4.5c-9 3.3-16.5 4.1-22.8 3.6-16.4-1.3-23.8-11.9-23.8-11.9-2.2 4.2-5.2 8.7-9.2 13.5l-.3.4-1.7 2c-.9 1.1-2 2.6-3.4 4.5-.4.6-.9 1.3-1.4 2l98.2.1z\"></path>\n" +
    "                        <path fill=\"#FFCC80\" d=\"M36.3 119.3s.1-.2.2-.3c-.1.1-.2.2-.2.3z\"></path>\n" +
    "                    </g>\n" +
    "                </svg>\n" +
    "            </core-icon>\n" +
    "            <core-icon class=\"avatar\" icon=\"avatars:avatar-2\" aria-label=\"avatar-2\" role=\"img\">\n" +
    "                <svg viewBox=\"0 0 128 128\" height=\"100%\" width=\"100%\"\n" +
    "                     preserveAspectRatio=\"xMidYMid meet\" fit=\"\"\n" +
    "                     style=\"pointer-events: none; display: block;\">\n" +
    "                    <g>\n" +
    "                        <path fill=\"#B9F6CA\" d=\"M0 0h128v128h-128z\"></path>\n" +
    "                        <path fill=\"#FFCC80\"\n" +
    "                              d=\"M70.1 122.5l.6-.1c6.1-.8 12-2.4 17.7-4.8 1.2-.5 2.4-1.1 3.2-2.1 1.3-1.7-.1-5.6-.5-7.7-.7-3.8-1.3-7.7-1.9-11.5-.7-4.5-1.5-9.1-1.6-13.7-.2-7.6.7-12.3 1.9-15.3h9l-2.6-10.4c-.2-2.4-.4-4.8-.7-6.8-.2-1.9-.6-3.6-1.2-5.3-14.9 2.2-24.5.9-30.7-1.8l-23.1 4.5-.7.1h-.7c-.4-.1-.9-.2-1.2-.4-.4 0-.9 0-1.4.1-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1 5.8 5.9 8.4 13.8 7.4 22-.6 4.7-2.2 9.4-4.4 13.6-.5 1-1 1.6-1.1 2.8-.1 1.1-.1 2.3.1 3.4.4 2.3 1.5 4.4 3 6.2 2.6 3.1 6.4 5 10.4 5.8 3.8.4 7.6.3 11.4-.1zm9.5-67.6c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6c-.1-.8.7-1.6 1.6-1.6zM128 97.7c-3.3 1.9-6.6 3.7-9.9 5.3-3.2 1.5-6.3 2.9-9.6 4.2-.9.4-2.1.5-2.9 1.1-1.1.8-1.9 2.5-2.3 3.7-.6 1.6-.6 3.4.3 4.8.8 1.2 2.1 2 3.5 2.6 5.9 2.9 12.2 5.1 18.6 6.5 1.4.3 2.3 1.8 2.4.1v-28.1c-.1.1-.1-.1-.1-.2z\"></path>\n" +
    "                        <path d=\"M38.9 47.4zM39.6 47.4z\" fill=\"none\"></path>\n" +
    "                        <path fill=\"#444\"\n" +
    "                              d=\"M94.2 44.9c-.8-2.6-1.8-5-3.2-7.2l-7.2 1.4-20.4 4c6.3 2.7 15.9 4 30.8 1.8z\"></path>\n" +
    "                        <path fill=\"#E65100\"\n" +
    "                              d=\"M38.9 48.4h.7c.2 0 .5 0 .7-.1l23.1-4.5 20.4-4 23.3-4.5c1.9-.4 3.2-2 2.9-3.6-.3-1.6-2.1-2.6-4.1-2.3l-19.6 3.8-1.3-6.8c-2-10.9-15-17.7-29.1-14.9-14 2.7-23.7 13.9-21.6 24.9h.1l1.7 9v.7c.2.8.7 1.4 1.4 1.9.5.1 1 .3 1.4.4z\"></path>\n" +
    "                        <circle fill=\"#444\" cx=\"79.6\" cy=\"56.5\" r=\"2\"></circle>\n" +
    "                        <path fill=\"#689F38\"\n" +
    "                              d=\"M128 128v-1.8l-21.7-18.2-.4.2-2.9 1.3c-3 1.3-6 2.6-9.2 3.8l-1.4.5c-9 3.3-16.5 4.1-22.8 3.6-16.4-1.3-23.8-11.9-23.8-11.9-2.2 4.2-5.2 8.7-9.2 13.5l-.3.4-1.7 2c-.9 1.1-2 2.6-3.4 4.5-.4.6-.9 1.3-1.4 2l98.2.1z\"></path>\n" +
    "                        <path fill=\"#FFCC80\" d=\"M36.3 119.3s.1-.2.2-.3c-.1.1-.2.2-.2.3z\"></path>\n" +
    "                    </g>\n" +
    "                </svg>\n" +
    "            </core-icon>\n" +
    "            <core-icon class=\"avatar\" icon=\"avatars:avatar-3\" aria-label=\"avatar-2\" role=\"img\">\n" +
    "                <svg viewBox=\"0 0 128 128\" height=\"100%\" width=\"100%\"\n" +
    "                     preserveAspectRatio=\"xMidYMid meet\" fit=\"\"\n" +
    "                     style=\"pointer-events: none; display: block;\">\n" +
    "                    <g>\n" +
    "                        <path fill=\"#B9F6CA\" d=\"M0 0h128v128h-128z\"></path>\n" +
    "                        <path fill=\"#FFCC80\"\n" +
    "                              d=\"M70.1 122.5l.6-.1c6.1-.8 12-2.4 17.7-4.8 1.2-.5 2.4-1.1 3.2-2.1 1.3-1.7-.1-5.6-.5-7.7-.7-3.8-1.3-7.7-1.9-11.5-.7-4.5-1.5-9.1-1.6-13.7-.2-7.6.7-12.3 1.9-15.3h9l-2.6-10.4c-.2-2.4-.4-4.8-.7-6.8-.2-1.9-.6-3.6-1.2-5.3-14.9 2.2-24.5.9-30.7-1.8l-23.1 4.5-.7.1h-.7c-.4-.1-.9-.2-1.2-.4-.4 0-.9 0-1.4.1-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1 5.8 5.9 8.4 13.8 7.4 22-.6 4.7-2.2 9.4-4.4 13.6-.5 1-1 1.6-1.1 2.8-.1 1.1-.1 2.3.1 3.4.4 2.3 1.5 4.4 3 6.2 2.6 3.1 6.4 5 10.4 5.8 3.8.4 7.6.3 11.4-.1zm9.5-67.6c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6c-.1-.8.7-1.6 1.6-1.6zM128 97.7c-3.3 1.9-6.6 3.7-9.9 5.3-3.2 1.5-6.3 2.9-9.6 4.2-.9.4-2.1.5-2.9 1.1-1.1.8-1.9 2.5-2.3 3.7-.6 1.6-.6 3.4.3 4.8.8 1.2 2.1 2 3.5 2.6 5.9 2.9 12.2 5.1 18.6 6.5 1.4.3 2.3 1.8 2.4.1v-28.1c-.1.1-.1-.1-.1-.2z\"></path>\n" +
    "                        <path d=\"M38.9 47.4zM39.6 47.4z\" fill=\"none\"></path>\n" +
    "                        <path fill=\"#444\"\n" +
    "                              d=\"M94.2 44.9c-.8-2.6-1.8-5-3.2-7.2l-7.2 1.4-20.4 4c6.3 2.7 15.9 4 30.8 1.8z\"></path>\n" +
    "                        <path fill=\"#E65100\"\n" +
    "                              d=\"M38.9 48.4h.7c.2 0 .5 0 .7-.1l23.1-4.5 20.4-4 23.3-4.5c1.9-.4 3.2-2 2.9-3.6-.3-1.6-2.1-2.6-4.1-2.3l-19.6 3.8-1.3-6.8c-2-10.9-15-17.7-29.1-14.9-14 2.7-23.7 13.9-21.6 24.9h.1l1.7 9v.7c.2.8.7 1.4 1.4 1.9.5.1 1 .3 1.4.4z\"></path>\n" +
    "                        <circle fill=\"#444\" cx=\"79.6\" cy=\"56.5\" r=\"2\"></circle>\n" +
    "                        <path fill=\"#689F38\"\n" +
    "                              d=\"M128 128v-1.8l-21.7-18.2-.4.2-2.9 1.3c-3 1.3-6 2.6-9.2 3.8l-1.4.5c-9 3.3-16.5 4.1-22.8 3.6-16.4-1.3-23.8-11.9-23.8-11.9-2.2 4.2-5.2 8.7-9.2 13.5l-.3.4-1.7 2c-.9 1.1-2 2.6-3.4 4.5-.4.6-.9 1.3-1.4 2l98.2.1z\"></path>\n" +
    "                        <path fill=\"#FFCC80\" d=\"M36.3 119.3s.1-.2.2-.3c-.1.1-.2.2-.2.3z\"></path>\n" +
    "                    </g>\n" +
    "                </svg>\n" +
    "            </core-icon>\n" +
    "            <core-icon class=\"avatar\" icon=\"avatars:avatar-4\" aria-label=\"avatar-2\" role=\"img\">\n" +
    "                <svg viewBox=\"0 0 128 128\" height=\"100%\" width=\"100%\"\n" +
    "                     preserveAspectRatio=\"xMidYMid meet\" fit=\"\"\n" +
    "                     style=\"pointer-events: none; display: block;\">\n" +
    "                    <g>\n" +
    "                        <path fill=\"#B9F6CA\" d=\"M0 0h128v128h-128z\"></path>\n" +
    "                        <path fill=\"#FFCC80\"\n" +
    "                              d=\"M70.1 122.5l.6-.1c6.1-.8 12-2.4 17.7-4.8 1.2-.5 2.4-1.1 3.2-2.1 1.3-1.7-.1-5.6-.5-7.7-.7-3.8-1.3-7.7-1.9-11.5-.7-4.5-1.5-9.1-1.6-13.7-.2-7.6.7-12.3 1.9-15.3h9l-2.6-10.4c-.2-2.4-.4-4.8-.7-6.8-.2-1.9-.6-3.6-1.2-5.3-14.9 2.2-24.5.9-30.7-1.8l-23.1 4.5-.7.1h-.7c-.4-.1-.9-.2-1.2-.4-.4 0-.9 0-1.4.1-4.1.6-6.9 4.7-6.3 9.1.3 2 1.2 3.8 2.6 5 .3.1 1.6.7 3.4 1.7.8.4 1.6 1 2.5 1.6 1.5 1.1 3.2 2.5 4.9 4.1 5.8 5.9 8.4 13.8 7.4 22-.6 4.7-2.2 9.4-4.4 13.6-.5 1-1 1.6-1.1 2.8-.1 1.1-.1 2.3.1 3.4.4 2.3 1.5 4.4 3 6.2 2.6 3.1 6.4 5 10.4 5.8 3.8.4 7.6.3 11.4-.1zm9.5-67.6c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6s-1.6-.7-1.6-1.6c-.1-.8.7-1.6 1.6-1.6zM128 97.7c-3.3 1.9-6.6 3.7-9.9 5.3-3.2 1.5-6.3 2.9-9.6 4.2-.9.4-2.1.5-2.9 1.1-1.1.8-1.9 2.5-2.3 3.7-.6 1.6-.6 3.4.3 4.8.8 1.2 2.1 2 3.5 2.6 5.9 2.9 12.2 5.1 18.6 6.5 1.4.3 2.3 1.8 2.4.1v-28.1c-.1.1-.1-.1-.1-.2z\"></path>\n" +
    "                        <path d=\"M38.9 47.4zM39.6 47.4z\" fill=\"none\"></path>\n" +
    "                        <path fill=\"#444\"\n" +
    "                              d=\"M94.2 44.9c-.8-2.6-1.8-5-3.2-7.2l-7.2 1.4-20.4 4c6.3 2.7 15.9 4 30.8 1.8z\"></path>\n" +
    "                        <path fill=\"#E65100\"\n" +
    "                              d=\"M38.9 48.4h.7c.2 0 .5 0 .7-.1l23.1-4.5 20.4-4 23.3-4.5c1.9-.4 3.2-2 2.9-3.6-.3-1.6-2.1-2.6-4.1-2.3l-19.6 3.8-1.3-6.8c-2-10.9-15-17.7-29.1-14.9-14 2.7-23.7 13.9-21.6 24.9h.1l1.7 9v.7c.2.8.7 1.4 1.4 1.9.5.1 1 .3 1.4.4z\"></path>\n" +
    "                        <circle fill=\"#444\" cx=\"79.6\" cy=\"56.5\" r=\"2\"></circle>\n" +
    "                        <path fill=\"#689F38\"\n" +
    "                              d=\"M128 128v-1.8l-21.7-18.2-.4.2-2.9 1.3c-3 1.3-6 2.6-9.2 3.8l-1.4.5c-9 3.3-16.5 4.1-22.8 3.6-16.4-1.3-23.8-11.9-23.8-11.9-2.2 4.2-5.2 8.7-9.2 13.5l-.3.4-1.7 2c-.9 1.1-2 2.6-3.4 4.5-.4.6-.9 1.3-1.4 2l98.2.1z\"></path>\n" +
    "                        <path fill=\"#FFCC80\" d=\"M36.3 119.3s.1-.2.2-.3c-.1.1-.2.2-.2.3z\"></path>\n" +
    "                    </g>\n" +
    "                </svg>\n" +
    "            </core-icon>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div id=\"fileTree\" class=\"sidebar\">\n" +
    "\n" +
    "            <ul style=\"margin-left: -20px;list-style: none;\">\n" +
    "                <li>\n" +
    "                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                    2014\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                    2013\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                    2012\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                    2011\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <core-icon icon=\"folder\"></core-icon>\n" +
    "                    Social\n" +
    "                    <ul style=\"margin-left: -20px;list-style: none;\">\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            Facebook\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                            Flickr\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"tagCloud\">\n" +
    "            <div\n" +
    "                    style=\"width:100%;background-color:#FFFFFF;font-family:Arial; border: 1px solid #FFFFFF; text-align:center;\">\n" +
    "                <div style=\"padding:5px;\">\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:12px;text-decoration:none; color: #87A800;\">Landscape</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:16px;text-decoration:none; color: #FF7600;\">kids</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:19px;text-decoration:none; color: #87A800;\">Hailey</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:16px;text-decoration:none; color: #039FAF;\">Kayden</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:14px;text-decoration:none; color: #039FAF;\">mike</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:16px;text-decoration:none; color: #DE2159;\">Angie</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:12px;text-decoration:none; color: #DE2159;\">Vacation</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:12px;text-decoration:none; color: #87A800;\">Work</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:16px;text-decoration:none; color: #FF7600;\">Baseball</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:19px;text-decoration:none; color: #87A800;\">Birthday</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:16px;text-decoration:none; color: #039FAF;\">School</a>\n" +
    "                    <a href=\"\"\n" +
    "                       style=\"padding:10px;font-size:14px;text-decoration:none; color: #039FAF;\">B&W</a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("apps/dashboard/modules/photos/photos.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/photos/photos.tpl.html",
    "\n" +
    "<div class=\".photoTemplate\">\n" +
    "\n" +
    "<!-- MAIN -->\n" +
    "<div flex style=\"float:left; width: 100%\">\n" +
    "\n" +
    "    <div class=\"folder\">\n" +
    "\n" +
    "        <dam-photo-group id=\"photoList\"\n" +
    "                         label=\"January 2014\"></dam-photo-group>\n" +
    "\n" +
    "        <hr/>\n" +
    "\n" +
    "        <dam-photo-group id=\"photoList2\"\n" +
    "                         label=\"Feb 2014\"></dam-photo-group>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<script>\n" +
    "var photos = [];\n" +
    "var inDetailView = false;\n" +
    "\n" +
    "var shuffle = function (array) {\n" +
    "    var currentIndex = array.length, temporaryValue, randomIndex;\n" +
    "\n" +
    "    // While there remain elements to shuffle...\n" +
    "    while (0 !== currentIndex)\n" +
    "    {\n" +
    "\n" +
    "        // Pick a remaining element...\n" +
    "        randomIndex = Math.floor(Math.random() * currentIndex);\n" +
    "        currentIndex -= 1;\n" +
    "\n" +
    "        // And swap it with the current element.\n" +
    "        temporaryValue = array[currentIndex];\n" +
    "        array[currentIndex] = array[randomIndex];\n" +
    "        array[randomIndex] = temporaryValue;\n" +
    "    }\n" +
    "\n" +
    "    return array;\n" +
    "};\n" +
    "\n" +
    "var toolbarIconHelper = function(){\n" +
    "    if( !inDetailView ){\n" +
    "        window.location.href='index.html';\n" +
    "    }else{\n" +
    "        openLeftDrawer(\"leftDrawer\");\n" +
    "        closeRightDrawer(\"rightDrawer\");\n" +
    "        document.querySelector(\"#photoList\").$.pages.selected = 0;\n" +
    "\n" +
    "        inDetailView = false;\n" +
    "        document.querySelector(\"#primaryToolbarIcon\").icon=\"home\";\n" +
    "    }\n" +
    "}\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "var toggleUploader = function () {\n" +
    "    document.querySelector(\"#uploaderOverlay\").toggle();\n" +
    "};\n" +
    "\n" +
    "\n" +
    "var photoSelectHandler = function (event) {\n" +
    "    console.dir(event.detail);\n" +
    "\n" +
    "    openRightDrawer(\"rightDrawer\");\n" +
    "\n" +
    "    document.querySelector(\"#photoPreview\").style.display = \"block\";\n" +
    "    document.querySelector(\"#photoLightbox\").style.display = \"none\";\n" +
    "};\n" +
    "\n" +
    "\n" +
    "var photoMultiSelectHandler = function (event) {\n" +
    "    console.dir(event.detail);\n" +
    "\n" +
    "    openRightDrawer(\"rightDrawer\");\n" +
    "\n" +
    "    document.querySelector(\"#photoLightbox\").addPhoto(event.detail);\n" +
    "    if (document.querySelector(\"#photoLightbox\").selectedItems.length == 1)\n" +
    "    {\n" +
    "        document.querySelector(\"#photoPreview\").style.display = \"block\";\n" +
    "        document.querySelector(\"#photoLightbox\").style.display = \"none\";\n" +
    "    } else\n" +
    "    {\n" +
    "        document.querySelector(\"#photoLightbox\").style.display = \"block\";\n" +
    "        document.querySelector(\"#photoPreview\").style.display = \"none\";\n" +
    "    }\n" +
    "\n" +
    "};\n" +
    "\n" +
    "var photoDeselectHandler = function (event) {\n" +
    "    console.dir(event.detail);\n" +
    "\n" +
    "    closeRightDrawer(\"rightDrawer\");\n" +
    "    inDetailView = false;\n" +
    "    document.querySelector(\"#primaryToolbarIcon\").icon=\"home\";\n" +
    "};\n" +
    "\n" +
    "var photoHardSelectHandler = function (event) {\n" +
    "    console.dir(event.detail);\n" +
    "\n" +
    "\n" +
    "    openRightDrawer(\"rightDrawer\");\n" +
    "    closeLeftDrawer(\"leftDrawer\");\n" +
    "\n" +
    "    inDetailView = true;\n" +
    "    document.querySelector(\"#primaryToolbarIcon\").icon=\"arrow-back\";\n" +
    "    //document.querySelector(\"#photoList\").unselectOthers(event.detail);\n" +
    "    //document.querySelector(\"#photoLightbox\").removeOthers(event.detail);\n" +
    "\n" +
    "    //document.querySelector(\"#photoDetails\").model = event.detail;\n" +
    "    //document.querySelector(\"#photoDetailOverlay\").toggle();\n" +
    "}\n" +
    "\n" +
    "</script>\n" +
    "");
}]);

angular.module("apps/dashboard/modules/photos/right-drawer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/photos/right-drawer.tpl.html",
    "\n" +
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
    "<div>\n" +
    "\n" +
    "\n" +
    "    <div id=\"content\" style=\"background-color: #fff; position: absolute; width: 256px;\">\n" +
    "        <dam-photo-lightbox id=\"photoLightbox\" style=\"display: none\"></dam-photo-lightbox>\n" +
    "        <preview-photo id=\"photoPreview\" style=\"display: none\"></preview-photo>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("apps/dashboard/modules/uploader/left-drawer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/uploader/left-drawer.tpl.html",
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
    "<!-- LEFT DRAWER -->\n" +
    "<div>\n" +
    "    TODO - Left Drawer\n" +
    "</div>\n" +
    "");
}]);

angular.module("apps/dashboard/modules/uploader/right-drawer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/uploader/right-drawer.tpl.html",
    "\n" +
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
    "<div>\n" +
    "    TODO - Right Drawer\n" +
    "</div>");
}]);

angular.module("apps/dashboard/modules/uploader/uploader.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/uploader/uploader.tpl.html",
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
    "<div class=\".uploaderBody\">\n" +
    "\n" +
    "    <!-- MAIN -->\n" +
    "    <div flex style=\"float:left; width: 100%\">\n" +
    "\n" +
    "        <div id=\"copyFilesBody\">\n" +
    "\n" +
    "            <!--\n" +
    "            <h2>Folders:</h2>\n" +
    "            <core-list>\n" +
    "                <div layout horizontal style=\"border-bottom: 1px solid #d3d3d3;\">\n" +
    "                    <div>\n" +
    "                        <core-icon-button icon=\"close\"></core-icon-button>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <core-icon-button icon=\"backup\"></core-icon-button>\n" +
    "                    </div>\n" +
    "                    <div flex>\n" +
    "                        /Users/mnimer/Pictures/2011<br/>\n" +
    "                        <paper-progress value=\"23\" secondaryProgesss=\"30\"></paper-progress>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <core-field>\n" +
    "                            <paper-toggle-button checked=\"true\"></paper-toggle-button>\n" +
    "                            <label style=\"left:5px;position:relative;\">Recusive </label>\n" +
    "                        </core-field>\n" +
    "                        <core-field>\n" +
    "                            <paper-toggle-button checked=\"true\"></paper-toggle-button>\n" +
    "                            <label style=\"left:5px;position:relative;\">Maintain Folder Structure </label>\n" +
    "                        </core-field>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </core-list>\n" +
    "            -->\n" +
    "\n" +
    "\n" +
    "            <h2>Files:</h2>\n" +
    "            <core-list>\n" +
    "                <div layout horizontal center style=\"border-bottom: 1px solid #d3d3d3;\"  ng-repeat='file in fileList'>\n" +
    "                    <div ng-if=\"file.isDirectory\">\n" +
    "                        <span class=\"fileType\">[DIR]</span>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"!file.isDirectory\">\n" +
    "                        <div ng-switch on=\"file.extension\">\n" +
    "                            <span ng-switch-when=\"jpg\">\n" +
    "                                <img src=\"{{file.path}}\" style=\"max-width: 100px\"/>\n" +
    "                            </span>\n" +
    "                            <span ng-switch-when=\"gif\">\n" +
    "                                <img src=\"{{file.path}}\" style=\"max-width: 100px\"/>\n" +
    "                            </span>\n" +
    "                            <span ng-switch-when=\"png\">\n" +
    "                                <img src=\"{{file.path}}\" style=\"max-width: 100px\"/>\n" +
    "                            </span>\n" +
    "                            <span ng-switch-when=\"mp4\">\n" +
    "                                <video controls style=\"min-height: 100px\">\n" +
    "                                    <source src=\"{{file.path}}\" type=\"video/mp4\">\n" +
    "                                    [VIDEO]\n" +
    "                                </video>\n" +
    "                            </span>\n" +
    "                            <span ng-switch-when=\"mov\">\n" +
    "                                <video controls style=\"max-width: 100px\">\n" +
    "                                    <source src=\"{{file.path}}\" type=\"video/mp4\">\n" +
    "                                    [VIDEO]\n" +
    "                                </video>\n" +
    "                            </span>\n" +
    "                            <span ng-switch-when=\"mp3\">\n" +
    "                                <audio controls>\n" +
    "                                    <source src=\"{{file.path}}\" type=\"audio/mpeg\" style=\"max-width: 100px\">\n" +
    "                                    [AUDIO]\n" +
    "                                </audio>\n" +
    "                            </span>\n" +
    "                            <span ng-switch-default>[UNKNOWN]</span>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div flex self-center style=\"padding-left:20px;\">\n" +
    "                        <span class=\"fileUploadPath\">{{file.path}}</span>\n" +
    "                        <paper-progress value=\"23\" secondaryProgesss=\"30\" style=\"display:none\"></paper-progress>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <span class=\"fileSize\">{{file.size/1000}}kb</span>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <core-icon-button icon=\"upload\"\n" +
    "                                          ng-click=\"uploadFile(file)\"\n" +
    "                                          upload-file-button></core-icon-button>\n" +
    "                        <core-icon-button icon=\"close\"\n" +
    "                                        ng-click=\"removeFile(file)\"></core-icon-button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </core-list>\n" +
    "\n" +
    "            <div id=\"testElementsToDelete\" style=\"display: none\">\n" +
    "                <h2>Test Dialog</h2>\n" +
    "                <input type=\"text\" id=\"file\">\n" +
    "                <button on-click=\"{{openDialog}}\">Open Dialog Test</button>\n" +
    "                <button on-click=\"{{chooseFile}}\">Choose File test</button>\n" +
    "                <br/><br/>\n" +
    "                <input id=\"fileDialog\" type=\"file\"/>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div></div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);
