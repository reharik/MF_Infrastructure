/**
 * Created by rharik on 6/18/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = function (NotificationEvent, appendToStreamPromise, expectIdempotence, recordEventProcessed, EventData, logger) {
    return (function () {
        function gesEventHandler() {
            _classCallCheck(this, gesEventHandler);

            this.responseMessage;
            this.continuationId;
            this.handlesEvents = [];
            this.result;
            this.eventHandlerName;
        }

        _createClass(gesEventHandler, [{
            key: 'handleEvent',
            value: function handleEvent(gesEvent) {
                logger.debug('checking event for idempotence');
                if (!expectIdempotence(gesEvent)) {
                    return;
                }
                logger.trace('event idempotent');

                try {
                    logger.info('calling specific event handler for: ' + gesEvent.eventTypeName + ' on ' + this.eventHandlerName);

                    this[gesEvent.eventTypeName](gesEvent);

                    logger.trace('event Handled by: ' + gesEvent.eventTypeName + ' on ' + this.eventHandlerName);
                    recordEventProcessed(gesEvent);
                } catch (exception) {
                    logger.error('event: ' + JSON.stringify(gesEvent) + ' threw exception: ' + exception);
                    if (this.responseMessage) {
                        this.responseMessage = new NotificationEvent('Failure', exception.message, gesEvent);
                    }
                } finally {
                    if (this.responseMessage) {
                        logger.trace('beginning to process responseMessage');

                        var responseEvent = new EventData(this.responseMessage.eventTypeName, this.responseMessage.data, { 'continuationId': this.continuationId,
                            'eventTypeName': 'notificationEvent' });

                        logger.debug('response event created: ' + JSON.stringify(responseEvent));

                        var appendData = {
                            expectedVersion: -2,
                            events: [responseEvent]
                        };

                        logger.debug('event data created: ' + JSON.stringify(appendData));
                        logger.trace('publishing notification');

                        this.result = appendToStreamPromise('notification', appendData);
                    }
                }
                // largely for testing purposes, sadly
                return this.result;
            }
        }, {
            key: 'createNotification',
            value: function createNotification(gesEvent) {
                logger.debug('building response notification');

                this.responseMessage = new NotificationEvent('Success', 'Success', gesEvent);
                this.continuationId = gesEvent.metadata.continuationId;
                logger.trace('getting continuation Id: ' + this.continuationId);
            }
        }]);

        return gesEventHandler;
    })();
};