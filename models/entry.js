/**
 * Database schema for the Entry object.
 * @file school-log/data/entry.js
 */

var db = require ( '../../global/db' );
var entry = db.Schema ({
    child: { type: String, required: true },
    date: { default: Date.now, type: Date },
    description: { type: String, required: true },
    hours: { default: .5, type: Number },
    subject: { type: String, required: true },
    user: { type: String, required: true }
}, { collection: 'schoollog_entries', strict: false } );
module.exports = db.model ( 'Entry', entry );
