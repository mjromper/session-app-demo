var express = require('express');
var router = express.Router(),
    userList = require('../utils/userlist'),
    generateId = require('../utils/generateId'),
    postSession = require('../routes/user/session');

var config = require('../../config');

var USERS = [];

var config = require('../../config');

router.post('/', function ( req, res ) {
    var user = userList.filter( function(u){
        return req.body.username === u.id && req.body.dir === u.dir;
    });

    if ( user && user.length ) {
        user = user[0];
        var sessionId = generateId();

        postSession( user.id, sessionId ).then( function( response ) {
            console.log("Session", response);
            res.cookie(config.cookieName, JSON.parse(response).SessionId, { expires: 0, httpOnly: true, path: '/' }).json(user);
        });

    } else {
        res.status(404).send();
    }
});

router.get('/login', function ( req, res ) {
	console.log("req", req.query);
    var ticketReq = {
        'UserDirectory': req.query.directory,
        'UserId': req.query.userid,
        'Attributes': []
    };
    qlikAuth.requestTicket( req, res, ticketReq, {
    	"Certificate": 'certs/client.pem',
    	"CertificateKey": 'certs/client_key.pem'
    } );

});

module.exports = router;