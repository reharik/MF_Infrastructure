/**
 * Created by rharik on 6/10/15.
 */

var should = require("chai").should();
var mut = require('../src/ges/gesConnectionPromise');
var config = require('../Config/config');

describe('gesConnectionPromise', function() {

    beforeEach(function(){
        var connectionPromise = mut({ip: config.eventstore.ip, tcpPort: 1113})
    });
    context('passing proper args', ()=> {
        it('should should return a promise that resolves', function () {
            connectionPromise.isFulfilled().should.be.true;
        })
    });
});

