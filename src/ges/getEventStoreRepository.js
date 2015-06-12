/**
 * Created by rharik on 6/10/15.
 */

var ges= require('ges-client');
var config = require('config');
var invariant = require('invariant');
var AggregateBase = require('./../domain/AggregateBase');
var streamNameStrategy = require('./streamNameStrategy');
var readStreamEventsForwardPromise = require('./readStreamEventsForwardPromise');
var appendToStreamPromise = require('./appendToStreamPromise');
var _ = require("lodash");
var EventData = require('../models/EventData');



module.exports = function (_options){
    var options = {
        eventTypeHeader:'eventTypeName',
        aggregateTypeHeader: 'aggregateTypeName',
        commitIdHeader: 'commitId',
        writePageSize: 2,
        readPageSize: 1
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

    if(!options.esConn){
        options.esConn = ges({ip: config.get('eventstore.ip'), tcp: 1113});
    }


    async function getById(aggregateType, id, version){
        var streamName;
        var aggregate;
        var sliceStart = 0;
        var currentSlice;
        try{
            invariant(
                (aggregateType.prototype instanceof AggregateBase),
                "aggregateType must inherit from AggregateBase"
            );
            invariant(
                id.length === (36),
                "id must be a valid uuid"
            );
            invariant(
                (version >= 0),
                "version number must be greater that 0"
            );

            streamName =  streamNameStrategy(aggregateType.aggregateName(), id);
            aggregate = new aggregateType();
            do {
                console.log("doing it");
                // specify number of events to pull. if number of events too large for one call use limit
                var sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
                // get all events, or first batch of events from GES
                currentSlice = await readStreamEventsForwardPromise(options.esConn, streamName, {start:sliceStart, count: sliceCount});

                //validate
                if (currentSlice.Status == 'StreamNotFound') {
                    throw new Error('Aggregate not found: ' + streamName);
                }
                //validate
                if (currentSlice.Status == 'StreamDeleted') {
                    throw new Error('Aggregate Deleted: '+ streamName);
                }

                sliceStart = currentSlice.NextEventNumber;
                currentSlice.Events.forEach(e=> aggregate.applyEvent(JSON.parse(e.Event.Data)));

            } while (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream);
        } catch (error){ throw(error); }

        return aggregate;

    }


    async function save(aggregate, commitId, _metadata){
        try {
            invariant(
                (aggregate.prototype instanceof AggregateBase),
                "aggregateType must inherit from AggregateBase"
            );

            // standard data for metadata portion of persisted event
            var metadata = {
                // handy tracking id
                commitIdHeader: commitId,
                // type of aggregate being persisted
                aggregateTypeHeader: aggregate.aggregateName()
            };
            // add extra data to metadata portion of presisted event
            _.assign(metadata, _metadata);

            streamName =  streamNameStrategy(aggregate.aggregateName(), aggregate.id);
            newEvents = aggregate.getUncommittedEvents();

            var originalVersion = aggregate.Version - newEvents.Count;
            var expectedVersion = originalVersion == 0 ? ges.expectedVersion.emptyStream : originalVersion-1;

            var events = newEvents.map(x=> new EventData(x.id, x.type, x, metadata));

            var appendData = {
                expectedVersion: expectedVersion,
                events: events
            };

            var result = await appendToStreamPromise(options.esConn, streamName, appendData);

            aggregate.clearUncommittedEvents();
            //largely for testing purposes
            return result;
        }catch(error){ throw(error);}
    }

    return {
        getById : getById,
        save : save
    }

};
