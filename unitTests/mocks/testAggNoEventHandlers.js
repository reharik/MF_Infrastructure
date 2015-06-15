var aggBase = require("../../src/models/AggregateRootBase");


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