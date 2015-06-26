/**
 * Created by reharik on 6/10/15.
 */


module.exports = function() {
    var Subscription = require('./SubscriptionMock');
    return function gesConnectionMock() {
        var subscription;
        var _appendToStreamShouldFail;
        var _readStreamEventForwardShouldFail;
        var readStreamEventForwardResult;
        var subscribeToStream = function () {
            subscription = new Subscription();
            return subscription;
        };

        var appendToStream = function (streamName, data, cb) {
            console.log('mock append');

            var results = {streamName: streamName, data: data};
            if (_appendToStreamShouldFail) {
                cb(results);
            }
            else {
                cb(null, results);
            }
        };

        var readStreamEventsForward = function (streamName, skipTake, cb) {
            console.log('mock read');
            var results = {streamName: streamName, skipTake: skipTake, result: readStreamEventForwardResult};
            if (_readStreamEventForwardShouldFail) {
                cb(readStreamEventForwardResult ? readStreamEventForwardResult : results);
            }
            else {
                cb(null, readStreamEventForwardResult ? readStreamEventForwardResult : results);
            }
        };
        var readStreamEventForwardShouldReturnResult = function (result) {
            readStreamEventForwardResult = result;
        };
        var readStreamEventForwardShouldFail = function () {
            _readStreamEventForwardShouldFail = true;
        };
        var appendToStreamShouldFail = function () {
            _appendToStreamShouldFail = true;
        };

        return {
            subscribeToStream: subscribeToStream,
            appendToStream: appendToStream,
            readStreamEventsForward: readStreamEventsForward,
            readStreamEventForwardShouldReturnResult: readStreamEventForwardShouldReturnResult,
            readStreamEventForwardShouldFail: readStreamEventForwardShouldFail,
            appendToStreamShouldFail: appendToStreamShouldFail
        }

    }
};

