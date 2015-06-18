var invariant = require('invariant');

module.exports = class gesEvent{
    constructor(_eventName, _originalPosition, _metadata, _data){
        this.eventName = _eventName;
        this.originalPosition = _originalPosition;
        this.metadata = _metadata;
        this.data = _data;
        invariant(this.eventName, 'gesEvent must have an eventName');
        invariant(this.originalPosition, 'gesEvent must have an originalPosition');
        invariant(this.metadata, 'gesEvent must have a metadata');
        invariant(this.data, 'gesEvent must have a data');
    }
    getEventName(){ return this.eventName; }
    getOriginalPosition(){return this.originalPosition;}
    getMetadata(){return this.metadata;}
    getData(){return this.data;}
};