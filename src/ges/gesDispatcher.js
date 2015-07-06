/**
 * Created by rharik on 6/18/15.
 */

module.exports = function(config, invariant, _, GesEvent, gesclient, gesConnection, logger, JSON) {
    return class gesDispatcher {
        constructor(_options) {
            logger.trace('constructing gesDispatcher base version');
            logger.debug('gesDispatcher base options passed in ' + _options);

            this.options = {
                stream: '$all',
                targetTypeName: 'eventTypeName'
            };
            _.assign(this.options, _options);
            logger.debug('gesDispatcher base options after merge ' + this.options);
            invariant(
                this.options.handlers,
                "Dispatcher requires at least one handler"
            );
            this.connection = gesConnection;
        }
        getConn(){
            return this.connection;
        }

        setMetadata() {
            var setData = {
                expectedMetastreamVersion: -1
                , metadata: gesclient.createStreamMetadata({
                    acl: {
                        readRoles: gesclient.systemRoles.all
                    }
                })
                , auth: {
                    username: gesclient.systemUsers.admin
                    , password: gesclient.systemUsers.defaultAdminPassword
                }
            };

            this.connection.setStreamMetadata('$all', setData)
        }

        startDispatching() {
            logger.info('startDispatching called');
            this.setMetadata();
            var subscription = this.connection.subscribeToAllFrom();
            subscription.on('event', function (payload) {
                logger.info('event received by dispatcher');
                this.handleEvent(payload);
                logger.info('event processed by dispatcher');
            }.bind(this))
        }

        handleEvent(payload) {
            console.log(payload.OriginalEvent.Metadata[this.options.targetTypeName]);
            logger.debug('filtering event before processing');
            if (!this.filterEvents(payload)) {
                logger.trace('event filtered out by dispatcher');
                return;
            }
            logger.debug('event passed through filter');
            var vent = new GesEvent(payload.OriginalEvent.Metadata[this.options.targetTypeName],
                payload.OriginalPosition,
                payload.OriginalEvent.Metadata,
                payload.OriginalEvent.Data);
            logger.info('event transfered into gesEvent: '+JSON.stringify(vent));

            logger.info('looping through event handlers');
            this.options.handlers.forEach(h=> {
                logger.info('calling event handler :' + h.eventHandlerName);
                if (!h.handlesEvents.find(x => x === vent.eventName)) {
                    logger.trace('event handler does not handle event type: ' + vent.eventName);
                    return;
                }
                logger.debug('event handler does handle event type: ' + vent.eventName);
                h.handleEvent(vent);
                logger.debug('event handler finished handleing event');

            });
        }

        filterEvents(payload) {
            logger.trace('filtering event for system events ($)');
            if (payload.Event.EventType.startsWith('$')) {
                return false;
            }
            logger.trace('event passed filter for system events ($)');
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
            logger.trace('filtering event for targetTypeName');
            if (_.isEmpty(payload.OriginalEvent.Metadata[this.options.targetTypeName])) {
                return false;
            }
            logger.trace('event has proper targetTypeName');
            return true;
        }


    }
};