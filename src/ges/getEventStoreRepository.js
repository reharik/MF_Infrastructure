/**
 * Created by rharik on 6/10/15.
 */

var connection= require('./gesConnectionPromise');
//var config = require('../Config/config');
var invariant = require('invariant');
var AggregateBase = require('./../domain/AggregateBase');

module.exports = function (){
    function connectToEventStore()
    {
        return connection({ip: config.eventstore.ip, tcp: 1113}).then(function(conn){return conn;}, function(err){throw err;});
    }

    function getById(aggregateType, id, version){
        invariant(
            aggregateType.prototype instanceof AggregateBase,
            "aggregateType must inherit from AggregateBase"
        );
        invariant(
            id.length === (36),
            "id must be a valid uuid"
        );
        invariant(
            (version <= 0),
            "version number must be greater that 0"
        );
    }

    return {
        getById : getById
    }

};
