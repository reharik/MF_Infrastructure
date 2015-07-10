/**
 * Created by rharik on 6/12/15.
 */

module.exports = function(uuid) {
    return function EventData(eventTypeName, metadata, data) {
        metadata = metadata || {};
        data = JSON.stringify(data || {});
        metadata = JSON.stringify(metadata||{});
        //metadata.eventTypeName = eventTypeName;

        return {
            EventId: uuid.v4(),
            Type: eventTypeName,
            IsJson: true,
            Data: data,
            Metadata: metadata
        };
    };
};