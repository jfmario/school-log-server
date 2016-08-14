/**
 * Controller for endpoint /school-log/entries
 * @file school-log/controllers/entries.js
 */

var jwt = require ( 'jwt-simple' );
var logger = require ( '../../global/logger' );
var router = require ( 'express' ).Router ();
var moment = require ( 'moment' );
var authSettings = require ( '../../auth/settings' );
var queryHelper = require ( '../lib/query' );
var User = require ( '../../auth/models/user' );
var Entry = require ( '../models/entry' );

// POST to /entries adds an entry
router.post ( '/', function ( req, res, next )
{

    logger.trace ( "POST to " + req.path + " from " + req.ip );
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    if ( !req.body.children ) return res.send ( 400 );
    if ( !req.body.description ) return res.send ( 400 );
    if ( !req.body.subject ) return res.send ( 400 );

    User.findOne ( { username: auth.username }, function ( err, user )
    {

        if ( err ) return next ( err );

        var entryObj = {
            children: req.body.children,
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

            logger.info ( "User " + auth.username +
                " creates new entry in subject " + entry.subject );
            res.status ( 201 ).json ( entry );
        });
    });
});
// POST to /entries/query returns a list of matching entries
router.post ( '/query', function ( req, res, next )
{

    logger.trace ( "POST to " + req.path + " from " + req.ip );
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );

    var queryObj = queryHelper.queryEntries ( auth, req );

    Entry.find ( queryObj, null, { sort: { 'date': 1 } },
        function ( err, entries )
        {

            if ( err ) return next ( err );

            logger.info ( "User " + auth.username +
                " queries " + entries.length + " entries" );
            res.json ( entries );
        });
});
// POST to /entries/entrylog.csv gets a csv matching the query
router.post ( '/entrylog.csv', function ( req, res, next )
{

    logger.trace ( "POST to " + req.path + " from " + req.ip );
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );

    var queryObj = queryHelper.queryEntries ( auth, req );

    Entry.find ( queryObj, null, { sort: { 'date': 1 } },
        function ( err, entries )
        {

            if ( err ) return next ( err );

            var flattenedEntries = [];
            var csvLines = ['Date,Student,Subject,Hours,Description']

            var childrenQuery = ( req.body.children.length > 0 );

            for ( var i = 0; i < entries.length; ++i )
            {
                for ( var j = 0; j < entries [i].children.length; ++j )
                {
                    if ( ( ( childrenQuery ) &&
                        ( req.body.children.indexOf (
                        entries [i].children [j] ) != -1 ) ) || !childrenQuery )
                    {

                        var dateStr = moment ( entries [i].date ).format (
                            'MM/DD/YYYY' );
                        var line = dateStr + ',' + entries [i].children [j] +
                            ',' + entries [i].subject + ',' +
                            entries [i].hours + ',' + entries [i].description;

                        csvLines.push ( line );
                    }
                }
            }

            logger.info ( "User " + auth.username +
                " pulls a CSV with " + entries.length + " entries" );
            res.send ( csvLines.join ( '\n' ) );
        });
});
// PUT to /entries/:id updates an entry
router.put ( '/:id', function ( req, res, next )
{
    logger.trace ( "PUT to " + req.path + " from " + req.ip );
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key
    logger.debug ( "Search for entry " + req.params.id +
        " in SchoolLog database" );
    Entry.findOne ( { _id: req.params.id, user: auth.username },
        function ( err, entry )
    {

        if ( err ) return next ( err );
        logger.debug ( "Found entry " + entry._id + " in SchoolLog database" );
        if ( req.body.child ) entry.child = req.body.child;
        if ( req.body.date ) entry.date = req.body.date.toDate ();
        if ( req.body.description ) entry.description = req.body.description;
        if ( req.body.hours ) entry.hours = req.body.hours;
        if ( req.body.subject ) entry.subject = req.body.subject;

        entry.save ( function ( err )
        {

            if ( err ) return next ( err );

            logger.info ( "User " + auth.username +
                " updates an entry in subject " + entry.subject );
            res.status ( 204 ).json ( entry );
        });
    });
});
// DELETE to /entries/:id deletes an entry
router.delete ( '/:id', function ( req, res, next )
{
    logger.trace ( "DELETE to " + req.path + " from " + req.ip );
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    Entry.findOneAndRemove ( { _id: req.params.id, user: auth.username },
        function ( err, entry )
    {

        if ( err ) return next ( err );

        logger.info ( "User " + auth.username +
            " deletes an entry in subject " + entry.subject );
        return res.status ( 200 ).json ( entry );
    });
});
module.exports = router;
