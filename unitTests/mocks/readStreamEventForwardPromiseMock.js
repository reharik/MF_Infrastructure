/**
 * Created by reharik on 6/10/15.
 */
var Promise = require('bluebird');

module.exports = function(conn, name, skipTake){
    return Promise.resolve({
        Status:'OK',
        NextEventNumber:500,
        Events: [{}],
        IsEndOfStream: false
    });
};