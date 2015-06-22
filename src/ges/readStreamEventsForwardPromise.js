/**
 * Created by reharik on 6/10/15.
 */
var Promise = require('bluebird');
var invariant = require('invariant');
//var gesConnection = require('./gesConnection');


module.exports = function(systemOpts, streamName, skipTake){
    invariant(
        streamName,
        'must pass a valid stream name'
    );
    invariant(
        skipTake,
        'must provide the skip take'
    );

    systemOpts.logger.trace('wrapping readStreamEventsForward in Promise');
    return new Promise(function(resolve, reject){
        systemOpts.gesConnection.readStreamEventsForward(streamName, skipTake ,function(err, results) {
            systemOpts.logger.trace('readStreamEventsForward callback');
            if (err) {
                systemOpts.logger.debug('rejecting readStreamEventsForward Promise with error message: '+err);
                reject(err);
            } else {
                systemOpts.logger.debug('resolving readStreamEventsForward Promise with response: '+result);
                resolve(result);
            }
        });
    })
};