

var should = require('chai').should();
var mockery = require('mockery');
var moduleUnderTest = require("./mocks/testAgg");
var ConfigMock = require('./mocks/configMock');


describe('aggregateFunctionality', function() {
    var mut;
    before(function(){
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });
    });
    beforeEach(function(){
        mut = new moduleUnderTest();

    });
    describe('#CommandHandlers', function(){
        context('when newing up agg', ()=> {
            it('should make commandhandlers available at root', function () {
                mut.someCommand({}).should.be.function();
            })
        });
    });

    after(function () {
        mockery.disable();
    });
});