/**
 * Created by rharik on 6/10/15.
 */

//var bs = require('../../bootstrap');

'use strict';

module.exports = function (invariant, AggregateRootBase, _, EventData, GesEvent, appendToStreamPromise, readStreamEventsForwardPromise, streamNameStrategy, logger, uuid) {

    return function (_options) {
        logger.trace('constructing gesRepository');
        logger.debug('gesRepository options passed in ' + _options);

        var options = {
            eventTypeNameHeader: 'eventTypeName',
            aggregateTypeHeader: 'aggregateTypeName',
            commitIdHeader: 'commitId',
            writePageSize: 2,
            readPageSize: 1
        };
        _.assign(options, _options || {});
        logger.debug('gesRepository options after merge ' + options);

        invariant(options.eventTypeNameHeader, 'repository requires an eventTypeNameHeader name');
        invariant(options.aggregateTypeHeader, 'repository requires an aggregateTypeHeader name');
        invariant(options.commitIdHeader, 'repository requires an commitIdHeader name');
        invariant(options.writePageSize > 0, 'repository requires a write size greater than 0');
        invariant(options.readPageSize, 'repository requires a read size greater than 0');

        function getById(aggregateType, id, version) {
            var streamName, aggregate, sliceStart, currentSlice, sliceCount;
            return regeneratorRuntime.async(function getById$(context$3$0) {
                while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                        logger.debug('gesRepo calling getById with params:' + aggregateType + ', ' + id + ', ' + version);

                        sliceStart = 0;
                        context$3$0.prev = 2;

                        invariant(aggregateType.isAggregateBase(), 'aggregateType must inherit from AggregateBase');
                        invariant(id.length === 36, 'id must be a valid uuid');
                        invariant(version >= 0, 'version number must be greater than or equal to 0');

                        streamName = streamNameStrategy(aggregateType.aggregateName(), id);
                        logger.debug('stream from which events will be pulled: ' + streamName);
                        logger.trace('constructing aggregate');
                        aggregate = new aggregateType();

                        logger.debug('beginning loop to retrieve events');

                    case 11:
                        // specify number of events to pull. if number of events too large for one call use limit
                        logger.debug('begining new iteration');

                        sliceCount = sliceStart + options.readPageSize <= options.readPageSize ? options.readPageSize : version - sliceStart + 1;
                        logger.trace('number of events to pull this iteration: ' + sliceCount);
                        logger.trace('number of events to pull this iteration: ' + sliceStart);
                        // get all events, or first batch of events from GES

                        logger.info('about to pull events for ' + aggregateType + ' from stream ' + streamName);
                        context$3$0.next = 18;
                        return regeneratorRuntime.awrap(readStreamEventsForwardPromise(streamName, {
                            start: sliceStart,
                            count: sliceCount
                        }));

                    case 18:
                        currentSlice = context$3$0.sent;

                        if (!(currentSlice.Status == 'StreamNotFound')) {
                            context$3$0.next = 21;
                            break;
                        }

                        throw new Error('Aggregate not found: ' + streamName);

                    case 21:
                        if (!(currentSlice.Status == 'StreamDeleted')) {
                            context$3$0.next = 23;
                            break;
                        }

                        throw new Error('Aggregate Deleted: ' + streamName);

                    case 23:

                        logger.info('events retrieved from stream: ' + streamName);
                        sliceStart = currentSlice.NextEventNumber;
                        logger.trace('new sliceStart calculated: ' + sliceStart);

                        logger.debug('about to loop through and apply events to aggreagate');
                        currentSlice.Events.forEach(function (e) {
                            return aggregate.applyEvent(GesEvent.gesEventFromStream(e, 'eventTypeName'));
                        });
                        logger.info('events applied to aggregate');

                    case 29:
                        if (version >= currentSlice.NextEventNumber && !currentSlice.IsEndOfStream) {
                            context$3$0.next = 11;
                            break;
                        }

                    case 30:
                        context$3$0.next = 36;
                        break;

                    case 32:
                        context$3$0.prev = 32;
                        context$3$0.t0 = context$3$0['catch'](2);

                        logger.error('error retrieving aggreage: ' + context$3$0.t0);
                        throw context$3$0.t0;

                    case 36:
                        return context$3$0.abrupt('return', aggregate);

                    case 37:
                    case 'end':
                        return context$3$0.stop();
                }
            }, null, this, [[2, 32]]);
        }

        function save(aggregate, commitId, _metadata) {
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
                invariant(aggregate.isAggregateBase && aggregate.isAggregateBase(), 'aggregateType must inherit from AggregateBase');

                if (!aggregate._id) {
                    aggregate._id = uuid.v1();
                }
                // standard data for metadata portion of persisted event
                metadata = {
                    // handy tracking id
                    commitIdHeader: commitId || uuid.v1(),
                    // type of aggregate being persisted
                    aggregateTypeHeader: aggregate.constructor.name
                };
                logger.debug('default metadata:' + metadata);

                // add extra data to metadata portion of persisted event
                _.assign(metadata, _metadata);
                logger.debug('merged metadata: ' + metadata);

                streamName = streamNameStrategy(aggregate.constructor.name, aggregate._id);
                logger.debug('gesRepo calling save with params:' + aggregate + ', ' + commitId + ', ' + _metadata);
                logger.trace('retrieving uncommited events');
                newEvents = aggregate.getUncommittedEvents();

                originalVersion = aggregate._version - newEvents.length;
                logger.trace('calculating original version number:' + aggregate._version + ' - ' + newEvents.length + ' = ' + originalVersion);
                expectedVersion = originalVersion == 0 ? -1 : originalVersion - 1;
                logger.trace('calculating expected version :' + expectedVersion);

                logger.debug('creating EventData for each event');
                events = newEvents.map(function (x) {
                    return new EventData(x.eventTypeName, x.data, metadata);
                });
                logger.trace('EventData created for each event');

                appendData = {
                    expectedVersion: expectedVersion,
                    events: events
                };
                logger.debug('event data for posting created: ' + JSON.stringify(appendData));
                logger.debug(appendData);

                logger.trace('about to append events to stream');
                result = appendToStreamPromise(streamName, appendData);
                logger.debug('events posted to stream:' + streamName);

                logger.trace('clear uncommitted events form aggregate');
                aggregate.clearUncommittedEvents();
                //largely for testing purposes
                return result;
            } catch (error) {
                throw error;
            }
        }

        return {
            getById: getById,
            save: save
        };
    };
};

//validate

//validate