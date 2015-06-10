
class Client extends AggregateBase {
    constructor() {
        super();
    }
    var commandHandlers = {
        'someCommand': function(command){
            this.raiseEvent({'eventName':'someshite', 'values':'moreshite'});
        },
        'someOtherCommand': function(command){
            this.raiseEvent({'eventName':'someOthershite', 'values':'moreshite'});
        }
    };

    var applyEventHandlers = {
        'someEvent': function(event){

        },
        'someOtherEvent': function(event){

        }
    }
}
