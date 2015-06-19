/**
 * Created by rharik on 6/19/15.
 */

require('must');
var mockery = require('mockery');
var appendToStream = require('./mocks/appendToStreamPromiseMock');
var gesEvent = require('../src/models/gesEvent');
var expectIdempotence = require('./mocks/expectIdempotenceMock');


describe('gesEventHandlerBase', function() {
    var mut;
    var TestHandler;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('./appendToStreamPromise',appendToStream.mock);
        mockery.registerMock('./strategies/expectIdempotence',expectIdempotence.mock);

        TestHandler = require('./mocks/TestEventHandler');
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
            it('should not process event',  function () {
                expectIdempotence.setPassesToTrue();
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someException'},
                        Data:{'some':'data'}
                    }

                };
                mut.handleEvent(eventData);
                console.log(appendToStream.appendedData);
                appendToStream.appendedData().appendData.data.notificationType.must.equal('failure');
            })
        });
    });
});