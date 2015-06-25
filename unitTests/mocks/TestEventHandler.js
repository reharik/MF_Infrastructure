/**
 * Created by rharik on 6/19/15.
 */


module.exports = function(gesEventHandlerBase) {
    return class TestEventHandler extends gesEventHandlerBase {
        constructor() {
            super();
            this.handlesEvents = ['someEvent'];
            this.eventsHandled = []
        }

        someEvent(vnt) {
            this.eventsHandled.push(vnt);
        }

        someException(vnt) {
            throw(new Error());
        }

        clearEventsHandled() {
            this.eventsHandled = [];
        }
    };
};