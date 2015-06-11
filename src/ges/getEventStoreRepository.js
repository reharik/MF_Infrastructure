/**
 * Created by rharik on 6/10/15.
 */

var connection= require('./gesConnectionPromise');
var config = require('config');
var invariant = require('invariant');
var AggregateBase = require('./../domain/AggregateBase');
var streamNameStrategy = require('./streamNameStrategy');
var readStreamEventsForwardPromise = require('./readStreamEventsForwardPromise');
var _ = require("lodash");
var deserializeEvent = require('./deserializeEvent');

module.exports = function (_options){
    var options = {
        eventTypeHeader:'eventTypeName',
        aggregateTypeHeader: 'aggregateTypeName',
        commitIdHeader: 'commitId',
        writePageSize: 500,
        readPageSize: 500
    };
    _.assign(options, _options);
    invariant(
        options.eventTypeHeader,
        "repository requires an eventTypeHeader name"
    );
    invariant(
        options.aggregateTypeHeader,
        "repository requires an aggregateTypeHeader name"
    );
    invariant(
        options.commitIdHeader,
        "repository requires an commitIdHeader name"
    );
    invariant(
        options.writePageSize>0,
        "repository requires a write size greater than 0"
    );
    invariant(
        options.readPageSize,
        "repository requires a read size greater than 0"
    );


    options.esConn = options.esConn ? options.esConn : connection({ip: config.get('eventstore.ip'), tcp: 1113}).then(function(conn){return conn;}, function(err){throw err;});


    function getById(aggregateType, id, version){
        console.log(readStreamEventsForwardPromise());
        console.log(connection());

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
        var streamName =  streamNameStrategy(aggregateType.aggregateName(), id);
        var aggregate = new aggregateType();
        var sliceStart = 0;
        var currentSlice;
        do {
            // specify number of events to pull. if number of events too large for one call use limit
            var sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
            // get all events, or first batch of events from GES
            currentSlice = readStreamEventsForwardPromise(options.esConn, streamName, {start:sliceStart, count: sliceCount})
                .then(function(result){return result;}, function(err){throw err;});
            //validate
            if (currentSlice.Status == 'StreamNotFound') {
                throw new Error('Aggregate not found: ' + streamName);
            }
            //validate
            if (currentSlice.Status == 'StreamDeleted') {
                throw new Error('Aggregate Deleted: '+ streamName);
            }

            sliceStart = currentSlice.NextEventNumber;

            currentSlice.Events.forEach(e=> aggregate.applyEvent(deserializeEvent(e.OrigionalEvent.Metadata, x.OriginalEvent.Data)));

        } while (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream);

        return aggregate;

    }

    return {
        getById : getById
    }

};
