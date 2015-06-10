var aggBase = require("../../src/AggregateBase");


class TestAgg extends aggBase {
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