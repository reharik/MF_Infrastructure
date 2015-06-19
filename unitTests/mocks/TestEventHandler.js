/**
 * Created by rharik on 6/19/15.
 */

var EventHandler = require('../../src/ges/gesEventHandlerBase');

module.exports = class TestEventHandler extends EventHandler{
    constructor() {
        super();
        this.handlesEvents = ['someEvent'];
        this.eventsHandled = []
    }
    someEvent(vnt){
        this.eventsHandled.push(vnt);
    }
    someException(vnt){
        throw(new Error());
    }

    clearEventsHandled(){
        this.eventsHandled=[];
    }
};