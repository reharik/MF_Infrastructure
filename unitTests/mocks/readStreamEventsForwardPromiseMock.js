/**
 * Created by reharik on 6/10/15.
 */
var Promise = require('bluebird');

module.exports = function (result){
    return function(conn, name, skipTake) {
        console.log("result"+result);
        var data = JSON.stringify({eventName: "someEvent"});
        var newVar = !result ? {
            Status: 'OK',
            NextEventNumber:3,
            Events: [{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}}],
            IsEndOfStream: false
        } : result;
        return Promise.resolve(newVar);
    }
};