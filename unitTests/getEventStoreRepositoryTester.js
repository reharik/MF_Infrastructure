/**
 * Created by rharik on 6/10/15.
 */

var should = require("chai").should();
var mockery = require('mockery');
var mut = require('../src/ges/getEventStoreRepository')();
var testAgg = require('./mocks/testAgg');
var connection = require('./mocks/gesConnectionPromiseMock');
var readStreamEventsForwardPromiseMock = require('./mocks/gesConnectionPromiseMock');
var uuid = require('uuid');

    var BadAgg = function(){};
    var badAgg = new BadAgg();

describe('getEventStoreRepository', function() {
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('./gesConnectionPromise', connection);
        mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventsForwardPromiseMock );
    });

    beforeEach(function(){
    });

    describe('#getById', function() {
        context('when calling get by id with bad aggtype', function () {
            it('should throw proper error', function () {
                (function(){mut.getById(badAgg,'','')}).should.throw('aggregateType must inherit from AggregateBase');
            })
        });
        context('when calling getById with bad uuid', function () {
            it('should throw proper error', function () {
                (function(){mut.getById(testAgg,'some non uuid','')}).should.throw('id must be a valid uuid');
            })
        });
        context('when calling getById with bad version', function (){
            it('should throw proper error', function () {
                (function(){mut.getById(testAgg,uuid.v1(),0)}).should.throw('version number must be greater that 0');
            })
        });
        context('when calling getById with proper args',function (){
            it('should return proper agg', function () {
                var aggregate = mut.getById(testAgg,uuid.v1(),0);
                (aggregate instanceof testAgg).should.be.true;
            })
        });
        //context('when calling getById with proper args', ()=> {
        //    it('should return proper agg', function () {
        //        var aggregate = mut.getById(testAgg,uuid.v1(),0);
        //        (aggregate instanceof testAgg).should.be.true;
        //    })
        //});





    });
    after(function () {
        mockery.disable();
    });
});

