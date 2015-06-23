

var uuid = global.container.uuid;


module.exports = class gesEvent{
    constructor(_eventName, _originalPosition, _metadata, _data) {
        this.id = uuid.v1();
        this.eventName = _eventName;
        this.originalPosition = _originalPosition;
        this.metadata = _metadata;
        this.data = _data;
    }
};