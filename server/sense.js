var fs = require( "fs" ),
    path = require( "path" ),
    WebSocket = require( "ws" ),
    Q = require('q'),
    enigma = require( "enigma.js" ),
    qixSchema = require( "../node_modules/enigma.js/schemas/qix/3.1/schema.json" );

var config = require('../config');
var generateId = require('./utils/generateId');
var objects = require('./sensedata/objects');

function getConfig( cookie, appId ) {
    var identity = generateId();
    console.log("Indentity -- > ", identity);
    var route = "app/engineData";
    if ( appId ) {
        route = "app/"+appId;
    }
    return {
        Promise: global.Promise,
        schema: qixSchema,
        session: {
    		"host": config.senseHost,
    	    "prefix": "/"+config.prefix+"/",
    	    "unsecure": !config.isSecure,
            "identity": identity,
            "route": route,
    	    "disableCache": false
    	},
        createSocket: function( url ) {
            return new WebSocket( url, {
                rejectUnauthorized: false,
                ca: [config.certificates.root ],
                key: config.certificates.client_key,
                cert: config.certificates.client,
                headers: {
                    'Cookie': cookie,
                    'identity': identity
                }
            } );
        }
    };
}

function _script( connectorName ) {
    var data = fs.readFileSync(path.resolve(__dirname, './sensedata', config.loadScriptFile ), 'utf-8');
    return data = data.replace(/{{connectorName}}/g, connectorName);
};

function _scriptBank( userId ) {
    var cod_centro = {
        "20036919": 845,
        "50013849": 837,
        "50295945": 603,
        "20128051": 5597,
        "20078041": 293,
        "50310518": 754,
        "50156338": 5856,
        "50025944": 261
    }
    console.log("cod_centro", cod_centro[userId]);
    var data = fs.readFileSync(path.resolve(__dirname, './sensedata', config.loadScriptFile ), 'utf-8');
    return data = data.replace(/{{cod_centro}}/g, cod_centro[userId]);
};

function _getEnigmaService( connConfig ) {
    var defer = Q.defer();
    enigma.getService( "qix", connConfig ).then( function(qix) {
        console.log("Websocket connected!");
        console.log("URL", qix.global.session.rpc.url);
        console.log("SessionConfig", qix.global.session.rpc.sessionConfig);
        defer.resolve( qix );
    }, function(err){
        defer.reject(err);
    });
    return defer.promise;
}

function generateSessionAppFromApp( id, appId, userId ){

    var cookie = `${config.cookieName}=${id}`;
    console.log("Cookie -- > ", cookie);

    var connConfig = getConfig(cookie, appId);

    return _getEnigmaService( connConfig )
        .then( function( qix ) {
            console.log("Creating Session app from App: "+appId);
            return qix.global.createSessionAppFromApp(appId).then( function( app ) {
                console.log("Session app created - > done!", app);
                return _createRESTConnection( app, config.urlFiles(userId), cookie )
                    .then( function( connectionId ) {
                        console.log("Create REST connection - > done!, connectionId", connectionId);
                        //var loadScript = _script(cookie);
                        var loadScript = _scriptBank(userId);
                        return app.setScript( loadScript )
                            .then( function()  {
                                console.log("Loadscript set using that connection-> done!");
                                return app.doReload(2); //2 for throwing error if load error
                            } )/*.then( function() {
                                console.log("Reload app - > done!");
                                return global.Promise.all( objects.map( function(d) {
                                    return app.createObject( d );
                                }));
                            })*/.then( function(resObjects) {
                                //console.log("All objects created - > done!");
                                return app.getAppProperties();
                            }).then( function( props ) {
                                return {
                                    props: props,
                                    app: app,
                                    connectionId: connectionId
                                };
                            });
                    });
            });
        }).then( function( res ) {

            //Clear load script and remove connection
            res.app.setScript("").then( function() {
                console.log("Cleared session app load script");
                res.app.deleteConnection( res.connectionId ).then( function(){
                    console.log("Deleted connection");
                });
            });

            return {
                properties: res.props,
                identity: connConfig.session.identity,
            }
        }).catch( function(err) {
            console.log("generateSessionApp", err);
        });
}

function generateSessionApp( id, userId ){

    var cookie = `${config.cookieName}=${id}`;
    console.log("Cookie -- > ", cookie);

    var connConfig = getConfig(cookie);

    return _getEnigmaService( connConfig )
        .then( function( qix ) {
            console.log("Creating EMPTY Session app");
            return qix.global.createSessionApp().then( function( app ) {
                console.log("Session app created - > done!", app);
                return _createRESTConnection( app, config.urlFiles(userId), cookie )
                    .then( function( connectionId ) {
                        console.log("Create REST connection - > done!, connectionId", connectionId);
                        var loadScript = _script(cookie);
                        return app.setScript( loadScript )
                            .then( function()  {
                                console.log("Loadscript set using that connection-> done!");
                                return app.doReload(2); //2 for throwing error if load error
                            } ).then( function() {
                                console.log("Reload app - > done!");
                                return global.Promise.all( objects.map( function(d) {
                                    return app.createObject( d );
                                }));
                            }).then( function(resObjects) {
                                console.log("All objects created - > done!");
                                return app.getAppProperties();
                            }).then( function( props ) {
                                return {
                                    props: props,
                                    app: app,
                                    connectionId: connectionId
                                };
                            });
                    });
            });
        }).then( function( res ) {

            //Clear load script and remove connection
            res.app.setScript("").then( function() {
                console.log("Cleared session app load script");
                res.app.deleteConnection( res.connectionId ).then( function(){
                    console.log("Deleted connection");
                });
            });

            return {
                properties: res.props,
                identity: connConfig.session.identity,
            }
        }).catch( function(err) {
            console.log("generateSessionApp", err);
        });
}

function _createRESTConnection( app, url, connectorName ) {
    return app.createConnection({
        "qName": connectorName,
        "qConnectionString": `CUSTOM CONNECT TO \"provider=QvRestConnector.exe;url=${url};timeout=30;method=GET;autoDetectResponseType=true;keyGenerationStrategy=0;useWindowsAuthentication=false;forceAuthenticationType=false;skipServerCertificateValidation=false;useCertificate=No;certificateStoreLocation=LocalMachine;certificateStoreName=My;addMissingQueryParametersToFinalRequest=false;PaginationType=None;\"`,
        "qType": "QvRestConnector.exe"
    });
};


exports.generateSessionAppFromApp = generateSessionAppFromApp;
exports.generateSessionApp = generateSessionApp;

