/**
 * Created by reharik on 6/8/15.
 */

const invariant = require('invariant');

class AggregateBase {
    constructor() {
        let id;
        let version;
        let uncommittedEvents = [];
        let _applyEventHandlers;
        let _commandHandlers;

        invariant(
            this.commandHandlers,
            'An aggregateRoot requires commandHandlers'
        );
        invariant(
            this.applyEventHandlers,
            'An aggregateRoot requires applyEventHandlers'
        );

        commandHandlers = Object.assign(this, this._commandHandlers);

    }

    raiseEvent (event) {
        var key = Object.keys(this._applyEventHandlers).find(x=>x === event.eventName);
        if (key) {
            this._applyEventHandlers[key](event);
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