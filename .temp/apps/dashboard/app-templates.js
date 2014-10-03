angular.module('dashboard.templates', ['apps/dashboard/modules/files/files.tpl.html', 'apps/dashboard/modules/home/home.tpl.html', 'apps/dashboard/modules/login/login.tpl.html']);

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
    "                                        <span>\n" +
    "                                            <core-icon icon=\"folder\"></core-icon>\n" +
    "                                        </span>\n" +
    "                                        <span class=\"\">\n" +
    "                                            <span class=\"folderName\">{{name}}</span>\n" +
    "                                        </span>\n" +
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
    "\n" +
    "    <style shim-shadowdom>\n" +
    "\n" +
    "        core-scroll-header-panel {\n" +
    "            position: absolute;\n" +
    "            top: 0;\n" +
    "            right: 0;\n" +
    "            bottom: 0;\n" +
    "            left: 0;\n" +
    "            background-color: #FFF;\n" +
    "        }\n" +
    "\n" +
    "        /* background for toolbar when it is at its full size */\n" +
    "        core-scroll-header-panel::shadow #headerBg {\n" +
    "            background-color: #0000ff;\n" +
    "        }\n" +
    "\n" +
    "        /* background for toolbar when it is condensed */\n" +
    "        core-scroll-header-panel::shadow #condensedHeaderBg {\n" +
    "            background-color: #0000ff;\n" +
    "        }\n" +
    "\n" +
    "        core-toolbar {\n" +
    "            color: #f1f1f1;\n" +
    "            fill: #f1f1f1;\n" +
    "            background-color: transparent;\n" +
    "        }\n" +
    "\n" +
    "        core-toolbar paper-fab {\n" +
    "            top: 30px;\n" +
    "            right: 30px;\n" +
    "            position: absolute;\n" +
    "        }\n" +
    "\n" +
    "        core-toolbar paper-tabs{\n" +
    "            width:150px;\n" +
    "        }\n" +
    "\n" +
    "        .title {\n" +
    "            -webkit-transform-origin: 0;\n" +
    "            transform-origin: 0;\n" +
    "            font-size: 40px;\n" +
    "        }\n" +
    "\n" +
    "        .content {\n" +
    "            padding: 10px 30px;\n" +
    "            background-color: #fff;;\n" +
    "        }\n" +
    "\n" +
    "    </style>\n" +
    "\n" +
    "</head>\n" +
    "<body unresolved >\n" +
    "\n" +
    "<core-scroll-header-panel condensedHeaderHeight=\"65\" >\n" +
    "\n" +
    "    <core-toolbar  class=\"medium-tall\">\n" +
    "\n" +
    "        <core-icon-button icon=\"arrow-back\" onclick=\"window.location.href='index.html';\"></core-icon-button>\n" +
    "        <div flex></div>\n" +
    "        <paper-tabs style=\"min-width: 150px;\">\n" +
    "            <paper-tab ui-sref=\"files\">Files</paper-tab>\n" +
    "            <paper-tab ui-sref=\"photos\">Photos</paper-tab>\n" +
    "        </paper-tabs>\n" +
    "        <core-icon-button icon=\"search\"></core-icon-button>\n" +
    "        <core-icon-button icon=\"more-vert\"></core-icon-button>\n" +
    "        <div class=\"middle indent title\">Home</div>\n" +
    "    </core-toolbar>\n" +
    "\n" +
    "    <div class=\"content\">\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</core-scroll-header-panel>\n" +
    "\n" +
    "<script>\n" +
    "\n" +
    "    // custom transformation: scale header's title\n" +
    "    var titleStyle = document.querySelector('.title').style;\n" +
    "    addEventListener('core-header-transform', function(e) {\n" +
    "        var d = e.detail;\n" +
    "        var m = d.height - d.condensedHeight;\n" +
    "        var scale = Math.max(0.75, (m - d.y) / (m / 0.25)  + 0.75);\n" +
    "        titleStyle.webkitTransform = titleStyle.transform =\n" +
    "                'scale(' + scale + ') translateZ(0)';\n" +
    "    });\n" +
    "\n" +
    "</script>\n" +
    "");
}]);

angular.module("apps/dashboard/modules/login/login.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("apps/dashboard/modules/login/login.tpl.html",
    "<link rel=\"import\" href=\"modules/login/components/login-users/login-users.html\"/>\n" +
    "\n" +
    "<div class=\"header\">\n" +
    "    <div class=\"timestamp\">{{nowTimestamp|date:'h:mm:ss a'}}</div>\n" +
    "</div>\n" +
    "\n" +
    "<login-users\n" +
    "        id=\"loginUsersList\"\n" +
    "        users=\"{{users}}\"\n" +
    "        validationMessage=\"{{validationErrorMessage}}\"\n" +
    "        login-event-bridge></login-users>\n" +
    "");
}]);
