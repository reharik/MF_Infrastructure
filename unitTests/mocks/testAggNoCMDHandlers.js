var aggBase = global.container.AggregateRootBase;


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