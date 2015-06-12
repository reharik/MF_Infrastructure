/**
 * Created by reharik on 6/10/15.
 */
var Promise = require('bluebird');
var invariant = require('invariant');

module.exports = function(connection, streamName, skipTake){
    invariant(
        connection,
        'must pass a valid connection'
    );
    invariant(
        streamName,
        'must pass a valid stream name'
    );
    invariant(
        skipTake,
        'must provide the skip take'
    );

    return new Promise(function(resolve, reject){
        connection.ReadStreamEventsForward(streamName, skipTake ,function(err, results) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
};