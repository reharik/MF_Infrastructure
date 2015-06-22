/**
 * Created by rharik on 6/19/15.
 */

require('must');
var mockery = require('mockery');
var gesConnection = require('./mocks/gesConnectionMock');
var gesEvent = require('../src/models/gesEvent');


describe('gesDispatcher', function() {
    var mut;
    var TestHandler;
    var testHandler;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('./gesConnection', gesConnection);

        var mod = require('../src/ges/gesDispatcher');
        TestHandler = require('./mocks/TestEventHandler');
        testHandler = new TestHandler();
        mut = new mod({handlers:[testHandler]});

    });
    beforeEach(function(){
       testHandler.clearEventsHandled();
    });

    describe('#Instanciate Dispatcher', function() {
        context('when instanciating dispatcher with no handlers', function () {
            it('should throw proper error',  function () {
                var dispatcher = require('../src/ges/gesDispatcher');
                (function(){new dispatcher()}).must.throw(Error,"Invariant Violation: Dispatcher requires at least one handler");
            })
        });
        context('when instanciating dispatcher with custom options', function () {
            it('should have overwrite defaults',  function () {
                var dispatcher = require('../src/ges/gesDispatcher');
                var opts = {
                    stream: 'someEventStream',
                    targetTypeName: 'CommandTypeName',
                    eventType: 'command',
                    handlers:[new TestHandler() ]
                };
                var littleD = new dispatcher(opts);
                littleD.options.stream.must.equal(opts.stream);
                littleD.options.targetTypeName.must.equal(opts.targetTypeName);
                littleD.options.eventType.must.equal(opts.eventType);
            })
        });
    });
    describe('#StartDispatching', function() {
        context('when calling StartDispatching', function () {
            it('should handle event',  function () {
                mut.startDispatching();
                var subscription = gesConnection.subscription;
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someEvent'},
                        Data:{'some':'data'}
                    }

                };
                subscription.emit('event', eventData);
                testHandler.eventsHandled.length.must.equal(1);
            });

            it('should should emit the proper type',  function () {
                mut.startDispatching();
                var subscription = gesConnection.subscription;
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:'the originalPosition',
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someEvent'},
                        Data:{'some':'data'}
                    }

                };
                subscription.emit('event', eventData);
                testHandler.eventsHandled[0].must.be.instanceof(gesEvent) ;
            });

            it('should all the expected values on it',  function () {
                mut.startDispatching();
                var subscription = gesConnection.subscription;
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:'the originalPosition',
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someEvent'},
                        Data:{'some':'data'}
                    }

                };
                subscription.emit('event', eventData);
                var eventsHandled = testHandler.eventsHandled[0];
                eventsHandled.eventName.must.equal('someEvent');
                eventsHandled.originalPosition.must.equal('the originalPosition');
                eventsHandled.metadata.eventTypeName.must.equal('someEvent');
                eventsHandled.data.some.must.equal('data');
            })
        });

        context('when calling StartDispatching with filter breaking vars', function () {
            it('should not post event to handler for system event',  function () {
                mut.startDispatching();
                var subscription = gesConnection.subscription;
                var eventData = {
                    Event:{EventType:'$testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someEvent'},
                        Data:{'some':'data'}
                    }

                };
                subscription.emit('event', eventData);
                testHandler.eventsHandled.length.must.equal(0);
            });
            it('should not post event to handler for empty metadata',  function () {
                mut.startDispatching();
                var subscription = gesConnection.subscription;
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{},
                        Data:{'some':'data'}
                    }

                };
                subscription.emit('event', eventData);
                testHandler.eventsHandled.length.must.equal(0);
            });
            it('should not post event to handler for empty data',  function () {
                mut.startDispatching();
                var subscription = gesConnection.subscription;
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someEvent'},
                        Data:{}
                    }

                };
                subscription.emit('event', eventData);
                testHandler.eventsHandled.length.must.equal(0);
            });

            it('should not break when empty metadata or data',  function () {
                mut.startDispatching();
                var subscription = gesConnection.subscription;
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:{},
                    OriginalEvent:{}
                };
                subscription.emit('event', eventData);
                testHandler.eventsHandled.length.must.equal(0);
            });
        });

    });

    after(function () {
        mockery.disable();
    });
});
