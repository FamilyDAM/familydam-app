console.log("[sw] Startup!");

self.addEventListener('install', function (evt) {
    console.log('[sw] Installed.');
});


self.addEventListener('activate', event => {
    clients.claim();
    console.log('[sw] Activate: Ready!');
});



self.addEventListener('message', async function handler(event) {
    if (event.data.command == "listFiles") {
        console.log("[sw] message:" + event.data.command + " | " + event.data.message);

        var _images = await getImages();
        event.ports[0].postMessage({
            "message": _images
        });
    }


    if (event.data.command == "upload-file") {
        var _file = event.data.file;
        var _props = event.data.message;
        console.log("[sw] message:" + event.data.command + " | " + _file.name + " | " + _file);

        caches.open('file-cache').then((cache) => {
            console.log("[sw] file id = " +_props.id +" | " +_props);

            var formData = new FormData();
            formData.append("id", _props.id);
            formData.append("path", _props.uploadPath);
            formData.append("destination", "/dest");
            formData.append("name", _file.name);
            formData.append("type", _file.type);
            formData.append("size", _file.size);
            formData.append("jcr:primaryType", "nt:file");
            formData.append("dam:date.created", _file.lastModified);
            formData.append("dam:date.modified", _file.lastModified);
            formData.append("file", _file);

            var filePathName = _props.uploadPath;
            if( _file.webkitRelativePath ){
                filePathName += "/" +_file.webkitRelativePath.substr(0, _file.webkitRelativePath.lastIndexOf("/"));
            }else if( _props.relativePath ){
                filePathName += _props.relativePath.substr(0, _props.relativePath.lastIndexOf("/"));
            }

            var req = new Request(filePathName, {
                method:"POST",
                body: formData
            });


            cache.put(req, new Response());
        });
    }
});


self.addEventListener('fetch', function(event) {
    console.log("[sw] fetch");
});


async function getImages() {
    console.log("get images");
    // Get a list of all of the caches for this origin
    const result = [];

    if ( caches.has('file-cache')) {
        console.log("cache found");
        const cache = await caches.open('file-cache');

        // Get a list of entries. Each item is a Request object
        for (const request of await cache.keys()) {
            // If the request URL matches, add the response to the result
            result.push(request.url);//await cache.match(request.body.name));
        }
    }

    return result;
}