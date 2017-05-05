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

switch (app_env) {
    case 'development':
        conf.sample = 'xxxx';
        break;
    case 'staging':
        conf.sample = 'xxxx';
        break;
    case 'production':
        conf.sample = 'xxxx';
        break;
    case 'local':
    default:
        conf.sample = 'xxxx';
}

module.exports = conf;
