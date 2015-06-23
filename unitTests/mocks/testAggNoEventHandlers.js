
var aggBase = global.container.AggregateRootBase;
var Vent = global.container.gesEvent;


class TestAgg extends aggBase {
    commandHandlers() {
        return {
            'someCommand': function (command) {
                var vent1 = new Vent('someshite',null,null,{blah:command.value});
                this.raiseEvent(vent1);
            },
            'someOtherCommand': function (command) {
                var vent2 = new Vent('someOthershite',null,null,{blah:command.value});
                this.raiseEvent(vent2);
            }
        }
    }

}

module.exports = TestAgg;