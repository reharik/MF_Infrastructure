
//var bs = require('../../bootstrap');

var ges = global.container.gesclient;
var config = global.container.config;
var logger = global.container.logger;

var connection;
var getConnection = function(){
    logger.trace('accessing gesConnection');
    if(!connection){
        logger.debug('creating gesConnection');
        connection = ges({ip: config.get('eventstore.ip'), tcp: 1113})
    }
    logger.debug('gesConnection: '+connection);
    return connection;
};
module.exports = getConnection;