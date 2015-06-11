var aggBase = require("../../src/domain/AggregateBase");


class TestAgg extends aggBase {

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
            },
            'someOtherEvent': function (event) {
            }
        }
    }
}

module.exports = TestAgg;