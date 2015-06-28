

module.exports = function(gesclient, config, logger) {
        var connection;
        logger.trace('accessing gesConnection');
        if (!connection) {
            logger.debug('creating gesConnection');
            connection = gesclient({ip: config.get('eventstore.ip'), tcp: 1113})
        }
        logger.debug('gesConnection: ' + connection);

    return connection;
};