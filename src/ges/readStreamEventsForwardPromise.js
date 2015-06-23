/**
 * Created by reharik on 6/10/15.
 */

//var bs = require('../../bootstrap');
var Promise = global.container.bluebird;
var invariant = global.container.invariant;
var gesConnection = global.container.gesConnection;
var logger = global.container.logger;

//var gesConnection = require('./gesConnection');


module.exports = function(streamName, skipTake){
    invariant(
        streamName,
        'must pass a valid stream name'
    );
    invariant(
        skipTake,
        'must provide the skip take'
    );

    logger.trace('wrapping readStreamEventsForward in Promise');
    return new Promise(function(resolve, reject){
        gesConnection().readStreamEventsForward(streamName, skipTake ,function(err, results) {
            logger.trace('readStreamEventsForward callback');
            if (err) {
                logger.debug('rejecting readStreamEventsForward Promise with error message: '+err);
                reject(err);
            } else {
                logger.debug('resolving readStreamEventsForward Promise with response: '+result);
                resolve(result);
            }
        });
    })
};