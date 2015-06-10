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

}

module.exports = TestAgg;