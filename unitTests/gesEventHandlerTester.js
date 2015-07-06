///**
// * Created by rharik on 6/19/15.
// */
//
require('must');

describe('gesEventHandlerBase', function() {
    var mut;
    var TestHandler;
    var GesEvent;
    var uuid;
    var expectIdempotence;
    var container;

    before(function(){
        container = require('../testBootstrap');
        TestHandler = container.getInstanceOf('TestEventHandler');
        GesEvent = container.getInstanceOf('GesEvent');
        uuid = container.getInstanceOf('uuid');
        expectIdempotence = require('./mocks/expectIdempotenceMock')();
        mut = new TestHandler();
    });
    beforeEach(function(){
        mut.clearEventsHandled();
    });

    describe('#handle event', function() {
        context('when calling handler and not passing idempotency', function () {
            it('should not process event',  function () {
                mut.handleEvent({'some':'event'});
                mut.eventsHandled.length.must.equal(0);
            })
        });
        context('when calling handler that throws an exception', function () {
            it('should not process event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(false)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var eventData =new GesEvent('someException',{},{eventTypeName:'someException'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                mut.eventsHandled.length.must.equal(0);
            })
        });

        context('when calling handler that throws an exception', function () {
            it('should send proper notification event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var eventData =new GesEvent('someException',{},{eventTypeName:'someException'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                JSON.parse(result.data.events[0].Data).notificationType.must.equal('Failure');
            })
        });

        context('when calling handler that DOES NOT throw an exception', function () {
            it('should send proper notification event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var eventData =new GesEvent('someEvent',{},{eventTypeName:'someEvent'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                JSON.parse(result.data.events[0].Data).notificationType.must.equal('Success');
            })
        });

        context('when calling handler that DOES NOT throws an exception', function () {
            it('should process event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                var eventData =new GesEvent('someEvent',{},{eventTypeName:'someEvent'},{'some':'data'});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var result = await mut.handleEvent(eventData);
                mut.eventsHandled.length.must.equal(1);
            });
        });
        context('when calling handler is successful', function () {
            it('should have proper properties on notification event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();
                var continuationId = uuid.v1();
                var eventData =new GesEvent('someEvent',{},{eventTypeName:'someEvent', continuationId:continuationId},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                result.data.expectedVersion.must.equal(-2);
                result.data.events[0].EventId.length.must.equal(36);
                result.data.events[0].Type.must.equal('notificationEvent');
                JSON.parse(result.data.events[0].Data).eventName.must.equal('notificationEvent');
                JSON.parse(result.data.events[0].Data).initialEvent.eventName.must.equal('someEvent');
                JSON.parse(result.data.events[0].Metadata).continuationId.must.equal(continuationId);
            })
        });
    });
});