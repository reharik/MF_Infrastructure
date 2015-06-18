/**
 * Created by rharik on 6/18/15.
 */
var ges= require('ges-client');
var config = require('config');
var invariant = require('invariant');
var _ = require("lodash");
var gesEVent = require('./models/gesEvent');


module.exports = class gesDispatcher{

    constructor(_options) {
        this.options = {
            stream: '$all',
            targetTypeName: 'eventTypeName',
            eventType: 'projection'
        };
        _.assign(this.options, _options);
        invariant(
            this.options.handlers,
            "Dispatcher requires at least one handler"
        );
        if (!this.options.esConn) {
            this.options.esConn = ges({ip: config.get('eventstore.ip'), tcp: 1113});
        }
    }

    startDispatching(){
        var subscription = options.esConn.subscribeToStream(options.stream);
        subscription.on('event', function(payload){
            this.handleEvent(payload);
        })
    }

    handleEvent(payload){
        if(!this.filterEvents(payload)){ return; }
        var gesEvent = new gesEvent(payload.OriginalEvent.Metadata[this.options.targetTypeName],
            payload.OriginalPosition,
            payload.OriginalEvent.Metadata,
            payload.OriginalEvent.Data);

        this.options.handlers.forEach(h=> {
            if(!h.eventsHandled.find(x => x === gesEvent.eventName)) { return; }
            h.handleEvent(gesEvent);
        });
    }

    filterEvents(payload){
        if(x.Event.EventType.startsWith('$')) { return false; }
        if(_.isEmpty(payload.OriginalEvent.Metadata)) { return false; }
        if(_.isEmpty(payload.OriginalEvent.Data)) { return false; }
        if(_vnt.OriginalEvent.Metadata[this.options.targetTypeName]!=this.options.eventType) { return false; }
        return true;
    }


};