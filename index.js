/**
 * Created by reharik on 7/12/15.
 */

var bootstrap = require('./bootstrap');
var invariant = require('invariant');
    //return function (options) {
    //    invariant(options.registry,
    //    "You must provide a DAGon registry for such items as logger, idempotency, and streamName Strategies");
        var container = bootstrap();
        var DDD = {
            gesConnection: container.getInstanceOf('gesConnection'),
            gesDispatcher: container.getInstanceOf('gesDispatcher'),
            gesEventHandlerBase: container.getInstanceOf('gesEventHandlerBase'),
            gesRepository: container.getInstanceOf('gesRepository'),
            readStreamEventsForwardPromise: container.getInstanceOf('readStreamEventsForwardPromise'),
            appendToStreamPromise: container.getInstanceOf('appendToStreamPromise'),
            AggregateRootBase: container.getInstanceOf('AggregateRootBase'),
            EventData: container.getInstanceOf('EventData'),
            GesEvent: container.getInstanceOf('GesEvent'),
            NotificationEvent: container.getInstanceOf('NotificationEvent')
        };
    //}
module.exports = DDD;
