/**
 * Created by reharik on 7/12/15.
 */

'use strict';

process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
var bootstrap = require('./bootstrap');
var invariant = require('invariant');
module.exports = function () {
    return function (options) {
        invariant(options.registry, 'You must provide a dependz registry for such items as logger, idempotency, and streamName Strategies');
        var container = bootstrap(options.registry);
        var config = container.getInstanceOf('config');
        config.util.extendDeep(options.configValues, configs);
        config.util.setModuleDefaults('DDD', options.configValues);

        return {
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
    };
};