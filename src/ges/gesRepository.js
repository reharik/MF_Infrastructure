/**
 * Created by rharik on 6/10/15.
 */

var invariant = require('invariant');
var AggregateBase = require('./../models/AggregateRootBase');
var _ = require("lodash");
var EventData = require('../models/EventData');
var gesPromise = require('./gesPromise');
var streamNameStrategy = require('./strategies/streamNameStrategy');


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
        var sliceCount;
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
                "version number must be greater than or equal to 0"
            );

            streamName =  streamNameStrategy(aggregateType.aggregateName(), id);
            aggregate = new aggregateType();
            do {
                // specify number of events to pull. if number of events too large for one call use limit
                sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
                // get all events, or first batch of events from GES
                currentSlice = await gesPromise.readStreamEventsForwardPromise(streamName, {start:sliceStart, count: sliceCount});
                //validate
                if (currentSlice.Status == 'StreamNotFound') {
                    console.log(currentSlice.Status);
                    throw new Error('Aggregate not found: ' + streamName);
                }
                //validate
                if (currentSlice.Status == 'StreamDeleted') {
                    console.log(currentSlice.Status);
                    throw new Error('Aggregate Deleted: '+ streamName);
                }

                sliceStart = currentSlice.NextEventNumber;
                currentSlice.Events.forEach(e=> aggregate.applyEvent(JSON.parse(e.Event.Data)));

            } while (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream);
        } catch (error){
            console.log(error);
            throw(error);
        }

        return aggregate;

    }


    async function save(aggregate, commitId, _metadata){
        var streamName;
        var newEvents;
        var metadata;
        var originalVersion;
        var expectedVersion;
        var events;
        var appendData;
        var result;
        try {
            invariant(
                (aggregate instanceof AggregateBase),
                "aggregateType must inherit from AggregateBase"
            );

            // standard data for metadata portion of persisted event
            metadata = {
                // handy tracking id
                commitIdHeader: commitId,
                // type of aggregate being persisted
                aggregateTypeHeader: aggregate.constructor.name
            };
            // add extra data to metadata portion of persisted event
            _.assign(metadata, _metadata);

            streamName =  streamNameStrategy(aggregate.constructor.name, aggregate.id());
            newEvents = aggregate.getUncommittedEvents();

            originalVersion = aggregate.version() - newEvents.length;
            expectedVersion = originalVersion == 0 ? -1 : originalVersion-1;

            events = newEvents.map(x=> new EventData(x.id, x.type, x, metadata));

            appendData = {
                expectedVersion: expectedVersion,
                events: events
            };
            result = await gesPromise.appendToStreamPromise(streamName, appendData);

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
