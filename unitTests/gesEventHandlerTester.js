///**
// * Created by rharik on 6/19/15.
// */
//
//global.container = null;
//var bs = require('../bootstrap');
//bs.start();
//bs.inject([
//    {expectIdempotence:'./unitTests/mocks/expectIdempotenceMock'},
//    {gesConnection:'./unitTests/mocks/gesConnectionMock'},
//    {TestEventHandler:'./unitTests/mocks/TestEventHandler'}
//
//]);
//
//require('must');
//var expectIdempotence  = global.container.expectIdempotence;
//var gesConnection = global.container.gesConnection;
//var TestHandler = global.container.TestEventHandler;
//
//var gesEvent = global.container.gesEvent;
//var uuid = global.container.uuid;
//
//describe('gesEventHandlerBase', function() {
//    var mut;
//    before(function(){
//        mut = new TestHandler();
//    });
//    beforeEach(function(){
//        //console.log(gesConnection);
//        //console.log(global.container);
//
//        mut.clearEventsHandled();
//    });
//
//    describe('#handle event', function() {
//        context('when calling handler and not passing idempotency', function () {
//            it('should not process event',  function () {
//                mut.handleEvent({'some':'event'});
//                mut.eventsHandled.length.must.equal(0);
//            })
//        });
//        context('when calling handler that throws an exception', function () {
//            it('should not process event', async function () {
//                expectIdempotence.setPassesToTrue();
//                var eventData =new gesEvent('someException',{},{eventTypeName:'someException'},{'some':'data'});
//                var result = await mut.handleEvent(eventData);
//                mut.eventsHandled.length.must.equal(0);
//            })
//        });
//
//        context('when calling handler that throws an exception', function () {
//            it('should send proper notification event', async function () {
//                expectIdempotence.setPassesToTrue();
//                var eventData =new gesEvent('someException',{},{eventTypeName:'someException'},{'some':'data'});
//                var result = await mut.handleEvent(eventData);
//                JSON.parse(result.data.events[0].Data).data.notificationType.must.equal('Failure');
//            })
//        });
//
//        context('when calling handler that DOES NOT throw an exception', function () {
//            it('should send proper notification event', async function () {
//                expectIdempotence.setPassesToTrue();
//                var eventData =new gesEvent('someEvent',{},{eventTypeName:'someEvent'},{'some':'data'});
//                var result = await mut.handleEvent(eventData);
//                JSON.parse(result.data.events[0].Data).data.notificationType.must.equal('Success');
//            })
//        });
//
//        context('when calling handler that DOES NOT throws an exception', function () {
//            it('should process event', async function () {
//                expectIdempotence.setPassesToTrue();
//                var eventData =new gesEvent('someEvent',{},{eventTypeName:'someEvent'},{'some':'data'});
//                var result = await mut.handleEvent(eventData);
//                mut.eventsHandled.length.must.equal(1);
//            });
//        });
//        context('when calling handler is successful', function () {
//            it('should have proper properties on notification event', async function () {
//                expectIdempotence.setPassesToTrue();
//                var continuationId = uuid.v1();
//                var eventData =new gesEvent('someEvent',{},{eventTypeName:'someEvent', continuationId:continuationId},{'some':'data'});
//                var result = await mut.handleEvent(eventData);
//                result.data.expectedVersion.must.equal(-2);
//                console.log(result.data.events[0].Data);
//                result.data.events[0].EventId.length.must.equal(36);
//                result.data.events[0].Type.must.equal('notificationEvent');
//                JSON.parse(result.data.events[0].Data).eventName.must.equal('notificationEvent');
//                JSON.parse(result.data.events[0].Data).data.initialEvent.eventName.must.equal('someEvent');
//                JSON.parse(result.data.events[0].Metadata).continuationId.must.equal(continuationId);
//            })
//        });
//
//    });
//});