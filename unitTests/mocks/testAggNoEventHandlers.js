

module.exports = function (AggregateRootBase, GesEvent) {
    return class testAggNoEventHandlers extends AggregateRootBase {
        commandHandlers() {
            return {
                'someCommand': function (command) {
                    var vent1 = new GesEvent('someAggEvent', null, null, {blah: command.value});
                    this.raiseEvent(vent1);
                },
                'someOtherCommand': function (command) {
                    var vent2 = new GesEvent('someOtherAggEvent', null, null, {blah: command.value});
                    this.raiseEvent(vent2);
                }
            }
        }
    };
};
