/**
 * Created by reharik on 8/13/15.
 */

module.exports = function(appendToStreamPromise,
                            gesConnection,
                            gesDispatcher,
                            gesEventHandlerBase,
                            gesRepository,
                          AggregateRootBase,
                          EventData,
                          GesEvent,
                          NotificationEvent,
                          readModelRepository
){
    return {
        appendToStreamPromise:appendToStreamPromise,
        gesConnection:gesConnection,
        gesDispatcher:gesDispatcher,
        gesEventHandlerBase:gesEventHandlerBase,
        gesRepository:gesRepository,
        AggregateRootBase:AggregateRootBase,
        EventData:EventData,
        GesEvent:GesEvent,
        NotificationEvent:NotificationEvent,
        readModelRepository:readModelRepository
    };
};