"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function (bufferToJson) {
    return (function () {
        function GesEvent(_eventTypeName, _data, _metadata, _originalPosition) {
            _classCallCheck(this, GesEvent);

            this.eventTypeName = Buffer.isBuffer(_eventTypeName) ? bufferToJson(_eventTypeName) : _eventTypeName;
            this.metadata = Buffer.isBuffer(_metadata) ? bufferToJson(_metadata) : _metadata;
            this.data = Buffer.isBuffer(_data) ? bufferToJson(_data) : _data;
            // this is provided by the repository or the distributer
            this.originalPosition = _originalPosition;
        }

        _createClass(GesEvent, null, [{
            key: "gesEventFromStream",
            value: function gesEventFromStream(sd, targetType) {
                return new GesEvent(bufferToJson(sd.OriginalEvent.Metadata)[targetType], sd.OriginalEvent.Data, sd.OriginalEvent.Metadata, sd.OriginalPosition);
            }
        }]);

        return GesEvent;
    })();
};