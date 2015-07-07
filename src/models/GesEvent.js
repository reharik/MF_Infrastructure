


module.exports = function(uuid) {
    return class GesEvent {
        constructor(_eventName, _originalPosition, _metadata, _data) {
            this.id = uuid.v1();
            this.eventName = Buffer.isBuffer(_eventName) ? JSON.parse(_eventName.toString('utf8')) : _eventName;
            console.log(_eventName);
            console.log(this.eventName);
            this.originalPosition = _originalPosition;
            this.metadata = Buffer.isBuffer(_metadata) ? JSON.parse(_metadata.toString('utf8')) : _metadata;
            this.data = Buffer.isBuffer(_data) ? JSON.parse(_data.toString('utf8')) : _data;
        }
    };
};