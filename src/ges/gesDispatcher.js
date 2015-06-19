/**
 * Created by rharik on 6/18/15.
 */

var gesConnection = require('./gesConnection');
var config = require('config');
var invariant = require('invariant');
var _ = require("lodash");
var gesEvent = require('../models/gesEvent');


module.exports = class gesDispatcher{
    constructor(_options) {
        this.options = {
            stream: '$all',
            targetTypeName: 'eventTypeName'
        };
        _.assign(this.options, _options);
        invariant(
            this.options.handlers,
            "Dispatcher requires at least one handler"
        );
    }

    startDispatching(){
        var subscription = gesConnection.subscribeToStream(this.options.stream);
        subscription.on('event', function(payload){
            this.handleEvent(payload);
        }.bind(this))
    }

    handleEvent(payload){
        if(!this.filterEvents(payload)){ return; }
        var vent = new gesEvent(payload.OriginalEvent.Metadata[this.options.targetTypeName],
            payload.OriginalPosition,
            payload.OriginalEvent.Metadata,
            payload.OriginalEvent.Data);

        this.options.handlers.forEach(h=> {
            if(!h.handlesEvents.find(x => x === vent.eventName)) { return; }
            h.handleEvent(vent);
        });
    }

    filterEvents(payload){
        if(payload.Event.EventType.startsWith('$')) { return false; }
        if(_.isEmpty(payload.OriginalEvent.Metadata)) { return false; }
        if(_.isEmpty(payload.OriginalEvent.Data)) { return false; }
        return true;
    }


};