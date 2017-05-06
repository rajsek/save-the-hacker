'use strict'

require('dotenv').config({path: __dirname + '/.env', silent: true})

var config = {};

switch(process.env.APP_ENV) {
    case 'production':
        config = {
            app_id: '124413508110737',
            app_secret: '97b5c84fabead104639608f104618f84'
        }
    break;
    case 'staging':
        config = {
            app_id: '124415364777218',
            app_secret: '3f715405bd3222a80e5bec81213bdaa4'
        }
    break;
    case 'local':
       config = {
            app_id: '124414508110637',
            app_secret: '9ebf9dcb47f4abdd5be3ac3b47f6299d'
       }
    break;
}

config.port = process.env.PORT || 9000;
config.logLevel = process.env.LOG_LEVEL || 'verbose';
config.url = process.env.APP_URL;
config.i18n = {lang: ['en_US', 'ar_AR'], default_lang: 'en_US'}
module.exports = config;
