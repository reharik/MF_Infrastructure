


module.exports = function() {
    return class GesEvent {
        constructor(_eventTypeName, _metadata, _data, _originalPosition) {
            this.eventTypeName = Buffer.isBuffer(_eventTypeName) ? JSON.parse(_eventTypeName.toString('utf8')) : _eventTypeName;
            this.metadata = Buffer.isBuffer(_metadata) ? JSON.parse(_metadata.toString('utf8')) : _metadata;
            this.data = Buffer.isBuffer(_data) ? JSON.parse(_data.toString('utf8')) : _data;
            // this is provided by the repository or the distributer
            this.originalPosition = _originalPosition;
        }
    };
};