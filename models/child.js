/**
 * Database schema for the child object.
 * @file school-log/data/child.js
 */

var db = require ( '../../global/db' );
var child = db.Schema ({
    age: { type: Number },
    grade: { type: Number },
    name: { type: String, required: true },
    user: { type: String, required: true }
}, { collection: 'schoollog_children', strict: false } );
child.index ( { name: 1, user: 1 }, { unique: true } );
module.exports = db.model ( 'Child', child );
