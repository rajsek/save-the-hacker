/*
* Don't use ES6 features for this module
* because it is read by Webpack's config
* which doesn't support ES6 out-of-the-box.
*/

const conf = {
    i18n: {
        langs: ['en_US'],
        default_lang: 'en_US',
    },

    routePrefix: {//API route prefix
        api: '/api'
    }
};

module.exports = conf;
