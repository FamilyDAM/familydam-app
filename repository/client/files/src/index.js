import React from 'react';
import ReactDOM from 'react-dom';
import {addLocaleData} from 'react-intl';
import registerServiceWorker from './registerServiceWorker';

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
//@see https://www.materialpalette.com
import deepPurple from '@material-ui/core/colors/deepPurple';
import indigo from '@material-ui/core/colors/indigo';
import red from '@material-ui/core/colors/red';
import './index.css';

import App from './App';

/**
 * Setup i18n/Localization formats & messages
 */
addLocaleData(require('react-intl/locale-data/en'));
const i18nMessages = {
    "en-EN": require('./i18n/locales/en-EN.json')
};


/**
 * Setup Material-Ui Theme
 */
const theme = createMuiTheme({
    palette: {
        type: 'light', // Switching the dark mode on is a single property value change.
        primary: deepPurple, // Purple and green play nicely together.
        secondary: {
            ...indigo
        },
        error: red
    }
});


const renderApp = function () {
    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <App i18nMessages={i18nMessages}/>
        </MuiThemeProvider>
        , document.getElementById('root'));
};

renderApp();
registerServiceWorker();


/**
function sendMessage(message) {
    // This wraps the message posting/response in a promise, which will resolve if the response doesn't
    // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
    // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
    // a convenient wrapper.
    return new Promise(function (resolve, reject) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function (event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        // This sends the message data as well as transferring messageChannel.port2 to the service worker.
        // The service worker can then use the transferred port to reply via postMessage(), which
        // will in turn trigger the onmessage handler on messageChannel.port1.
        // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
        navigator.serviceWorker.controller.postMessage(message,
            [messageChannel.port2]);
    });
}

if ('serviceWorker' in navigator) {
    // Set up a listener for messages posted from the service worker.
    // The service worker is set to post a message to all its clients once it's run its activation
    // handler and taken control of the page, so you should see this message event fire once.
    // You can force it to fire again by visiting this page in an Incognito window.
    navigator.serviceWorker.addEventListener('message', function(event) {
        console.log(event.data);
    });

    navigator.serviceWorker.register('service-worker.js')
    // Wait until the service worker is active.
        .then(function() {
            return navigator.serviceWorker.ready;
        })
        // ...and then show the interface for the commands once it's ready.
        //.then(showCommands)
        .catch(function(error) {
            // Something went wrong during registration. The service-worker.js file
            // might be unavailable or contain a syntax error.
            console.log(error);
        });
} else {
    console.log('This browser does not support service workers.');
}

setTimeout(function(){
    sendMessage({
        command: 'test',
        data: "test message to save"
        })
        .then(function () {
            debugger;
            // If the promise resolves, just display a success message.
            console.log('Test Message saved in cache');
        })
        .catch(function (err) {
            debugger;
            // If the promise resolves, just display a success message.
            console.log(err)
        });
}, 1000);
 **/