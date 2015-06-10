var aggBase = require("../../src/AggregateBase");


class TestAgg extends aggBase {
    constructor() {
        var commandHandlers = {
            'someCommand': function (command) {
                this.raiseEvent({'eventName': 'someshite', 'values': 'moreshite'});
            },
            'someOtherCommand': function (command) {
                this.raiseEvent({'eventName': 'someOthershite', 'values': 'moreshite'});
            }
        };
        var applyEventHandlers = {
            'someEvent': function (event) {

            },
            'someOtherEvent': function (event) {

            }
        };
        super();

    }
}
