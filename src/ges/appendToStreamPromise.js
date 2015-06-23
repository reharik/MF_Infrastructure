/**
 * Created by rharik on 6/12/15.
 */

//var bs = require('../../bootstrap');
var Promise = global.container.bluebird;
var invariant = global.container.invariant;
var logger = global.container.logger;
var gesConnection = global.container.gesConnection;

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
     logger.trace('wrapping appendToStream in Promise');
     return new Promise(function(resolve,reject){
         //console.log(global.container);
         //console.log(global.container.gesConnection);

         global.container.gesConnection().appendToStream(streamName, data, function(err, result) {
             logger.trace('appendToStream callback');
            if (err) {
                logger.debug('rejecting appendToStream Promise with error message: '+err);
                reject(err);
            } else {
                logger.debug('resolving appendToStream Promise with response: '+result);
                resolve(result);
            }
        });
    });
};