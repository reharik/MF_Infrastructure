var aggBase = require("../../src/AggregateBase");


class TestAgg extends aggBase {
    commandHandlers() {
        return {
            'someCommand': function (command) {
                this.raiseEvent({'eventName': 'someshite', 'values': 'moreshite'});
            },
            'someOtherCommand': function (command) {
                this.raiseEvent({'eventName': 'someOthershite', 'values': 'moreshite'});
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