/**
 * Created by reharik on 6/10/15.
 */
var Promise = require('bluebird');

module.exports = function(connection, streamName, skipTake){
    return new Promise(function(resolve, reject){
        connection.ReadStreamEventsForward(streamName, skipTake ,function(err, results) {
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        });
    })
};