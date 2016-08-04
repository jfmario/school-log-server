/**
 * Database schema for the child object.
 * @file school-log/data/child.js
 */

var db = require ( '../../global/db' );
var entry = db.Schema ({
    child: { type: String },
    date: { default: Date.now, type: Date },
    description: { type: String },
    hours: { type: Number },
    subject: { type: String },
    user: { type: String }
}, { collection: 'schoollog_entries', strict: false } );
module.exports = db.model ( 'Entry', entry );
