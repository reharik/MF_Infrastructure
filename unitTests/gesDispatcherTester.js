/**
 * Created by rharik on 6/19/15.
 */

require('must');

describe('gesDispatcher', function() {
    var container;
    var GesEvent;
    var gesConnection;
    var mod;
    var mut;
    var TestHandler;
    var testHandler;
    before(function(){
        container = require('../testBootstrap');
        GesEvent = container.getInstanceOf('GesEvent');
        gesConnection = container.getInstanceOf('gesConnection');
        mod = container.getInstanceOf('gesDispatcher');
        TestHandler = container.getInstanceOf('TestEventHandler');
        testHandler = new TestHandler();
        mut = new mod({handlers:[testHandler]});

    });
    beforeEach(function(){
       testHandler.clearEventsHandled();
        gesConnection.clean();
    });

    describe('#Instanciate Dispatcher', function() {
        context('when instanciating dispatcher with no handlers', function () {
            it('should throw proper error',  function () {

                console.log('gesConnection');
                //console.log(connection);
                gesConnection.subscribeToStream();
                gesConnection.getSubscription().on('fuck', function(data){console.log(data)});
                gesConnection.appendToStream('fuck',{name:'FUCCKCKCK'},function(){console.log('hello')});

                console.log("connection.getSubscription()1");
                console.log(gesConnection.getSubscription());
                var gesConnection2 = container.getInstanceOf('gesConnection');

                console.log("connection.getSubscription()2");
                console.log(gesConnection2.getSubscription());
            })
        });
    });


    describe('#Instanciate Dispatcher', function() {
        context('when instanciating dispatcher with no handlers', function () {
            it('should throw proper error',  function () {
                (function(){new mod()}).must.throw(Error,"Invariant Violation: Dispatcher requires at least one handler");
            })
        });
        context('when instanciating dispatcher with custom options', function () {
            it('should have overwrite defaults',  function () {
                var opts = {
                    stream: 'someEventStream',
                    targetTypeName: 'CommandTypeName',
                    eventType: 'command',
                    handlers:[new TestHandler() ]
                };
                var littleD = new mod(opts);
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

                console.log("testing connections");
                console.log(gesConnection.getId());
                console.log(mut.getConn().getId());

                var subscription = gesConnection.getSubscription();
                console.log(subscription);
                var eventData = {
                    Event:{EventType:'someEvent'},
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
                var subscription = gesConnection.getSubscription();
                var eventData = {
                    Event:{EventType:'testEvent'},
                    OriginalPosition:'the originalPosition',
                    OriginalEvent:{
                        Metadata:{eventTypeName:'someEvent'},
                        Data:{'some':'data'}
                    }

                };
                subscription.emit('event', eventData);
                testHandler.eventsHandled[0].must.be.instanceof(GesEvent) ;
            });

            it('should all the expected values on it',  function () {
                mut.startDispatching();
                var subscription = gesConnection.getSubscription();
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
                console.log(eventsHandled);
                eventsHandled.eventName.must.equal('someEvent');
                eventsHandled.originalPosition.must.equal('the originalPosition');
                eventsHandled.metadata.eventTypeName.must.equal('someEvent');
                eventsHandled.data.some.must.equal('data');
            })
        });

        context('when calling StartDispatching with filter breaking vars', function () {
            it('should not post event to handler for system event',  function () {
                mut.startDispatching();
                var subscription = gesConnection.getSubscription();
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
                var subscription = gesConnection.subscribeToStream();
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
                var subscription = gesConnection.subscribeToStream();
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
                var subscription = gesConnection.subscribeToStream();
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


});
