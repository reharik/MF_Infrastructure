/**
 * Created by rharik on 6/12/15.
 */

module.exports = function appendToStreamPromise(bluebird, invariant, logger, gesConnection) {
    var Promise = bluebird;
    return function (streamName, data) {

        invariant(
            streamName,
            'must pass a valid stream name'
        );
        invariant(
            data.expectedVersion,
            'must pass data with an expected version of aggregate'
        );
        invariant(
            data.events.length > 0,
            'must pass data with at least one event'
        );
        logger.trace('wrapping appendToStream in Promise');
        return new Promise(function (resolve, reject) {
            //console.log(global.container.gesConnection);

            gesConnection().appendToStream(streamName, data, function (err, result) {
                logger.trace('appendToStream callback');
                if (err) {
                    logger.debug('rejecting appendToStream Promise with error message: ' + err);
                    reject(err);
                } else {
                    logger.debug('resolving appendToStream Promise with response: ' + result);
                    resolve(result);
                }
            });
        });
    };
};

