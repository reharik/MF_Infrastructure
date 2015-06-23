/**
 * Created by rharik on 6/23/15.
 */



require('must');

describe('bootstrapper', function() {
    var mut;
    beforeEach(function(){
        mut = require('../../src/IOC/bootstrapper');
    });

    describe('#calling start on bootstrapper', function(){
        context('calling start on bootstrapper with no internalDependencies', function () {
            it('should not throw error', function () {
                var result = mut('package.json').start();
                result.must.not.be.empty();
            })
        });
        context('calling start on bootstrapper with no internalDependencies', function () {
            it('should return object with dependencies on it (spot check)', function () {
                var result = mut('/package.json').start();
                result.bluebird.must.be.function();
                result.co.must.be.function();
            })
        });

        context('calling start on bootstrapper with internalDependencies', function () {
            it('should return internal depencies', function () {
                var result = mut('/integrationTests/IOC/package.json').start();
                result.gesConnection.must.be.function();
            })
        });
    });
});



