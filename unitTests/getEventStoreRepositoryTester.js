/**
 * Created by rharik on 6/10/15.
 */

var should = require("chai").should();
var mut = require('../src/ges/getEventStoreRepository')();
var testAgg = require('./mocks/testAgg');
var uuid = require('uuid');

    var BadAgg = function(){};
    var badAgg = new BadAgg();

    describe('getEventStoreRepository', function() {

        beforeEach(function(){
        });

    describe('#getById', function() {
        context('when calling get by id with bad aggtype', ()=> {
            it('should throw proper error', function () {
                (function(){mut.getById(badAgg,'','')}).should.throw('aggregateType must inherit from AggregateBase');
            })
        });
        context('when calling getById with bad uuid', ()=> {
            it('should throw proper error', function () {
                (function(){mut.getById(testAgg,'some non uuid','')}).should.throw('id must be a valid uuid');
            })
        });
        context('when calling getById with bad version', ()=> {
            it('should throw proper error', function () {
                (function(){mut.getById(testAgg,uuid.v1(),0)}).should.throw('version number must be greater that 0');
            })
        });
    });
});

