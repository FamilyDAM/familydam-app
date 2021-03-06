import React from 'react';
import ReactDOM from 'react-dom';
import {addLocaleData} from 'react-intl';
//import registerServiceWorker from './registerServiceWorker';



import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
//@see https://www.materialpalette.com
import deepPurple from 'material-ui/colors/deepPurple';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';
import './index.css';

import App from './App';

/**
 * Setup i18n/Localization formats & messages
 */
addLocaleData(require('react-intl/locale-data/en'));
addLocaleData(require('react-intl/locale-data/de'));
addLocaleData(require('react-intl/locale-data/zh'));
const i18nMessages = {
    "en-EN":require('./i18n/locales/en-EN.json'),
    "de-DE":require('./i18n/locales/de-DE.json'),
    "zh-CN":require('./i18n/locales/zh-CN.json')
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



const renderApp = function(){

    ReactDOM.render(
        <MuiThemeProvider theme={theme}>
            <App i18nMessages={i18nMessages}/>
        </MuiThemeProvider>
        , document.getElementById('root'));

}

renderApp();
//registerServiceWorker();
