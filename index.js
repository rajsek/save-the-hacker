'use strict'

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var logger = require('./logger');
var cors = require('cors');
var i18n = require('i18n');
var url = require('url');
var models = require('./models');
var requestIp = require('request-ip');
var maxmind = require('maxmind');
var countryLookup = maxmind.openSync('./data/GeoLite2-Country.mmdb');

require('dotenv').config({
    path: __dirname + '/.env'
});

var isLocalDev = (process.env.APP_ENV === 'local' && process.env.NODE_ENV === 'local');
var port = process.env.PORT || 9000;

logger.log('debug', 'Starting up');
// dotenv, must be loaded first
logger.log('debug', 'Getting the environment');
var environment = process.argv[2]
    ? process
        .argv[2]
        .toLowerCase()
        .substring(2)
    : 'dev';

logger.log('info', 'Loading dotenv with env = ' + process.env.APP_ENV);

logger.log('verbose', 'App env: ', process.env);

// configure the app
logger.log('debug', 'Loading configuration file app.js');
var config = require('./configure');
logger.log('verbose', 'App configuration: ', config);

// i18n setup
logger.log('debug', 'Configuring i18n');
i18n.configure({
    locales: config.i18n.lang,
    directory: __dirname + '/public/locales',
    defaultLocale: config.i18n.default_lang
});

logger.log('debug', 'Registering custom functions for Handlebars');
var hbs = expressHbs.create({
    extname: 'hbs',
    helpers: {
        i18n: function (text) {
            return i18n.__(text);
        }
    }
});

// view engine setup
logger.log('debug', 'Loading handlebars template engine');

logger.log('debug', 'Loading routes file index.js');
var routes = require('./routes/api');

logger.log('debug', 'Creating the app');
var app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(session({
    secret: 'ooredoo#',
    path: '/api',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}));

// misc. configuration
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
app.use(cookieParser());
app.use(cors());
app.enable('trust proxy');

logger.log('debug', 'Mounting routes on /');
app.use('/api', routes);

//build server for local testing
if (process.env.APP_ENV === 'local' && process.env.NODE_ENV === 'production') {
    let compression = require('compression');
    app.use(compression());

    logger.log('info', 'Running local build server');
}

app.use('/assets/media', express.static(path.resolve(__dirname, 'public/assets/media')));
app.use('/assets/img', express.static(path.resolve(__dirname, 'public/assets/img')));

if (isLocalDev) { //webpack for local development
    const webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpack_config = require('./webpack.config.js'),
        compiler = webpack(webpack_config),
        indexFile = path.resolve(webpack_config.output.path, 'index.hbs')

    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpack_config.output.publicPath,
        inline: true,
        stats: 'minimal'
    }));

    app.use(webpackHotMiddleware(compiler));

    app.get('*', (req, res, next) => {
        compiler
            .outputFileSystem
            .readFile(indexFile, (error, result) => {
                if (error) {
                    return next(error);
                }

                res.set('content-type', 'text/html');
                res.send(result);
                res.end();
            })
    });
} else {
    //other envs
    let BUILD_DIR = path.resolve(__dirname, 'public/build');
    app.use(express.static(BUILD_DIR));

    app.get('*', (req, res, next) => {
        var location = countryLookup.get(requestIp.getClientIp(req));
        app.set('views', __dirname + '/public/build');

        var host = req.headers.host;
        var context = {};
        context.defaultLocale = 'en_US';
        context.isShowLangSwitch = true;

        context.package_country = (location != null && config.countries.indexOf(location.country.iso_code) > -1)
            ? location.country.iso_code
            : config.default_country;

        context.app_env = process.env.APP_ENV;

        res.render('index', context);
    });
}

// launch the server
logger.log('debug', 'Getting server port and ip address information');

app.listen(port, (error) => {
    if (error) 
        logger.log('error', error);
    
    logger.log('info', 'Starting express server with port ' + port);
})
