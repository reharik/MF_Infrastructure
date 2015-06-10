
var should = require("chai").should();
var mockery = require('mockery');
var testAgg = require("./mocks/testAgg");
var testAggNoCMDHandlers = require("./mocks/testAggNoCMDHandlers");
var testAggNoEventHandlers = require("./mocks/testAggNoEventHandlers");

describe('aggregateFunctionality', function() {
    var mut;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });

    beforeEach(function(){
        mut = new testAgg();
    });

    describe('#aggConstructor', function(){
        context('when newing up agg without any command handlers', ()=> {
            it('should throw proper error', function () {
                (function(){new testAggNoCMDHandlers()}).should.throw('Invariant Violation: An aggregateRoot requires commandHandlers');
            })
        });
    });

    describe('#aggConstructor', function(){
        context('when newing up agg without any event handlers', ()=> {
            it('should throw proper error', function () {
                (function(){new testAggNoEventHandlers()}).should.throw('Invariant Violation: An aggregateRoot requires applyEventHandlers');
            })
        });
    });

    describe('#CommandHandlers', function(){
        context('when newing up agg', ()=> {
            it('should make commandhandlers available at root', function () {
                (mut.someCommand instanceof Function).should.be.true;
                (mut.someOtherCommand instanceof Function).should.be.true;
            })
        });
    });

    after(function () {
        mockery.disable();
    });
});