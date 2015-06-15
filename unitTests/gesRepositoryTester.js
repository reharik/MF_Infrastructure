/**
 * Created by rharik on 6/10/15.
 */

var chai =require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
var mockery = require('mockery');
var uuid = require('uuid');

var TestAgg = require('./mocks/testAgg');
var connection = require('./mocks/gesConnectionMock');
var readStreamEventsForwardPromiseMock = require('./mocks/readStreamEventsForwardPromiseMock');
var appendToStreamPromiseMock = require('./mocks/appendToStreamPromiseMock');
var streamNameStrategy = require('../src/ges/strategies/streamNameStrategy');

chai.use(chaiAsPromised);

var BadAgg = function(){};
var badAgg = new BadAgg();
var testAgg = new TestAgg();


describe('getEventStoreRepository', function() {
    var mut;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
        mockery.registerMock('ges-client', connection);
        mockery.registerMock('./gesPromise', {readStreamEventsForwardPromise: readStreamEventsForwardPromiseMock(), appendToStreamPromise:appendToStreamPromiseMock} );

    });

    beforeEach(function(){
    });

    describe('#getById', function() {
        context('when calling get by id with bad aggtype', function () {
            it('should throw proper error', function () {
                mut = require('../src/ges/gesRepository')();
                mut.getById(badAgg,'','').should.be.rejectedWith('aggregateType must inherit from AggregateBase');
            })
        });
        context('when calling getById with bad uuid', function () {
            it('should throw proper error', function () {
                mut = require('../src/ges/gesRepository')();
                mut.getById(TestAgg,'some non uuid','').should.be.rejectedWith('id must be a valid uuid');
            })
        });
        context('when calling getById with bad version', function (){
            it('should throw proper error', function () {
                mut = require('../src/ges/gesRepository')();
                mut.getById(TestAgg,uuid.v1(),0).should.be.rejectedWith('version number must be greater that 0');
            })
        });
        context('when calling getById with proper args',function (){
            it('should return proper agg', function () {
                mut = require('../src/ges/gesRepository')();
                mut.getById(TestAgg,uuid.v1(),0).should.eventually.equal(typeof TestAgg);
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
                mockery.registerMock('./gesPromise', {readStreamEventsForwardPromise: readStreamEventsForwardPromiseMock(result)} );
                mut = require('../src/ges/gesRepository')();
                mut.getById(TestAgg,uuid.v1(),0).should.be.rejectedWith('Aggregate Deleted: ');
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
                mockery.registerMock('./gesPromise', {readStreamEventsForwardPromise: readStreamEventsForwardPromiseMock(result)} );
                mut = require('../src/ges/gesRepository')();
                mut.getById(TestAgg,uuid.v1(),0).should.be.rejectedWith('Aggregate not found: ');
            })
        });

        context('when calling getById with multiple events returned',function (){
            it('should return apply all events and presumably loop', async function () {
                mut = require('../src/ges/gesRepository')();
                var agg =await mut.getById(TestAgg,uuid.v1(),0);
                agg.getEventsHandled().length.should.equal(3);
            })
        });

        context('when calling getById with multiple events returned',function (){
            it('should set the agg version properly', async function () {
                mut = require('../src/ges/gesRepository')();
                console.log(require('./gesPromise'));
                var agg =await mut.getById(TestAgg,uuid.v1(),0);
                agg._version.should.equal(3);
            })
        });

    });
    describe('#save', function() {
        context('when calling save with bad aggtype', function () {
            it('should throw proper error', function () {
                mut = require('../src/ges/gesRepository')();
                mut.save(badAgg,'','').should.be.rejectedWith('aggregateType must inherit from AggregateBase');
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should create proper stream name', async function () {
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg._id = uuid.v1();
                mut = require('../src/ges/gesRepository')();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.streamName.should.equal(streamNameStrategy('TestAgg', testAgg._id,));
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should save proper number of events', async function () {
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg._id = uuid.v1();
                //mockery.registerMock('./appendToStreamPromise', appendToStreamPromiseMock );
                mut = require('../src/ges/gesRepository')();
                var result = await mut.save(testAgg, uuid.v1(), '');
                console.log(result.appendData.events);
                result.appendData.events.length.should.equal(3);
            })
        });
        context('when calling save with proper aggtype', function () {
            it('should add proper metadata to events', async function () {
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg._id = uuid.v1();
                //mockery.registerMock('./appendToStreamPromise', appendToStreamPromiseMock );
                mut = require('../src/ges/gesRepository')();
                var commitId = uuid.v1();
                var result = await mut.save(testAgg, commitId, '');

                var metadata = result.appendData.events[0].Metadata;
                console.log(metadata);
                metadata['commitIdHeader'].should.equal(commitId);
                metadata.aggregateTypeHeader.should.equal("TestAgg");
            })
        });
        context('when adding and altering metadata', function () {
            it('should result in proper metadata to events', async function () {
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg._id = uuid.v1();
                //mockery.registerMock('./appendToStreamPromise', appendToStreamPromiseMock );
                mut = require('../src/ges/gesRepository')();
                var commitId = uuid.v1();
                var result = await mut.save(testAgg, commitId, {favoriteCheeze:'headcheeze',aggregateTypeHeader:'MF.TestAgg' });
                var metadata = result.appendData.events[0].Metadata;
                metadata.favoriteCheeze.should.equal("headcheeze");
                metadata.aggregateTypeHeader.should.equal("MF.TestAgg");
            })
        });
        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg._id = uuid.v1();
                //mockery.registerMock('./appendToStreamPromise', appendToStreamPromiseMock );
                mut = require('../src/ges/gesRepository')();
                var result = await mut.save(testAgg, uuid.v1(), '');
                console.log(result.appendData);
                result.appendData.expectedVersion.should.equal(connection.expectedVersion.emptyStream);
            })
        });

        context('when calling save on new aggregate', function () {
            it('should calculate proper version number', async function () {
                testAgg._version = 5;
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg.raiseEvent({id:uuid.v1(), type:'someShite', variousProperties:"yeehaw"});
                testAgg._id = uuid.v1();
                //mockery.registerMock('./appendToStreamPromise', appendToStreamPromiseMock );
                mut = require('../src/ges/gesRepository')();
                var result = await mut.save(testAgg, uuid.v1(), '');
                result.appendData.expectedVersion.should.equal(5);
            })
        });




    });

    after(function () {
        mockery.disable();
    });
});

