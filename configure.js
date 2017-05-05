'use strict'

require('dotenv').config({path: __dirname + '/.env', silent: true})

var config = {};

switch(process.env.APP_ENV) {
    case 'production':
        config = {
            sampleKey: 'xxx',
            sampleSecret: 'yyy'
        }
    break;
    case 'staging':
        config = {
            sampleKey: 'xxx',
            sampleSecret: 'yyy'
        }
    break;
    case 'development':
        config = {
            sampleKey: 'xxx',
            sampleSecret: 'yyy'
        }
    break;
    case 'local':
       config = {
            sampleKey: 'xxx',
            sampleSecret: 'yyy'
       }
    break;
}

config.port = process.env.PORT || 9000;
config.logLevel = process.env.LOG_LEVEL || 'verbose';
config.url = process.env.APP_URL;
config.i18n = {lang: ['en_US', 'ar_AR'], default_lang: 'en_US'}
module.exports = config;
