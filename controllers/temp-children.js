
var router = require ( 'express' ).Router ();
var logger = require ( '../../global/logger' );
var apigen = require ( '../../global/lib/apigen' );
var authFunction = require ( '../../auth/lib/auth-function')
var Child = require ( '../models/child' );

module.exports = apigen ({
    authFunction: authFunction,
    collection: Child,
    endpoint: '/children',
    nameField: 'name',
    objectName: 'Student',
    router: router,
    options: {
        GETALL: {
            requiresAuthentication: true,
            queryBuilder: function ( res, user )
            {
                return {
                    $query: {
                        user: user.username
                    },
                    $orderby: {
                        'age': -1
                    }
                };
            }
        },
        GET: {
            field: '_id',
            requiresAuthentication: true
        },
        POST: {
            objectBuilder: function ( req, user )
            {
                var newObject = {
                    name: req.body.name,
                    user: user.username
                };
                if ( req.body.age != undefined ) newObject.age = req.body.age;
                if ( req.body.grade != undefined )
                    newObject.grade = req.body.grade;
                return newObject;
            },
            requiresAuthentication: true
        },
        PUT: {
            field: '_id',
            queryBuilder: function ( req, user )
            {
                return {
                    '_id': req.params.value,
                    'user': user.username
                };
            },
            requiresAuthentication: true
        },
        DELETE: {
            field: '_id',
            queryBuilder: function ( req, user )
            {
                return {
                    '_id': req.params.value,
                    'user': user.username
                }
            },
            requiresAuthentication: true
        }
    }
});
