import React from "react";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import {format, parseISO} from 'date-fns'

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            "en-US": { translation: require('./locales/en-US/translation.json') },
            "en-GB": { translation: require('./locales/en-GB/translation.json') },
            "zh-CN": { translation: require('./locales/zh-CN/translation.json') }
        },
        fallbackLng: "en-US",
        ns: ['translation'],
        interpolation: {
            escapeValue: false,
            format: function(value, pattern, lng) {
                if( value.length > 0 && pattern ) {
                    return format(parseISO(value || ""), pattern);
                }
                return value;
            }
        }
    });

export default i18n;