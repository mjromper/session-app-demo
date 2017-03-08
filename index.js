process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

var server = require('./server/app')

/* Read hostfile and certificates and start server.
 * Returns promise
 */
server.start().catch( function(err){
	console.log('Oops, something happend', err)
} );