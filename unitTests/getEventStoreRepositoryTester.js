/**
 * Created by rharik on 6/10/15.
 */

var chai =require("chai");
var should = chai.should();
var mockery = require('mockery');
var testAgg = require('./mocks/testAgg');
var connection = require('./mocks/gesConnectionMock');
var readStreamEventForwardPromiseMock = require('./mocks/readStreamEventForwardPromiseMock');
var appendToStreamPromiseMock = require('./mocks/appendToStreamPromiseMock');
var uuid = require('uuid');
var streamNameStrategy = require('../src/ges/streamNameStrategy');




var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);


    var BadAgg = function(){};
    var badAgg = new BadAgg();

describe('getEventStoreRepository', function() {
    var mut;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('ges-client', connection);

    });

    beforeEach(function(){
    });

    describe('#getById', function() {
        context('when calling get by id with bad aggtype', function () {
            it('should throw proper error', function () {
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock() );
                mut = require('../src/ges/getEventStoreRepository')();
                mut.getById(badAgg,'','').should.be.rejectedWith('aggregateType must inherit from AggregateBase');
            })
        });
        context('when calling getById with bad uuid', function () {
            it('should throw proper error', function () {
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock() );
                mut = require('../src/ges/getEventStoreRepository')();
                mut.getById(testAgg,'some non uuid','').should.be.rejectedWith('id must be a valid uuid');
            })
        });
        context('when calling getById with bad version', function (){
            it('should throw proper error', function () {
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock() );
                mut = require('../src/ges/getEventStoreRepository')();
                mut.getById(testAgg,uuid.v1(),0).should.be.rejectedWith('version number must be greater that 0');
            })
        });
        context('when calling getById with proper args',function (){
            it('should return proper agg', function () {
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock() );
                mut = require('../src/ges/getEventStoreRepository')();
                mut.getById(testAgg,uuid.v1(),0).should.eventually.equal(typeof testAgg);
            })
        });
        context('when calling getById with proper args but stream deleted', function (){
            it('should throw proper error', function () {
                var result = {
                    Status: 'StreamDeleted',
                    NextEventNumber: 500,
                    Events: [{}],
                    IsEndOfStream: false
                };
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock(result) );
                mut = require('../src/ges/getEventStoreRepository')();
                mut.getById(testAgg,uuid.v1(),0).should.be.rejectedWith('Aggregate Deleted: ');
            })
        });
        context('when calling getById with proper args but stream not found', function (){
            it('should throw proper error', function () {
                var result = {
                    Status: 'StreamNotFound',
                    NextEventNumber: 500,
                    Events: [{}],
                    IsEndOfStream: false
                };
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock(result) );
                mut = require('../src/ges/getEventStoreRepository')();
                mut.getById(testAgg,uuid.v1(),0).should.be.rejectedWith('Aggregate not found: ');
            })
        });

        context('when calling getById with multiple events returned',function (){
            it('should return apply all events and presumably loop', async function () {
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock() );
                mut = require('../src/ges/getEventStoreRepository')();
                var agg =await mut.getById(testAgg,uuid.v1(),0);
                agg.getEventsHandled().length.should.equal(3);
            })
        });

        context('when calling getById with multiple events returned',function (){
            it('should set the agg version properly', async function () {
                mockery.registerMock('./readStreamEventsForwardPromise', readStreamEventForwardPromiseMock() );
                mut = require('../src/ges/getEventStoreRepository')();
                var agg =await mut.getById(testAgg,uuid.v1(),0);
                agg._version.should.equal(3);
            })
        });

    });
    describe('#save', function() {
        context('when calling save with bad aggtype', function () {
            it('should throw proper error', function () {
                mut = require('../src/ges/getEventStoreRepository')();
                mut.save(badAgg,'','').should.be.rejectedWith('aggregateType must inherit from AggregateBase');
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should return proper values', async function () {
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg._id = uuid.v1();
                mockery.registerMock('./appendToStreamPromise', appendToStreamPromiseMock );
                mut = require('../src/ges/getEventStoreRepository')();
                var result = await mut.save(testAgg, uuid.v1(), '');
                console.log(result);
                result.streamName.should.equal(streamNameStrategy('someShite', testAgg._id,));
            })
        });

    });

    after(function () {
        mockery.disable();
    });
});

