/**
 * Created by reharik on 6/14/15.
 */

var appendToStreamPromise =require('./gesModules/appendToStreamPromise');
var readStreamEventsForwardPromise =require('./gesModules/readStreamEventsForwardPromise');

module.exports={
    appendToStreamPromise:appendToStreamPromise,
    readStreamEventsForwardPromise:readStreamEventsForwardPromise
};