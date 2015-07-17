/**
 * Created by rharik on 6/18/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = function (invariant, _, rx, GesEvent, gesclient, gesConnection, logger, bufferToJson) {
    return (function () {
        function gesDispatcher(_options) {
            _classCallCheck(this, gesDispatcher);

            logger.trace('constructing gesDispatcher base version');
            logger.debug('gesDispatcher base options passed in ' + _options);

            this.options = {
                stream: '$all',
                targetType: 'eventTypeName'
            };
            _.assign(this.options, _options);
            logger.debug('gesDispatcher base options after merge ' + this.options);
            invariant(this.options.handlers, 'Dispatcher requires at least one handler');
            this.connection = gesConnection;
        }

        _createClass(gesDispatcher, [{
            key: 'getConn',
            value: function getConn() {
                return this.connection;
            }
        }, {
            key: 'setMetadata',

            //TODO this will go in the app setup
            value: function setMetadata() {
                var setData = {
                    expectedMetastreamVersion: -1,
                    metadata: gesclient.createStreamMetadata({
                        acl: {
                            readRoles: gesclient.systemRoles.all
                        }
                    }),
                    auth: {
                        username: gesclient.systemUsers.admin,
                        password: gesclient.systemUsers.defaultAdminPassword
                    }
                };

                this.connection.setStreamMetadata('$all', setData);
            }
        }, {
            key: 'startDispatching',
            value: function startDispatching() {
                var _this = this;

                logger.info('startDispatching called');
                //this.setMetadata();
                var subscription = this.connection.subscribeToAllFrom();
                //var subscription = this.connection.subscribeToStreamFrom(this.options.stream);

                //Dispatcher gets raw events from ges in the EventData Form

                logger.debug('observable created');
                var relevantEvents = rx.Observable.fromEvent(subscription, 'event').filter(this.filterEvents, this).map(this.createGesEvent, this);
                relevantEvents.forEach(function (vent) {
                    return _this.serveEventToHandlers(vent, _this.options.handlers);
                }, function (error) {
                    throw error;
                });
            }
        }, {
            key: 'filterEvents',
            value: function filterEvents(payload) {
                //logger.info('event received by dispatcher');
                //logger.trace('filtering event for system events ($)');
                if (!payload.Event || !payload.Event.EventType || payload.Event.EventType.startsWith('$')) {
                    return false;
                }
                //logger.trace('event passed filter for system events ($)');
                logger.trace('filtering event for empty metadata');
                if (_.isEmpty(payload.OriginalEvent.Metadata)) {
                    return false;
                }
                logger.trace('event has metadata');
                logger.trace('filtering event for empty data');
                if (_.isEmpty(payload.OriginalEvent.Data)) {
                    return false;
                }
                logger.trace('event has data');
                logger.trace('filtering event for targetType');

                var metadata = bufferToJson(payload.OriginalEvent.Metadata);
                if (!metadata || !metadata[this.options.targetType]) {
                    return false;
                }

                logger.trace('event has proper targetType');
                return true;
            }
        }, {
            key: 'createGesEvent',
            value: function createGesEvent(payload) {
                logger.debug('event passed through filter');
                var vent = new GesEvent(bufferToJson(payload.OriginalEvent.Metadata)[this.options.targetType], payload.OriginalEvent.Data, payload.OriginalEvent.Metadata, payload.OriginalPosition);
                logger.info('event transfered into gesEvent: ' + JSON.stringify(vent));
                return vent;
            }
        }, {
            key: 'serveEventToHandlers',
            value: function serveEventToHandlers(vent, handlers) {
                logger.info('looping through event handlers');

                handlers.filter(function (h) {
                    logger.info('calling event handler :' + h.eventHandlerName);
                    return h.handlesEvents.find(function (he) {
                        return he == vent.eventTypeName;
                    });
                }).forEach(function (m) {
                    logger.debug('event handler does handle event type: ' + vent.eventTypeName);
                    m.handleEvent(vent);
                    logger.debug('event handler finished handleing event');
                });

                logger.info('event processed by dispatcher');
            }
        }]);

        return gesDispatcher;
    })();
};