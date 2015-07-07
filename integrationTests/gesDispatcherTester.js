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

    before( function () {
        bootstrap = require('../bootstrap');

    });

    beforeEach(function () {
    });

    context('when calling gesDispatcher', ()=> {
        it('should retrieve events', ()=> {
            //this.timeout(15000);

            Mut = bootstrap.getInstanceOf('gesDispatcher');
            TestEventHandler = bootstrap.getInstanceOf('TestEventHandler');
            uuid = bootstrap.getInstanceOf('uuid');
            EventData = bootstrap.getInstanceOf('EventData');
            append = bootstrap.getInstanceOf('appendToStreamPromise');

            testEventHandler = new TestEventHandler();
            mut = new Mut({handlers:[testEventHandler]});
            mut.startDispatching();
            appendData = { expectedVersion: -2, some:'data' };
            appendData.events = [new EventData(uuid.v4(), 'testing1', appendData,{eventTypeName:'testingEvent'})];
            append('dispatchStream',appendData);
            testEventHandler.eventsHandled.length.must.be.at.least(1);
        });
    });
});
