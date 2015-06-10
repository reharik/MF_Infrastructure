var aggBase = require("../../src/AggregateBase");


class TestAgg extends aggBase{
    constructor() {
        super();
    }
    commandHandlers() {
        this.commandHandlers(){
            'someCommand': function(command){
                this.raiseEvent({'eventName':'someshite', 'values':'moreshite'});
            },
            'someOtherCommand': function(command){
                this.raiseEvent({'eventName':'someOthershite', 'values':'moreshite'});
            }
        }
    };

    applyEventHandlers() {
        'someEvent': function(event){

        },
        'someOtherEvent': function(event){

        }
    }
}
