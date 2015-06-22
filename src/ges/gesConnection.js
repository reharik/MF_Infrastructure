
var ges = require('ges-client');
var config = require('config');

var connection;
var getConnection = function(_logger){
    _logger.trace('accessing gesConnection');
    if(!connection){
        _logger.debug('creating gesConnection')
        connection = ges({ip: config.get('eventstore.ip'), tcp: 1113})
    }
    _logger.debug('gesConnection: '+connection);
    return connection;
};
module.exports = getConnection();