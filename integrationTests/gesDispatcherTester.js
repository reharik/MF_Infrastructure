/**
 * Created by rharik on 7/6/15.
 */
var demand = require('must');


describe('gesDispatcher', function() {
    var bootstrap;
    var Mut;
    var mut;
    var uuid;
    var EventData;
    var appendData;
    var TestEventHandler;
    var testEventHandler;
    var append;

    before( function () {
        bootstrap = require('../bootstrap');

    });

    beforeEach(function () {
        Mut = bootstrap.getInstanceOf('gesDispatcher');
        TestEventHandler = bootstrap.getInstanceOf('TestEventHandler');
        uuid = bootstrap.getInstanceOf('uuid');
        EventData = bootstrap.getInstanceOf('EventData');
        append = bootstrap.getInstanceOf('appendToStreamPromise');

        testEventHandler = new TestEventHandler();
        mut = new Mut({handlers:[testEventHandler]});
        mut.startDispatching();
        appendData = { expectedVersion: -2, some:'data' };
        appendData.events = [new EventData('testing1',{eventTypeName:'testingEventNotificationOn'}, appendData)];
        append('dispatchStream',appendData);
    });

    context('when calling gesDispatcher', ()=> {
        it('should retrieve events', (done)=> {
            setTimeout(()=>{
                testEventHandler.eventsHandled.length.must.be.at.least(1);
                demand(testEventHandler.eventsHandled.find(x=>x.eventTypeName != 'testingEventNotificationOn')).be.undefined();



                done();
            }, 1000);

        });
    });
});
