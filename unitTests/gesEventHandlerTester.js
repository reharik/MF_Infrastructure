/**
 * Created by rharik on 6/19/15.
 */

require('must');
var mockery = require('mockery');
//var appendToStream = require('./mocks/appendToStreamPromiseMock');
var gesEvent = require('../src/models/gesEvent');
var expectIdempotence = require('./mocks/expectIdempotenceMock');
var gesConnection = require('./mocks/gesConnectionMock');


describe('gesEventHandlerBase', function() {
    var mut;
    var TestHandler;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('./gesConnection', gesConnection);

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
            it('should not process event', async function () {
                expectIdempotence.setPassesToTrue();
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someException'},
                        Data:{'some':'data'}
                    }

                };
                var result = await mut.handleEvent(eventData);
                console.log("here damn it"+JSON.stringify(result,null,4));
                gesConnection.events[0].data.notificationType.must.equal('failure');
                //appendToStream.appendedData.appendData.data.notificationType.must.equal('failure');
            })
        });
    });
});