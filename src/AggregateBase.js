/**
 * Created by reharik on 6/8/15.
 */

const invariant = require('invariant');

class AggregateBase {
    constructor() {
        let id;
        let version;
        let uncommittedEvents = [];
        let applyEventHandlers;
        let commandHandlers;

        invariant(
            this.commandHandlers,
            'An aggregateRoot requires commandHandlers'
        );
        invariant(
            this.applyEventHandlers,
            'An aggregateRoot requires applyEventHandlers'
        );

        commandHandlers = Object.assign(this, this.commandHandlers);

    }

    raiseEvent (event) {
        var key = Object.keys(this.applyEventHandlers).find(x=>x === event.eventName);
        if (key) {
            this.applyEventHandlers[key](event);
        }
        this.uncommitedEvents.push(event);
    }

    getUncommittedEvents(){
        return this.uncommittedEvents;
    }

    clearUncommittedEvents(){
        this.uncommittedEvents = [];
    }

}

module.exports = AggregateBase;