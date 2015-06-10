var aggBase = require("../../src/domain/AggregateBase");


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