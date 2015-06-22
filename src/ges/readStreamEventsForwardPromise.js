/**
 * Created by reharik on 6/10/15.
 */
var Promise = require('bluebird');
var invariant = require('invariant');
var gesConnection = require('./gesConnection');


module.exports = function(streamName, skipTake){
    invariant(
        streamName,
        'must pass a valid stream name'
    );
    invariant(
        skipTake,
        'must provide the skip take'
    );

    return new Promise(function(resolve, reject){
        console.log(JSON.stringify(gesConnection,null,4));

        gesConnection.readStreamEventsForward(streamName, skipTake ,function(err, results) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
};