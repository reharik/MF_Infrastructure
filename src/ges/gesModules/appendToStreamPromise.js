/**
 * Created by rharik on 6/12/15.
 */

var Promise = require('bluebird');
var invariant = require('invariant');

 module.exposes = function(connection, streamName, data){
     invariant(
        connection,
        'must pass a valid connection'
     );
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
        connection.appendToStream(streamName, data, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};