/**
 * Routing for the School Log API.
 * @file school-log/api.js
 */

var express = require ( 'express' ).Router ();
express.use ( '/children', require ( './controllers/children' ) );
module.exports = express;
