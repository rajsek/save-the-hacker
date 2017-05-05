
/***
 * React Intl uses and builds on the Internationalization API built-in to JavaScript.
 * This is a plyfill for browsers that dont support this API natively
 * As far as we know, Browsers that does not support this API include Safari, IE 10 and below
 * Note: Due to this polyfil we need to require all the lacale files manually. Like we did for en.js
 */
import { addLocaleData } from 'react-intl';
import conf from '../conf';
// associative array containing all translation strings
// Example structure:
// {
//   'en_US': {
//     "string_a": "translation_a",
//     ...
//   },
//   ...
// }
export const messages = {};
export const defaultLocale = conf.i18n.default_lang;
/**
* Returns a language code consisting of 2 lowercase letters
* as must be provided to IntlProvider of react-intl package.
*
* @param {string} localeCode
* In the form 'languagecode_COUNTRYCODE' (ISO 639 language code + ISO 3166 country code).
* E.g. 'en_US', 'tg_PH', etc.
*
* @return {string}
* E.g.: 'en_US' => 'en', 'ms_MY' => 'ms', etc.
*/

export const getReactLanguageCode = (localeCode) => {
    return localeCode.split('_')[0].toLowerCase();
};
// load all translation strings and locale support modules (from react-intl)
conf.i18n.langs.map(language => {
    const languageCode = getReactLanguageCode(language);
    if(languageCode === 'en') {
        addLocaleData( require('react-intl/locale-data/en') );
        messages[language] = require('locales/en_US.json');
    } else if(languageCode === 'ar') {
        addLocaleData( require('react-intl/locale-data/ar') )
        messages[language] = require('locales/ar_AR.json');
    }
});
