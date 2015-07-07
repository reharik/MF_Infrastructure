/**
 * Created by rharik on 7/6/15.
 */
require('must');


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

    before(async function () {
        bootstrap = require('../bootstrap');
        Mut = bootstrap.getInstanceOf('gesDispatcher');
        TestEventHandler = bootstrap.getInstanceOf('TestEventHandler');
        testEventHandler = new TestEventHandler();
        mut = new Mut({handlers:[testEventHandler]});
        mut.startDispatching();
        uuid = bootstrap.getInstanceOf('uuid');
        EventData = bootstrap.getInstanceOf('EventData');
        append = bootstrap.getInstanceOf('appendToStreamPromise');
        appendData = { expectedVersion: -2, some:'data' };
        appendData.events = [new EventData(uuid.v4(), 'testing1', appendData,{eventTypeName:'testingEvent'})];
        await append('dispatchStream',appendData);

    });

    beforeEach(function () {
    });

    context('when calling gesDispatcher', ()=> {
        it('should retrieve events', ()=> {
            //this.timeout(1500);
            testEventHandler.eventsHandled.length.must.equal(1);
        });
    });
});
