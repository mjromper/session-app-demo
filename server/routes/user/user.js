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
            objectid: ['dataobject', 'listobject']
        } );
    })
    .catch( function(err) {
        console.log("err", err);
    });
});

router.get('/create/:userid/:appid', function(req, res, next) {

    if ( USER_LIST.map(function(d) { return d.id; }).indexOf(req.params.userid) === -1 ) {
        res.status(403).send('Not a valid user').end();
    };

    var sessionId = generateId();

    postSession( req.params.userid, sessionId )
    .then( function( response ) {
        var newSession = JSON.parse(response);
        console.log("SessionId - > ", newSession.SessionId);
        return sense.generateSessionAppFromApp( newSession.SessionId, req.params.appid, req.params.userid );
    }).then( function( result )  {
        console.log("generateSessionAppFromApp", result);
        res.cookie(config.cookieName, sessionId, { expires: 0, httpOnly: true, path: '/' });
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
            objectid: ['ueeqaKY']
        } );
    });

});

module.exports = router;