


module.exports = function(uuid) {
    return class GesEvent {
        constructor() {
            this.eventType; //= Buffer.isBuffer(_eventType) ? JSON.parse(_eventType.toString('utf8')) : _eventType;
            this.originalPosition; // = _originalPosition;
            this.metadata;// = Buffer.isBuffer(_metadata) ? JSON.parse(_metadata.toString('utf8')) : _metadata;
        }
        setMetaData(_metadata){
            this.metadata = Buffer.isBuffer(_metadata) ? JSON.parse(_metadata.toString('utf8')) : _metadata;
        }

        setData(_data){
            var data = Buffer.isBuffer(_data) ? JSON.parse(_data.toString('utf8')) : _data;
            // apply all properties in data to this object
        }
    };
};


class MyEvent extends GesEvent {
    constructor(myvar1, myvar2){
        super();
        this.eventType = 'MyEvent'
        //more props
    }
}

//or
// put all props in data but I think that's ugly