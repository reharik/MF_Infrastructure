/**
 * Created by rharik on 6/19/15.
 */


module.exports = function(gesEventHandlerBase) {
    return class TestEventHandler extends gesEventHandlerBase {
        constructor() {
            super();
            this.handlesEvents = ['someEvent', 'testingEvent'];
            this.eventsHandled = [];
            this.eventHandlerName = 'TestEventHandler';
        }

        someEvent(vnt) {
            console.log('herexxxxxxxxxxxxxxxxxxxxxxxx')
            this.eventsHandled.push(vnt);
        }

        someException(vnt) {
            throw(new Error());
        }

        testingEvent(vnt){
            this.eventsHandled.push(vnt);
        }

        clearEventsHandled() {
            this.eventsHandled = [];
        }
    };
};