var fs = require('fs');
var request = require('request-promise');
var config = require('../../../config');
var cache = require('memory-cache');

module.exports = function(user, sessionId) {

    cache.put(sessionId, JSON.stringify({
        "UserDirectory": config.prefix,
        "UserId": user,
        "Attributes": [],
        "SessionId": sessionId
    }));

    var xrfkey = 'abcdefghijklmnop',
        url = `https://${config.senseHost}:4243/qps/${config.prefix}/session?xrfkey=${xrfkey}`;

    return request.post({
        url: url,
        headers: {
            'x-qlik-xrfkey': xrfkey,
            'content-type': 'application/json'
        },
        rejectUnauthorized: false,
        cert: config.certificates.client,
        key: config.certificates.client_key,
        body: JSON.stringify({
            "UserDirectory": config.prefix,
            "UserId": user,
            "Attributes": [],
            "SessionId": sessionId
        })
    });
}