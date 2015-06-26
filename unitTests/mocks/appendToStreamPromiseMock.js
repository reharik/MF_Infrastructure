/**
 * Created by rharik on 6/12/15.
 */

var Promise = require('bluebird');
module.exports = function(bluebird){
    var streamName='';
    var appendData={};
    return {
        mock:function(_streamName, _appendData) {
            streamName = _streamName;
            appendData = _appendData;
            return Promise.resolve({
                streamName: streamName,
                appendData: appendData
            })
        },
        appendedData:  {streamName:streamName, appendData: appendData}
    }
};