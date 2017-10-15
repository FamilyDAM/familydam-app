"use strict";

const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;

ipcRenderer.on('splashMessage', function(event, status)
    {
        console.log(status.message);
        document.getElementById("message").innerHTML = status.message;
    }
);



document.addEventListener("keydown", function (e) {
    if (e.which === 123) {
        remote.getCurrentWindow().toggleDevTools();
    } else if (e.which === 116) {
        location.reload();
    }
});
