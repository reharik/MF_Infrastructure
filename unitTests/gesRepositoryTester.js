/**
 * Created by rharik on 6/10/15.
 */

require('must');
var mockery = require('mockery');
var uuid = require('uuid');

var TestAgg = require('./mocks/testAgg');
var AggregateBase = require('./../src/models/AggregateRootBase');
var readStreamEventsForwardPromiseMock = require('./mocks/readStreamEventsForwardPromiseMock');
var appendToStreamPromiseMock = require('./mocks/appendToStreamPromiseMock');
var streamNameStrategy = require('../src/ges/strategies/streamNameStrategy');
var Vent = require('../src/models/gesEvent');

var BadAgg = function(){};
var badAgg = new BadAgg();
var testAgg;


describe('getEventStoreRepository', function() {
    var mut;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('./appendToStreamPromise',appendToStreamPromiseMock.mock);
        mockery.registerMock('./readStreamEventsForwardPromise',readStreamEventsForwardPromiseMock.mock);
        mut = require('../src/ges/gesRepository')();

    });

    beforeEach(function(){
        testAgg = new TestAgg();
    });

    describe('#getById', function() {
        context('when calling get by id with bad aggtype', function () {
            it('should throw proper error',  function () {
                return mut.getById(BadAgg, uuid.v1(), '').must.reject.error(Error,"Invariant Violation: aggregateType must inherit from AggregateBase");
            })
        });
        context('when calling getById with bad uuid', function () {
            it('should throw proper error', function () {
                return mut.getById(TestAgg,'some non uuid','').must.reject.error(Error,"Invariant Violation: id must be a valid uuid");
            })
        });
        context('when calling getById with bad version', function (){
            it('should throw proper error', function () {
                return mut.getById(TestAgg,uuid.v1(),-6).must.reject.error(Error, "Invariant Violation: version number must be greater than or equal to 0");

            })
        });
        context('when calling getById with proper args',function (){
            it('should return proper agg', function () {
                return mut.getById(TestAgg,uuid.v1(),0).must.resolve.instanceof(TestAgg);
            })
        });
        context('when calling getById with multiple events returned',function (){
            it('should return apply all events and presumably loop', async function () {
                var agg = await mut.getById(TestAgg,uuid.v1(),0);
                agg.getEventsHandled().length.must.equal(3);
            })
        });

        context('when calling getById with multiple events returned',function (){
            it('should set the agg version properly', async function () {
                var byId = await mut.getById(TestAgg, uuid.v1(), 0);
                byId._version.must.equal(3);
            })
        });

        context('when calling getById with proper args but stream deleted', function (){
            it('should throw proper error', function () {
                readStreamEventsForwardPromiseMock.setResult({
                    Status: 'StreamDeleted',
                        NextEventNumber: 500,
                    Events: [{}],
                    IsEndOfStream: false
                });
                var id = uuid.v1();
                var streamName = streamNameStrategy(TestAgg.aggregateName(),id);
                var byId = mut.getById(TestAgg, id, 0);
                return byId.must.reject.error(Error, 'Aggregate Deleted: '+streamName);
            })
        });
        context('when calling getById with proper args but stream not found', function (){
            it('should throw proper error', function () {
                readStreamEventsForwardPromiseMock.setResult({
                    Status: 'StreamNotFound',
                    NextEventNumber: 500,
                    Events: [{}],
                    IsEndOfStream: false
                });
                var id = uuid.v1();
                var streamName = streamNameStrategy(TestAgg.aggregateName(),id);
                var byId = mut.getById(TestAgg, id, 0);
                return byId.must.reject.error(Error, 'Aggregate not found: '+streamName);

            })
        });
    });


    describe('#save', function() {
        context('when calling save with bad aggtype', function () {
            it('should throw proper error', function () {
                return mut.save(badAgg,'','').must.reject.error(Error, 'Invariant Violation: aggregateType must inherit from AggregateBase');
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should create proper stream name', async function () {
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.streamName.must.equal(streamNameStrategy('TestAgg', testAgg._id,));
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should save proper number of events', async function () {
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.appendData.events.length.must.equal(3);
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should add proper metadata to events', async function () {
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var commitId = uuid.v1();
                var result = await mut.save(testAgg, commitId, '');

                var metadata = result.appendData.events[0].Metadata;
                var parsed = JSON.parse(metadata);
                parsed.commitIdHeader.must.equal(commitId);
                parsed.aggregateTypeHeader.must.equal("TestAgg");
            })
        });
        context('when adding and altering metadata', function () {
            it('should result in proper metadata to events', async function () {
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var commitId = uuid.v1();
                var result = await mut.save(testAgg, commitId, {favoriteCheeze:'headcheeze',aggregateTypeHeader:'MF.TestAgg' });
                var metadata = result.appendData.events[0].Metadata;
                var parsed = JSON.parse(metadata);
                parsed.favoriteCheeze.must.equal("headcheeze");
                parsed.aggregateTypeHeader.must.equal("MF.TestAgg");
            })
        });
        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.appendData.expectedVersion.must.equal(-1);
            })
        });

        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg._version = 5;
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg.raiseEvent(new Vent('someShite',null,null,{variousProperties:"yeehaw"}));
                testAgg._id = uuid.v1();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.appendData.expectedVersion.must.equal(4);
            })
        });
    });

    after(function () {
        mockery.disable();
    });
});
