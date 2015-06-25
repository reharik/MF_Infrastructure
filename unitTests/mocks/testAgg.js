//var bs = require('../../bootstrap');


module.exports = function (AggregateRootBase, gesEvent) {
    return class TestAgg extends AggregateRootBase {
        constructor() {
            super();
            this.eventsHandled = [];
            this.type = 'TestAgg';
        }

        getEventsHandled() {
            return this.eventsHandled
        }

        clearEventsHandled() {
            return this.eventsHandled = []
        }

        static aggregateName() {
            return 'TestAgg';
        }

        commandHandlers() {
            return {
                'someCommand': function (command) {
                    var vent1 = new Vent('someshite', null, null, {blah: command.value});
                    this.raiseEvent(vent1);
                },
                'someOtherCommand': function (command) {
                    this.raiseEvent(vent2);
                    var vent2 = new Vent('someOthershite', null, null, {blah: command.value});
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
};