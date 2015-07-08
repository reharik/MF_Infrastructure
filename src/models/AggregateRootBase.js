/**
 * Created by reharik on 6/8/15.
 */


module.exports = function(invariant) {
    return class AggregateRootBase {
        constructor() {
            this._id;
            this._version = 0;
            this.uncommittedEvents = [];

            invariant(
                this.commandHandlers,
                'An aggregateRoot requires commandHandlers'
            );
            invariant(
                this.applyEventHandlers,
                'An aggregateRoot requires applyEventHandlers'
            );

            Object.assign(this, this.commandHandlers());
        }

        id() { return this._id };

        version() { return this._version };

        applyEvent(event) {
            console.log('event');
            console.log(event);
            var key = Object.keys(this.applyEventHandlers()).find(x=>x === event.eventName);
            if (key) {
                console.log('applying event');
                this.applyEventHandlers()[key](event);
            }
            this._version++;
        }

        raiseEvent(event) {
            this.applyEvent(event);
            this.uncommittedEvents.push(event);
        }

        getUncommittedEvents() {
            return this.uncommittedEvents;
        }

        clearUncommittedEvents() {
            this.uncommittedEvents = [];
        }

        static isAggregateBase() {
            return true;
        }
        isAggregateBase() {
            return true;
        }
    }
};