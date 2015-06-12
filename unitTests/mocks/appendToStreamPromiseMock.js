/**
 * Created by rharik on 6/12/15.
 */

var Promise = require('bluebird');

module.exports = function(conn, streamName, appendData) {
        return Promise.resolve({
            streamName:streamName,
            appendData: appendData
        });
};