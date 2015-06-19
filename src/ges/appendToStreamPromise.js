/**
 * Created by rharik on 6/12/15.
 */

var Promise = require('bluebird');
var invariant = require('invariant');
var gesConnection = require('./gesConnection');

 module.exports = function(streamName, data){
     invariant(
         streamName,
         'must pass a valid stream name'
     );
     invariant(
         data.expectedVersion,
         'must pass data with an expected version of aggregate'
     );
     invariant(
         data.events.length>0,
         'must pass data with at least one event'
     );

     return new Promise(function(resolve,reject){
        gesConnection.appendToStream(streamName, data, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};