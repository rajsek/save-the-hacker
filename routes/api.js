'use strict'
var express = require('express');
var router = express.Router();
var i18n = require('i18n');

var requestIp = require('request-ip');
// var models = require('../models');
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

/**
 * Save or Update the user detail after FB Connect
 * sample input(idFB,firstName,lastName)
 * sample output ({ status: true })
 */
router.post('/saveUser', function (req, res) {
    const idFB = req.body.idFB;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (!lastName || !firstName || !idFB) {
        return res.status(500).json({ code: 'MANDATORY_FIELD_MISSING' });
    }

    var User = require('../models/users');
    return User.findOneAndUpdate({ id_fb: idFB }, {
        id_fb: idFB,
        first_name: firstName,
        last_name: lastName
    }, { upsert: true, new: true }, (err, data) => {
        if (err)
            return res.status(500).json({ code: "ERROR", err })
        return res.send({ status: true })
    })
});
/**
 * Save the game complete status of user based on user id
 * sample input(userId,idChallenge,continent,isWon)
 * sample output ({ status: true })
 */
router.post('/saveChallenge', function (req, res) {
    const userId = req.body.userId;
    const idChallenge = req.body.idChallenge;
    const continent = req.body.continent;
    const isWon = req.body.isWon ? true : false;

    if (!userId || !idChallenge || !continent) {
        return res.status(500).json({ code: 'MANDATORY_FIELD_MISSING' });
    }

    var UserChallenges = require('../models/users_challenges');
    var User = require('../models/users');

    User.find({ id_user: userId }, (err, data) => {
        if (!data || err) {
            return res.status(500).json({ code: "ERROR", err: err, data: data })
        }
        let userChallenges = new UserChallenges({
            id_user: data.id,
            id_chellenge: idChallenge,
            continent: continent,
            is_won: isWon
        })
        return userChallenges.save(err => {
            if (err)
                return res.status(500).json({ code: "ERROR", err })
            return res.send({ status: true })
        });
    })
});
/**
 * Send the Uniq game which already play by the user
 * sample input(userId)
 * sample output ({"gamePlayed":[1,2]})
 */
router.get('/getChallenge', function (req, res) {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(500).json({ code: 'USER_ID_MISSING' });
    }
    var User = require('../models/users');
    var UserChallenges = require('../models/users_challenges');
    User.find({ id_user: userId }, (err, data) => {
        if (!data || err) {
            return res.status(500).json({ code: "ERROR", err: err, data: data })
        }
        return UserChallenges.find({ id_user: data.id }).distinct('id_chellenge')
            .then((data) => {
                return res.end(JSON.stringify({
                    gamePlayed: data
                }));
            })
    })
});
module.exports = router;
