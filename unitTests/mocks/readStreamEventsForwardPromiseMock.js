/**
 * Created by reharik on 6/10/15.
 */

module.exports = function(bluebird,GesEvent) {
    var data = JSON.stringify(new GesEvent('someEventNotificationOn',null,null,{blah:'blah'}));
    var _result = {
        Status: 'OK',
        NextEventNumber:3,
        Events: [{Event:{EventName:'someEventNotificationOn',Data: data}},{Event:{EventName:'someEventNotificationOn',Data: data}},{Event:{EventName:'someEventNotificationOn',Data: data}}],
        IsEndOfStream: false
    };
    return {
        setResult: function (result) {
            _result = result;
        },
        mock: function (conn, name, skipTake) {
            return bluebird.resolve(_result);
        }
    }
};
