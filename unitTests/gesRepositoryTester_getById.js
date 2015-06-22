/**
 * Created by rharik on 6/10/15.
 */

require('must');
var uuid = require('uuid');

var TestAgg = require('./mocks/testAgg');
var AggregateBase = require('./../src/models/AggregateRootBase');
var streamNameStrategy = require('../src/ges/strategies/streamNameStrategy');
var Vent = require('../src/models/gesEvent');
var gesConnection = require('./mocks/gesConnectionMock');

var BadAgg = function(){};
var badAgg = new BadAgg();
var testAgg;


describe('getEventStoreRepository', function() {
    var mut;
    before(function(){
        mut = require('../src/ges/gesRepository')({gesConnection:gesConnection});
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
                var data = JSON.stringify(new Vent('someEvent',null,null,{blah:'blah'}));
                var result = {
                    Status: 'OK',
                    NextEventNumber:3,
                    Events: [{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}}],
                    IsEndOfStream: false
                };
                gesConnection.readStreamEventForwardShouldReturnResult(result);
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
                var data = JSON.stringify(new Vent('someEvent',null,null,{blah:'blah'}));
                var result = {
                    Status: 'StreamDeleted',
                    NextEventNumber:3,
                    Events: [{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}}],
                    IsEndOfStream: false
                };
                var id = uuid.v1();
                var streamName = streamNameStrategy(TestAgg.aggregateName(),id);
                gesConnection.readStreamEventForwardShouldReturnResult(result);
                var byId = mut.getById(TestAgg, id, 0);
                return byId.must.reject.error(Error, 'Aggregate Deleted: '+streamName);
            })
        });
        context('when calling getById with proper args but stream not found', function (){
            it('should throw proper error', function () {
                var data = JSON.stringify(new Vent('someEvent',null,null,{blah:'blah'}));
                    var result = {
                    Status: 'StreamNotFound',
                    NextEventNumber:3,
                    Events: [{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}}],
                    IsEndOfStream: false
                };
                var id = uuid.v1();
                var streamName = streamNameStrategy(TestAgg.aggregateName(),id);
                gesConnection.readStreamEventForwardShouldReturnResult(result);
                var byId = mut.getById(TestAgg, id, 0);
                return byId.must.reject.error(Error, 'Aggregate not found: '+streamName);

            })
        });
    });

});
