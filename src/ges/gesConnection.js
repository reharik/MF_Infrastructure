
var ges = require('ges-client');
var config = require('config');

var connection;
var getConnection = function(){
    if(!connection){
        connection = ges({ip: config.get('eventstore.ip'), tcp: 1113})
    }
    return connection;
};
module.exports = getConnection();