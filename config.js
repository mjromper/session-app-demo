var path = require('path');
var certPath = '../sessionapp/certs';

var config = {

    certPath: certPath,
    /**
     * NodeJS Server config
     */
    port: 3000, // Web GUI port
    useHTTPS: true, // Use HTTP or HTTPs Server

    hostfile: 'C:/ProgramData/Qlik/Sense/Host.cfg',

    certificates: {
        client: path.resolve(certPath, 'client.pem'),
        server: path.resolve(certPath, 'server.pem'),
        root: path.resolve(certPath, 'root.pem'),
        client_key: path.resolve(certPath, 'client_key.pem'),
        server_key: path.resolve(certPath, 'server_key.pem')
    },

    /**
     * Sense Server config
     */
    senseHost: 'ukwin-aor-w10',
    prefix: 'ondemand',
    isSecure: true,
    cookieName: 'X-Qlik-Session-OnDemand', // Cookie name assigned for virtual proxy

    //Template and data
    template: '7aa116b6-3923-4c42-9fa2-1be6f298e711', // Default template GUID
    loadScriptFile: 'loadscript-airbnb.txt',
    urlFiles: function( userId ) {
        return `https://dl.dropboxusercontent.com/u/11081420/sessionappsdata/AirBnB/AirbnbWebTraffic-${userId}.csv`
    },
};

module.exports = config;
