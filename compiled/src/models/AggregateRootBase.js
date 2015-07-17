/**
 * Created by reharik on 6/8/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = function (invariant) {
    return (function () {
        function AggregateRootBase() {
            _classCallCheck(this, AggregateRootBase);

            this._id;
            this._version = 0;
            this.uncommittedEvents = [];

            invariant(this.commandHandlers, 'An aggregateRoot requires commandHandlers');
            invariant(this.applyEventHandlers, 'An aggregateRoot requires applyEventHandlers');

            Object.assign(this, this.commandHandlers());
        }

        _createClass(AggregateRootBase, [{
            key: 'applyEvent',
            value: function applyEvent(event) {
                var key = Object.keys(this.applyEventHandlers()).find(function (x) {
                    return x === event.eventTypeName;
                });
                if (key) {
                    this.applyEventHandlers()[key](event);
                }
                this._version++;
            }
        }, {
            key: 'raiseEvent',
            value: function raiseEvent(event) {
                this.applyEvent(event);
                this.uncommittedEvents.push(event);
            }
        }, {
            key: 'getUncommittedEvents',
            value: function getUncommittedEvents() {
                return this.uncommittedEvents;
            }
        }, {
            key: 'clearUncommittedEvents',
            value: function clearUncommittedEvents() {
                this.uncommittedEvents = [];
            }
        }, {
            key: 'isAggregateBase',
            value: function isAggregateBase() {
                return true;
            }
        }], [{
            key: 'isAggregateBase',
            value: function isAggregateBase() {
                return true;
            }
        }]);

        return AggregateRootBase;
    })();
};