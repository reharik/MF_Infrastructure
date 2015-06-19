/**
 * Created by rharik on 6/18/15.
 */

var Notification = require('../models/NotificationEvent');
var appendToStream = require('./appendToStreamPromise');
var expectIdempotence = require('./strategies/expectIdempotence');
var EventData = require('../models/EventData');

module.exports = class gesEventHandler {
    constructor() {
        this.responseMessage;
        this.continuationId;
        this.handlesEvents = [];
    }
    handleEvent(gesEvent) {
        if (!expectIdempotence(gesEvent)) { return; }

        try {
            this.responseMessage = new Notification("Success", "Success", gesEvent.eventName);
            this.continuationId = gesEvent.metadata["ContinuationId"] != null ? gesEvent.metadata["ContinuationId"].ToString() : "";

            this[gesEvent.eventName](gesEvent);

        } catch (exception) {
            this.responseMessage = new Notification("Failure", exception.message, gesEvent.eventName);
        } finally {
            if (this.responseMessage) {
                var responseEvent = new EventData(this.responseMessage.id,
                    this.responseMessage.type,
                    this.responseMessage,
                    {"continuationId": this.continuationId});

                var appendData = {
                    expectedVersion: -2,
                    events: [responseEvent]
                };
                console.log("WTF")
                appendToStream('notification', appendData);
            }
        }
    }
};


