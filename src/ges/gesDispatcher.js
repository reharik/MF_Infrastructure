/**
 * Created by rharik on 6/18/15.
 */

module.exports = function(config,
                          invariant,
                          _,
                          rx,
                          GesEvent,
                          gesclient,
                          gesConnection,
                          logger,
                          bufferToJson) {
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

        //TODO this will go in the app setup
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
            //this.setMetadata();

            var subscription = this.connection.subscribeToAllFrom();
            var relevantEvents = rx.Observable.fromEvent(subscription, 'event')
                .filter(this.filterEvents, this)
                .map(this.createGesEvent, this);

            relevantEvents.subscribe(vent => this.serveEventToHandlers(vent,this.options.handlers),
                error => { throw error; }
            );

        }

        createGesEvent(payload){
            logger.debug('event passed through filter');
            var vent = new GesEvent(bufferToJson(payload.OriginalEvent.Metadata)[this.options.targetTypeName],
                payload.OriginalPosition,
                payload.OriginalEvent.Metadata,
                payload.OriginalEvent.Data);
            logger.info('event transfered into gesEvent: '+JSON.stringify(vent));
            return vent;
        }

        filterEvents(payload) {
            logger.info('event received by dispatcher');
            logger.trace('filtering event for system events ($)');
            if (!payload.Event.EventType.startsWith('$')) {
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

            var metadata = bufferToJson(payload.OriginalEvent.Metadata);
            if (!metadata || !metadata[this.options.targetTypeName]) {
                return false;
            }

            logger.trace('event has proper targetTypeName');
            return true;
        }

        serveEventToHandlers(vent, handlers) {
            logger.info('looping through event handlers');

            handlers
                .filter(h=> {
                    logger.info('calling event handler :' + h.eventHandlerName);
                    h.handlesEvents.filter(he=>he == vent.eventName)
                })
                .forEach(m=> {
                    logger.debug('event handler does handle event type: ' + vent.eventName);
                    m.handle(vent);
                    logger.debug('event handler finished handleing event');
                });

            logger.info('event processed by dispatcher');
        }
    }
};