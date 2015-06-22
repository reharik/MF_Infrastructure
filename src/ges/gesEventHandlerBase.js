/**
 * Created by rharik on 6/18/15.
 */

var Notification = require('../models/NotificationEvent');
var appendToStream = require('./appendToStreamPromise');
var expectIdempotence = require('./strategies/expectIdempotence');
var EventData = require('../models/EventData');

module.exports = class gesEventHandler {
    constructor(_systemOpts) {
        this.systemOpts = _systemOpts;
        this.responseMessage;
        this.continuationId;
        this.handlesEvents = [];
        this.result;
        this.eventHandlerName;
    }
    handleEvent(gesEvent) {
        _systemOpts.logger.debug('checking event for idempotence');
        if (!expectIdempotence(gesEvent)) { return; }
        _systemOpts.logger.trace('event idempotent');

        try {
            _systemOpts.logger.debug('building response notification');
            this.responseMessage = new Notification("Success", "Success", gesEvent);
            this.continuationId = gesEvent.metadata.continuationId;
            _systemOpts.logger.trace('getting continuation Id: '+this.continuationId);
            _systemOpts.logger.info('calling specific event hanbdler for: '+gesEvent.eventName+ ' on '+this.eventHandlerName);
            this[gesEvent.eventName](gesEvent);
            _systemOpts.logger.trace('event Handled by: '+gesEvent.eventName+ ' on '+this.eventHandlerName);

        } catch (exception) {
            _systemOpts.logger.error('event: ' +gesEvent+ ' threw exception: '+exception);
            this.responseMessage = new Notification("Failure", exception.message, gesEvent);
        } finally {
            if (this.responseMessage) {
                _systemOpts.logger.trace('beginning to process responseMessage');

                var responseEvent = new EventData(this.responseMessage.id,
                    this.responseMessage.eventName,
                    this.responseMessage,
                    {"continuationId": this.continuationId});

                _systemOpts.logger.debug('response event created: '+responseEvent);

                var appendData = {
                    expectedVersion: -2,
                    events: [responseEvent]
                };
                _systemOpts.logger.debug('event data created: '+appendData);

                _systemOpts.logger.trace('publishing notification');
                this.result = appendToStream(this.systemOpts, 'notification', appendData);
            }
        }
        // largely for testing purposes, sadly
        return this.result;
    }
};


