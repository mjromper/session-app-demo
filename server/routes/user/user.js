var express = require('express');
var router = express.Router();
var USER_LIST = require('../../utils/userlist');
var generateId = require('../../utils/generateId');
var config = require('../../../config');

var postSession = require('./session');
var sense = require('../../sense');

router.get('/', function(req, res, next) {
    res.send('Missing userid')
});


router.get('/create/:userid', function(req, res, next) {

    console.log("creating session app");
    var sessionId = req.cookies[config.cookieName];
    console.log("session", sessionId);
    console.log("userId", req.params.userid);

    sense.generateSessionApp( sessionId, req.params.userid ).then( function( result ) {
        console.log("generateSessionApp", result);
        //res.cookie(config.cookieName, sessionId, { expires: 0, httpOnly: true, path: '/' });
        console.log('cookie set successfully', config.cookieName, sessionId);
        //console.log('closing underlying session');
        //result.qix.global.session.close();
        res.json( {
            config: {
                host: config.senseHost,
                identity: result.identity,
                isSecure: config.isSecure,
                prefix: "/"+config.prefix+"/"
            },
            user: USER_LIST.filter(function(d) { return d.id === req.params.userid; }),
            objectid: ['dataobject', 'listobject'],
            appId: null
        } );
    })
    .catch( function(err) {
        console.log("err", err);
    });
});

router.get('/createfromapp/:userid', function(req, res, next) {

    if ( USER_LIST.map(function(d) { return d.id; }).indexOf(req.params.userid) === -1 ) {
        res.status(403).send('Not a valid user').end();
    };

    var sessionId = req.cookies[config.cookieName],
        appTemplateId = config.template;
    sense.generateSessionAppFromApp( sessionId, appTemplateId, req.params.userid ).then( function( result )  {
        console.log("generateSessionAppFromApp", result);
        //console.log('closing underlying session');
        //result.qix.global.session.close();
        res.json( {
            config: {
                host: config.senseHost,
                identity: result.identity,
                isSecure: config.isSecure,
                prefix: "/"+config.prefix+"/"
            },
            user: USER_LIST.filter(function(d) { return  d.id === req.params.userid; }),
            objectid: ['ueeqaKY'],
            appId: appTemplateId
        } );
    });

});

module.exports = router;