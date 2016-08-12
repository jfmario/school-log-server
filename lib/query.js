/**
 * Contains functions for querying the school log database.
 * @file school-log/lib/query.js
 */

var Entry = require ( '../models/entry' );

/**
 * Creates the query object.
 */
this.queryEntries ( user, req )
{
    var queryObj = { user: auth.username };
    if ( req.body.children.length > 0 )
        queryObj.children = { $in: req.body.children };

    if ( req.body.dateMin || req.body.dateMax )
    {
        queryObj.date = {};
        if ( req.body.dateMin ) queryObj.date.$gte = req.body.dateMin;
        if ( req.body.dateMax ) queryObj.date.$lte = req.body.dateMax;
    }
    if ( ( req.body.hoursMin != 0 ) ||
        ( req.body.hoursMax != 0 ) )
    {
        queryObj.hours = {};
        if ( req.body.hoursMin != 0 )
            queryObj.hours.$gte = req.body.hoursMin
        if ( req.body.hoursMax != 0 )
            queryObj.hours.$lte = req.body.hoursMax
    }
    if ( req.body.subject.length )
        queryObj.subject = { $in: req.body.subject };

    return queryObj;
}
