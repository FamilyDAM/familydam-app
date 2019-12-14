// translationRunner.js
// https://github.com/GertjanReynaert/react-intl-translations-manager
const manageTranslations = require('react-intl-translations-manager').default;

// es2015 import
// import manageTranslations from 'react-intl-translations-manager';

manageTranslations({
    messagesDirectory: 'src/i18n/messages',
    translationsDirectory: 'src/i18n/locales/',
    languages: ['en-EN'], // any language you need
});