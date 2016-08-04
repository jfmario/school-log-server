/**
 * Controller for endpoint /school-log/children
 * @file school-log/controllers/children.js
 */

var jwt = require ( 'jwt-simple' );
var router = require ( 'express' ).Router ();
var authSettings = require ( '../../auth/settings' );
var User = require ( '../../auth/models/user' );
var Child = require ( '../models/child' );

// GET to /children gets a list of the user's children
router.get ( '/', function ( req, res, next )
{

    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );

    Child.findAll ( { user: auth.username }, function ( err, children )
    {

        if ( err ) return next ( err );

        res.json ( children );
    });
});
// GET to /children/:id returns a single child
router.get ( '/:id', function ( req, res, next )
{
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    Child.findOne ( { _id: req.params.id, user: auth.username },
        function ( err, child )
    {

        if ( err ) return next ( err );

        res.json ( child );
    });
});
// POST to /children adds a new child
router.post ( '/', function ( req, res, next )
{

    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    if ( !req.body.name ) return res.send ( 400 );

    User.findOne ( { username: auth.username }, function ( err, user )
    {

        if ( err ) return next ( err );

        var childObj = {
            name: req.body.name,
            user: auth.username
        };
        if ( req.body.age ) childObj.age = req.body.age;
        if ( req.body.grade ) childObj.grade = req.body.grade;
        var child = new Child ( childObj );

        child.save ();
        res.status ( 201 ).json ( child );
    });
});
// PUT to /children/:id updates a child
router.put ( '/:id', function ( req, res, next )
{
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    Child.findOne ( { _id: req.params.id, user: auth.username },
        function ( err, child )
    {

        if ( err ) return next ( err );
        if ( req.body.age ) child.age = req.body.age;
        if ( req.body.grade ) child.grade = req.body.grade;
        if ( req.body.name ) child.name = req.body.name;

        child.save ();
        res.status ( 204 ).json ( child );
    });
});
// DELETE to /children/:id deletes a child
router.delete ( '/:id', function ( req, res, next )
{
    if ( !req.headers ['x-auth'] ) return res.send ( 401 );
    var auth = jwt.decode ( req.headers ['x-auth'], authSettings.key );
    Child.findOneAndRemove ( { _id: req.params.id }, function ( err, child )
    {

        if ( err ) return next ( err );

        return res.status ( 200 ).json ( child );
    });
});
module.exports = router;
