

require('must');
var bootstrap = require('../testBootstrap');
bootstrap.start();
var testAgg = bootstrap.container.getInstanceOf('testAgg');
var testAggNoCMDHandlers = bootstrap.container.getInstanceOf('testAggNoCMDHandlers');
var testAggNoEventHandlers = bootstrap.container.getInstanceOf('testAggNoEventHandlers');


describe('aggregateFunctionality', function() {
    var mut;
    beforeEach(function(){
        mut = new testAgg();
    });

    describe('#aggConstructor', function(){
        context('when newing up agg without any command handlers', function () {
            it('should throw proper error', function () {
                (function(){new testAggNoCMDHandlers()}).must.throw(Error,'Invariant Violation: An aggregateRoot requires commandHandlers');
            })
        });
    });

    describe('#aggConstructor', function(){
        context('when newing up agg without any event handlers', function (){
            it('should throw proper error', function () {
                (function(){new testAggNoEventHandlers()}).must.throw('Invariant Violation: An aggregateRoot requires applyEventHandlers');
            })
        });
    });

    describe('#CommandHandlers', function(){
        context('when newing up agg',function (){
            it('should make commandhandlers available at root', function () {
                console.log('mut.someCommand');
                console.log((mut.someCommand instanceof Function));
                (mut.someCommand instanceof Function).must.be.true;
                (mut.someOtherCommand instanceof Function).must.be.true;
            })
        });
    });

    describe('#CommandHandlers', function(){
        context('when calling a commandHandler', function () {
            it('should emit an event to the uncommited event collection and getuncommitedevents should work', function () {
                mut.someCommand({'commandName':'someEvent', 'value':'some value'});
                mut.getUncommittedEvents()[0].data.blah.must.equal('some value');
            })
        });
    });

    describe('#CommandHandlers', function(){
        context('when calling a clearUncommitedEvents', function () {
            it('should clear events', function () {
                mut.someCommand({'commandName':'someEvent', 'value':'some value'});
                mut.clearUncommittedEvents();
                mut.getUncommittedEvents().must.be.empty;
            })
        });
    });

});