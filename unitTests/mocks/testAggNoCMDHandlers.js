var aggBase = require("../../src/models/AggregateRootBase");


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