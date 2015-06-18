/**
 * Created by rharik on 6/18/15.
 */

var UINotification = require('UINotification');
var uiResponsePoster = require('uiResponsePoster');

module.exports = class gesEventHandler {
    var responseMessage;
    var continuationId;
    var eventsHandled = [];

    handleEvent(gesEvent) {
        if (!expectIdempotency(gesEvent)) {
            return;
        }

        try {
            responseMessage = new UINotification("Success", "Success", gesEvent.eventType);
            continuationId = gesEvent.metaData["ContinuationId"] != null ? gesEvent.metaData["ContinuationId"].ToString() : "";

            this[gesEvent.EventType](gesEvent);

        } catch (excpetion) {
            responseMessage = new UINotification("Failure", exception.message, gesEvent.eventType);
        } finally {
            if (responseMessage) {
                uiResponsePoster.postEvent(responseMessage, {"continuationId": continuationId});
            }
        }
    }
};


