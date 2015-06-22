/**
 * Created by rharik on 6/12/15.
 */

var Promise = require('bluebird');
var invariant = require('invariant');
//var gesConnection = require('./gesConnection');

 module.exports = function(systemOpts, streamName, data){
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
     systemOpts.logger.trace('wrapping appendToStream in Promise');
     return new Promise(function(resolve,reject){
         systemOpts.gesConnection.appendToStream(streamName, data, function(err, result) {
             systemOpts.logger.trace('appendToStream callback');
            if (err) {
                systemOpts.logger.debug('rejecting appendToStream Promise with error message: '+err);
                reject(err);
            } else {
                systemOpts.logger.debug('resolving appendToStream Promise with response: '+result);
                resolve(result);
            }
        });
    });
};