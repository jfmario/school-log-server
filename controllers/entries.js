/**
 * Controller for endpoint /school-log/entries
 * @file school-log/controllers/entries.js
 */

var jwt = require ( 'jwt-simple' );
var router = require ( 'express' ).Router ();
var authSettings = require ( '../../auth/settings' );
var User = require ( '../../auth/models/user' );
var Entry = require ( '../models/entry' );

// POST to /entries adds an entry
router.post ( '/', function ( req, res, next )
{

    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    if ( !req.body.child ) return res.send ( 400 );
    if ( !req.body.description ) return res.send ( 400 );
    if ( !req.body.subject ) return res.send ( 400 );

    User.findOne ( { username: auth.username }, function ( err, user )
    {

        if ( err ) return next ( err );

        var entryObj = {
            child: req.body.child,
            description: req.body.description,
            subject: req.body.subject,
            user: auth.username
        };
        if ( req.body.date != undefined ) entryObj.date = req.body.date;
        if ( req.body.hours != undefined ) entryObj.hours = req.body.hours;
        var entry = new Entry ( entryObj );

        entry.save ( function ( err )
        {

            if ( err ) return next ( err );

            res.status ( 201 ).json ( entry );
        });
    });
});
// POST to /entries/query returns a list of matching entries
router.post ( '/query', function ( req, res, next )
{

    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );

    var queryObj - { user: auth.username };
    if ( req.body.child ) queryObj.child = req.body.child;

    if ( req.body.dateMin || req.body.dateMax )
    {
        queryObj.date = {};
        if ( req.body.dateMin ) queryObj.date.$gte = req.body.dateMin.toDate ();
        if ( req.body.dateMax ) queryObj.date.$lte = req.body.dateMax.toDate ();
    }
    if ( req.body.description ) queryObj.description = req.body.description;
    if ( ( req.body.hoursMin != undefined ) ||
        ( req.body.hoursMax != undefined ) )
    {
        queryObj.hours = {};
        if ( req.body.hoursMin != undefined )
            queryObj.hours.$gte = req.body.hoursMin.toDate ();
        if ( req.body.hoursMax != undefined )
            queryObj.hours.$lte = req.body.hoursMax.toDate ();
    }
    if ( req.body.subject ) queryObj.subject = req.body.subject;

    Entry.find ( queryObj, function ( err, entries )
    {

        if ( err ) return next ( err );

        res.json ( entries );
    });
});
// PUT to /entries/:id updates an entry
router.put ( '/:id', function ( req, res, next )
{
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    Entry.findOne ( { _id: req.params.id, user: auth.username },
        function ( err, entry )
    {

        if ( err ) return next ( err );
        if ( req.body.child ) entry.child = req.body.child;
        if ( req.body.date ) entry.date = req.body.date.toDate ();
        if ( req.body.description ) entry.description = req.body.description;
        if ( req.body.hours ) entry.hours = req.body.hours;
        if ( req.body.subject ) entry.subject = req.body.subject;

        entry.save ( function ( err )
        {

            if ( err ) return next ( err );

            res.status ( 204 ).json ( entry );
        });
    });
});
// DELETE to /entries/:id deletes an entry
