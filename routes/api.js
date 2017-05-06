'use strict'

var express = require('express');
var router = express.Router();
var i18n = require('i18n');
var requestIp = require('request-ip');
var models = require('../models');
var locales = ['en_US', 'ar_AR', 'ar_TN'];
var default_locale = 'en_US';
var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var config = require('../configure');
var path = require('path');
var streetMapData = require('../streetMapDate.json')
var helper = require('./helper')
// Otherwise, returns the label as is.
function getTranslation(label, locale) {
    var catalog = i18n.getCatalog();

    if (catalog[locale] !== undefined && catalog[locale][label] !== undefined) {
        return catalog[locale][label];
    } else {
        return label;
    }
}

//Return the Error message in JSON format
function newErrResponse(errCode, locale) {
    return JSON.stringify({
        success: false,
        errCode: errCode, // raw error code, corresponding to one of the UploadError
        msg: getTranslation(errCode, locale), // translated error message
    });
}


router.post('/helloWorld', function (req, res) {
    var locale = default_locale;

    if (req.body.locale !== undefined && locales.indexOf(req.body.locale) > -1) {
        locale = req.body.locale;
    }
    return res.end(JSON.stringify({
        success: true
    }));
});
router.get('/getStreetMap', function (req, res) {
    var locale = default_locale;

    if (req.body.locale !== undefined && locales.indexOf(req.body.locale) > -1) {
        locale = req.body.locale;
    }
    const streetMapArray = streetMapData.streetViews;
    const randomNumber = helper.random(0, streetMapArray.length)
    return res.end(JSON.stringify({
        success: true,
        streetMap: streetMapArray[randomNumber]
    }));
});

module.exports = router;
