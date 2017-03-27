var express = require('express');
var https = require('https');
var path = require('path');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var cookieParser = require('cookie-parser');
var cache = require('memory-cache');

var certificates = require('../server/utils/certificates');
var config = require('../config');

module.exports = {
    start: function() {

        /**
         * Loading certificates and hostname module will populate config with correct
         * certificates and parse the Qlik host file.
         */
        return Promise.all([certificates()]).then(function() {

            var app = express();
            var router = express.Router();

            /**
             * Middleware
             */
            app.use(cookieParser());
            app.use(bodyParser.json());

            /**
             * Static Resources
             */
            app.use(express.static( path.resolve(__dirname, '../client')));


            /**
             * Routes
             */
            app.use('/', require('./routes/index'));
            app.use('/user', require('./routes/user/user'));

            app.use('/auth', require('./routes/auth'));



            /**
             * Validate session when QPS asks for it.
             * Client > Server > Server posts session to QPS > QPS calls back verifying sesssion > Return true
             */
            app.get('/session/:sid', function(req, res) {
                var obj = cache.get(req.params.sid)
                res.send(obj);
            });

            app.post('/ticket', function(req, res) {
                console.log("UserId",req.body.UserId);
                require('./routes/user/ticket')(req.body.UserId).then( function(d) {
                    res.send(d);
                });
            });

            app.get('/loadscript', function(req, res) {
                res.sendFile( path.resolve(__dirname, './sensedata/rest-loadscript.txt'));
            });

            /**
             * Error Handler
             */
            app.use(function(err, req, res, next) {
                res.status(err.status || 500);
                res.send({
                    message: err.message,
                    error: err
                });
            });

            /**
             * Start Server
             */
            if (config.useHTTPS) {
                https.createServer({
                    ca: [config.certificates.root],
                    cert: config.certificates.server,
                    key: config.certificates.server_key
                }, app).listen(config.port)
            } else {
                app.listen(config.port);
            }

            console.log('Server listening on port: ' + config.port)

        });
    }
};
