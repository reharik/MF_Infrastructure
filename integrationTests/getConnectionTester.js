/**
 * Created by rharik on 6/10/15.
 */

require('must');

describe('gesConnection', function() {
    var gesConnection;
    var bootstrap;
    var mut;

    before(function(){
        bootstrap = require('../bootstrap');
    });

    beforeEach(function(){
    });

    context('passing proper args', ()=> {
        it('should should return a connection', function () {
            mut = bootstrap.getInstanceOf('gesConnection');
            console.log(mut);
            mut.must.not.be.null();
            mut._handler._connectingPhase.must.equal('Connected');
        })
    });

    context('when calling subscription', ()=> {
        it('should stay open', function () {
            mut = bootstrap.getInstanceOf('gesConnection');
            var rx = bootstrap.getInstanceOf('rx');
            var subscription = mut.subscribeToAllFrom();

            rx.Observable.fromEvent(subscription, 'event').forEach(x=> console.log(x));

            subscription.on('event', function (payload) {
                console.log('event received by dispatcher');
                console.log('event processed by dispatcher');
            });
            mut._handler._connectingPhase.must.equal('Connected');
        })
    });
});

