var aggBase = require("../../src/models/AggregateRootBase");


class TestAgg extends aggBase {
    constructor(){
        super();
        this.eventsHandled =[];
        this.type = 'TestAgg';
    }
    getEventsHandled(){return this.eventsHandled}
    clearEventsHandled(){return this.eventsHandled = []}
    static aggregateName(){return 'TestAgg';}

    commandHandlers() {
        return {
            'someCommand': function (command) {
                this.raiseEvent({'eventName': 'someshite', 'value': command.value});
            },
            'someOtherCommand': function (command) {
                this.raiseEvent({'eventName': 'someOthershite', 'value': command.value});
            }
        }
    }

    applyEventHandlers() {
        return {
            'someEvent': function (event) {
                this.eventsHandled.push(event);
            }.bind(this),
            'someOtherEvent': function (event) {
                this.eventsHandled.push(event);
            }.bind(this)
        }
    }
}

module.exports = TestAgg;