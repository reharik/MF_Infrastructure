/**
 * Created by reharik on 6/8/15.
 */


var invariant = global.container.invariant;

class AggregateBase {
    constructor() {
        this._id;
        this._version=0;
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
    id(){return this._id};

    version(){return this._version};

    applyEvent(event){
        var key = Object.keys(this.applyEventHandlers()).find(x=>x === event.eventName);
        if (key) {
            this.applyEventHandlers()[key](event);
        }
        this._version++;
    }

    raiseEvent (event) {
        this.applyEvent(event);
        this.uncommittedEvents.push(event);
    }

    getUncommittedEvents(){
        return this.uncommittedEvents;
    }

    clearUncommittedEvents(){
        this.uncommittedEvents = [];
    }

    isAggregateBase(){ return true; }

}

module.exports = AggregateBase;