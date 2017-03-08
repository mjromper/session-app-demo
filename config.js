var path = require('path')
var extend = require('extend')
var fs = require('fs-extra')

var certPath = '../sessionapp/certs'
var config = extend(true, {

    /**
     * Server config
     */
    hostname: 'ukwin-aor-w10.qliktech.com',
    port: 3000, // Web GUI port
    useHTTPS: false, // Use HTTP or HTTPs Server
    template: 'bcc93229-67ef-460e-b3c7-e3a6e3766eda', // Default template GUID
    cookieName: 'X-Qlik-Session-OnDemand', // Cookie name assigned for virtual proxy
    origin: 'https://localhost:3000', // Your server origin - Needs a corresponding entry in virtual proxy white list

    hostfile: 'C:/ProgramData/Qlik/Sense/Host.cfg',
    engineuser: 'UserDirectory=Internal;UserId=sa_repository',

    certificates: {
        client: path.resolve(certPath, 'client.pem'),
        server: path.resolve(certPath, 'server.pem'),
        root: path.resolve(certPath, 'root.pem'),
        client_key: path.resolve(certPath, 'client_key.pem'),
        server_key: path.resolve(certPath, 'server_key.pem')
    },


    senseHost: 'ukwin-aor-w10.qliktech.com',
    prefix: 'ondemand',
    isSecure: false,
    appname: '3ff2620d-32ff-4be8-ae9f-4d2ba2f9fd7e'

});

module.exports = config;
