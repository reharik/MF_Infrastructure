/**
 * Created by rharik on 6/10/15.
 */


//var bs = require('../../bootstrap');



module.exports = function(invariant,
                          AggregateRootBase,
                          lodash,
                          EventData,
                          appendToStreamPromise,
                          readStreamEventsForwardPromise,
                          streamNameStrategy,
                          logger) {
    var _ = lodash;
    return function (_options) {
        logger.trace('constructing gesRepository');
        logger.debug('gesRepository options passed in ' + _options);

        var options = {
            eventTypeHeader: 'eventTypeName',
            aggregateTypeHeader: 'aggregateTypeName',
            commitIdHeader: 'commitId',
            writePageSize: 2,
            readPageSize: 1
        };
        _.assign(options, _options);
        logger.debug('gesRepository options after merge ' + this.options);

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
            options.writePageSize > 0,
            "repository requires a write size greater than 0"
        );
        invariant(
            options.readPageSize,
            "repository requires a read size greater than 0"
        );

        async function getById(aggregateType, id, version) {
            logger.debug('gesRepo calling getById with params:' + aggregateType + ', ' + id + ', ' + version);

            var streamName;
            var aggregate;
            var sliceStart = 0;
            var currentSlice;
            var sliceCount;
            try {
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

                streamName = streamNameStrategy(aggregateType.aggregateName(), id);
                logger.debug('stream from which events will be pulled: ' + streamName);
                logger.trace('constructing aggregate');
                aggregate = new aggregateType();

                logger.debug('beginning loop to retrieve events');
                do {
                    // specify number of events to pull. if number of events too large for one call use limit
                    logger.debug('begining new iteration');

                    sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
                    logger.trace('number of events to pull this iteration: ' + sliceCount);
                    // get all events, or first batch of events from GES

                    logger.info('about to pull events for ' + aggregateType + ' from stream ' + streamName);
                    currentSlice = await readStreamEventsForwardPromise(streamName, {
                        start: sliceStart,
                        count: sliceCount
                    });
                    //validate
                    if (currentSlice.Status == 'StreamNotFound') {
                        throw new Error('Aggregate not found: ' + streamName);
                    }
                    //validate
                    if (currentSlice.Status == 'StreamDeleted') {
                        throw new Error('Aggregate Deleted: ' + streamName);
                    }

                    logger.info('events retrieved from stream: ' + streamName);
                    sliceStart = currentSlice.NextEventNumber;
                    logger.trace('new sliceStart calculated: ' + sliceStart);

                    logger.debug('about to loop through and apply events to aggreagate');
                    currentSlice.Events.forEach(e=> aggregate.applyEvent(JSON.parse(e.Event.Data)));
                    logger.info('events applied to aggregate');
                } while (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream);
            } catch (error) {
                logger.error('error retrieving aggreage: ' + error);
                throw(error);
            }

            return aggregate;

        }


        async function save(aggregate, commitId, _metadata) {
            logger.debug('gesRepo calling save with params:' + aggregate + ', ' + commitId + ', ' + _metadata);
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
                logger.debug('default metadata:' + metadata);

                // add extra data to metadata portion of persisted event
                _.assign(metadata, _metadata);
                logger.debug('merged metadata: ' + metadata);

                streamName = streamNameStrategy(aggregate.constructor.name, aggregate.id());
                logger.debug('gesRepo calling getById with params:' + aggregateType + ', ' + id + ', ' + version);
                logger.trace('retrieving uncommited events');
                newEvents = aggregate.getUncommittedEvents();

                originalVersion = aggregate.version() - newEvents.length;
                logger.trace('calculating original version number:' + aggregate.version() + ' - ' + newEvents.length + ' = ' + originalVersion);
                expectedVersion = originalVersion == 0 ? -1 : originalVersion - 1;
                logger.trace('calculating expected version :' + expectedVersion);

                logger.debug('creating EventData for each event');
                events = newEvents.map(x=> new EventData(x.id, x.type, x, metadata));
                logger.trace('EventData created for each event');

                appendData = {
                    expectedVersion: expectedVersion,
                    events: events
                };
                logger.debug('event data for posting created: ' + appendData);

                logger.trace('about to append events to stream');
                result = await appendToStreamPromise(streamName, appendData);
                logger.debug('events posted to stream:' + streamName);

                logger.trace('clear uncommitted events form aggregate');
                aggregate.clearUncommittedEvents();
                //largely for testing purposes
                return result;
            } catch (error) {
                throw(error);
            }
        }

        return {
            getById: getById,
            save: save
        }

    };
};