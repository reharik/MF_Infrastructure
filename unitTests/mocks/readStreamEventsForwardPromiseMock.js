/**
 * Created by reharik on 6/10/15.
 */
var Promise = require('bluebird');
var Vent = require('../../src/models/GesEvent');
var data = JSON.stringify(new Vent('someEvent',null,null,{blah:'blah'}));
var _result = {
    Status: 'OK',
    NextEventNumber:3,
    Events: [{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}},{Event:{EventName:'someEvent',Data: data}}],
    IsEndOfStream: false
};

module.exports = {
    setResult :function (result){_result = result;},
    mock: function(conn, name, skipTake) {
            return Promise.resolve(_result);
        }
};
