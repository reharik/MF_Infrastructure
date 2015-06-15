/**
 * Created by rharik on 6/12/15.
 */

module.exports = function EventData(eventId, type, data, metadata) {
    metadata = metadata || {};
    data = JSON.stringify(data || {});
    metadata = JSON.stringify(metadata);

    return {
        EventId: eventId,
        Type:  type,
        IsJson: true,
        Data: data,
        Metadata:metadata
    };
};
