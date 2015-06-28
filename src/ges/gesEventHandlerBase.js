/**
 * Created by rharik on 6/18/15.
 */

module.exports = function(NotificationEvent, appendToStreamPromise, expectIdempotence, EventData, logger) {
    return class gesEventHandler {
        constructor() {
            this.responseMessage;
            this.continuationId;
            this.handlesEvents = [];
            this.result;
            this.eventHandlerName;

        }

        handleEvent(gesEvent) {
            logger.debug('checking event for idempotence');
            if (!expectIdempotence(gesEvent)) {
                return;
            }
            logger.trace('event idempotent');

            try {
                logger.debug('building response notification');
                this.responseMessage = new NotificationEvent("Success", "Success", gesEvent);
                this.continuationId = gesEvent.metadata.continuationId;
                logger.trace('getting continuation Id: ' + this.continuationId);
                logger.info('calling specific event hanbdler for: ' + gesEvent.eventName + ' on ' + this.eventHandlerName);
                this[gesEvent.eventName](gesEvent);
                logger.trace('event Handled by: ' + gesEvent.eventName + ' on ' + this.eventHandlerName);

            } catch (exception) {
                logger.error('event: ' + gesEvent + ' threw exception: ' + exception);
                this.responseMessage = new NotificationEvent("Failure", exception.message, gesEvent);
            } finally {
                if (this.responseMessage) {
                    logger.trace('beginning to process responseMessage');
                    var responseEvent = new EventData(this.responseMessage.id,
                        this.responseMessage.data.eventName,
                        this.responseMessage.data,
                        {"continuationId": this.continuationId});

                    logger.debug('response event created: ' + responseEvent);

                    var appendData = {
                        expectedVersion: -2,
                        events: [responseEvent]
                    };
                    logger.debug('event data created: ' + appendData);

                    logger.trace('publishing notification');
                    this.result = appendToStreamPromise('notification', appendData);
                }
            }
            // largely for testing purposes, sadly
            return this.result;
        }
    };
};