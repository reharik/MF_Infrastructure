/**
 * Created by rharik on 6/18/15.
 */

var config = require('config');
var invariant = require('invariant');
var _ = require("lodash");
var gesEvent = require('../models/gesEvent');


module.exports = class gesDispatcher{
    constructor(_systemOpts, _options) {
        _systemOpts.logger.trace('constructing gesDispatcher base version');
        _systemOpts.logger.debug('gesDispatcher base system options ' + _systemOpts);
        _systemOpts.logger.debug('gesDispatcher base options passed in ' + _options);

        this.systemOpts = _systemOpts;
        this.options = {
            stream: '$all',
            targetTypeName: 'eventTypeName'
        };
        _.assign(this.options, _options);
        _systemOpts.logger.debug('gesDispatcher base options after merge ' + this.options);
        invariant(
            this.options.handlers,
            "Dispatcher requires at least one handler"
        );
    }

    startDispatching(){
        _systemOpts.logger.info('startDispatching called');
        var subscription = this.systemOpts.gesConnection.subscribeToStream(this.options.stream);
        _systemOpts.logger.debug('subscription created: '+subscription);
        subscription.on('event', function(payload){
            _systemOpts.logger.info('event received by dispatcher: '+payload);
            this.handleEvent(payload);
            _systemOpts.logger.info('event processed by dispatcher');
        }.bind(this))
    }

    handleEvent(payload){
        _systemOpts.logger.debug('filtering event before processing');
        if(!this.filterEvents(payload)){
            _systemOpts.logger.trace('event filtered out by dispatcher');
            return;
        }
        _systemOpts.logger.debug('event passed through filter');
        var vent = new gesEvent(payload.OriginalEvent.Metadata[this.options.targetTypeName],
            payload.OriginalPosition,
            payload.OriginalEvent.Metadata,
            payload.OriginalEvent.Data);
        _systemOpts.logger.info('event transfered into gesEvent: '+vent);

        _systemOpts.logger.info('looping through event handlers');
        this.options.handlers.forEach(h=> {
            _systemOpts.logger.info('calling event handler :'+h.eventHandlerName);
            if(!h.handlesEvents.find(x => x === vent.eventName)) {
                _systemOpts.logger.trace('event handler does not handle event type: '+vent.eventName);
                return;
            }
            _systemOpts.logger.debug('event handler does handle event type: '+vent.eventName);
            h.handleEvent(vent);
            _systemOpts.logger.debug('event handler finished handleing event');

        });
    }

    filterEvents(payload){
        _systemOpts.logger.trace('filtering event for system events ($)');
        if(payload.Event.EventType.startsWith('$')) { return false; }
        _systemOpts.logger.trace('event passed filter for system events ($)');
        _systemOpts.logger.trace('filtering event for empty metadata');
        if(_.isEmpty(payload.OriginalEvent.Metadata)) { return false; }
        _systemOpts.logger.trace('event has metadata');
        _systemOpts.logger.trace('filtering event for empty adata');
        if(_.isEmpty(payload.OriginalEvent.Data)) { return false; }
        _systemOpts.logger.trace('event has data');
        return true;
    }


};