///**
// * Created by rharik on 6/19/15.
// */
//
var demand = require('must');

describe('gesEventHandlerBase', function() {
    var mut;
    var TestHandler;
    var GesEvent;
    var uuid;
    var expectIdempotence;
    var container;
    var JSON;

    before(function(){
        container = require('../testBootstrap');
        TestHandler = container.getInstanceOf('TestEventHandler');
        GesEvent = container.getInstanceOf('GesEvent');
        uuid = container.getInstanceOf('uuid');
        expectIdempotence = require('./mocks/expectIdempotenceMock')();
        JSON = container.getInstanceOf('JSON');
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

                var eventData =new GesEvent('someExceptionNotificationOff',{eventTypeName:'someExceptionNotificationOff'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                mut.eventsHandled.length.must.equal(0);
            })
        });

        context('when calling handler that throws an exception and notification on', function () {
            it('should send proper notification event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var eventData =new GesEvent('someExceptionNotificationOn',{eventTypeName:'someExceptionNotificationOn'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                console.log('JSON.parse(result.data.events[0]');
                console.log(result.data.events);
                JSON.parse(result.data.events[0].Data).notificationType.must.equal('Failure');
            })
        });

        context('when calling handler that throws an exception and notification OFF', function () {
            it('should not send notification event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var eventData =new GesEvent('someExceptionNotificationOff',{eventTypeName:'someExceptionNotificationOff'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                demand(result).be.undefind;
            })
        });


        context('when calling handler that DOES NOT throw an exception and notification ON', function () {
            it('should send proper notification event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var eventData =new GesEvent('someEventNotificationOn',{eventTypeName:'someEventNotificationOn'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                JSON.parse(result.data.events[0].Data).notificationType.must.equal('Success');
            })
        });

        context('when calling handler that DOES NOT throw an exception and notification OFF', function () {
            it('should send proper notification event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                TestHandler = container.getInstanceOf('TestEventHandler');
                mut = new TestHandler();

                var eventData =new GesEvent('someEventNotificationOff',{eventTypeName:'someEventNotificationOff'},{'some':'data'});
                var result = await mut.handleEvent(eventData);
                demand(result).be.undefind;

            })
        });

        context('when calling handler that DOES NOT throws an exception', function () {
            it('should process event', async function () {
                container.inject({name:'expectIdempotence', resolvedInstance:expectIdempotence(true)});
                var eventData =new GesEvent('someEventNotificationOff',{eventTypeName:'someEventNotificationOff'},{'some':'data'});
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
                var eventData =new GesEvent('someEventNotificationOn',{eventTypeName:'someEventNotificationOn', continuationId:continuationId},{'some':'data'});
                var result = await mut.handleEvent(eventData);

                console.log('result');
                console.log(result.data.events);

                result.data.expectedVersion.must.equal(-2);
                result.data.events[0].EventId.length.must.equal(36);
                result.data.events[0].Type.must.equal('notificationEvent');
                JSON.parse(result.data.events[0].Metadata).eventTypeName.must.equal('notificationEvent');
                JSON.parse(result.data.events[0].Data).initialEvent.eventTypeName.must.equal('someEventNotificationOn');
                JSON.parse(result.data.events[0].Metadata).continuationId.must.equal(continuationId);
            })
        });
    });
});