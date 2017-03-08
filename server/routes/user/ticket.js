var fs = require('fs');
var request = require('request-promise');
var config = require('../../../config');
var cache = require('memory-cache');

module.exports = function(user) {

    /*cache.put(user, JSON.stringify({
        "UserDirectory": "OnDemand",
        "UserId": user,
        "Attributes": []
    }));*/

    return request.post({
        url: `https://${config.senseHost}:4243/qps/${config.prefix}/ticket?xrfkey=abcdefghijklmnop`,
        headers: {
            'x-qlik-xrfkey': 'abcdefghijklmnop',
            'content-type': 'application/json'
        },
        rejectUnauthorized: false,
        cert: config.certificates.client,
        key: config.certificates.client_key,
        body: JSON.stringify({
            "UserDirectory": config.prefix,
            "UserId": user,
            "Attributes": []
        })
    });
}