/**
 * Created by reharik on 6/8/15.
 */

const invariant = require('invariant');

class AggregateBase {
    constructor() {
        this.id;
        this.version;
        this.uncommittedEvents = [];

        invariant(
            this.commandHandlers,
            'An aggregateRoot requires commandHandlers'
        );
        invariant(
            this.applyEventHandlers,
            'An aggregateRoot requires applyEventHandlers'
        );

        Object.assign(this,  this.commandHandlers());
    }

    raiseEvent (event) {
        var key = Object.keys(this.applyEventHandlers).find(x=>x === event.eventName);
        if (key) {
            this.applyEventHandlers[key](event);
        }
        this.uncommittedEvents.push(event);
    }

    getUncommittedEvents(){
        return this.uncommittedEvents;
    }

    clearUncommittedEvents(){
        this.uncommittedEvents = [];
    }

}

module.exports = AggregateBase;