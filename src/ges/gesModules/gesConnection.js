
var ges = require('ges-client');
var config = require('config');

var connection;
var getConnection(){
    if(!this.connection){
        this.connection = ges({ip: config.get('eventstore.ip'), tcp: 1113})
    }
    return this.connection;
}
module.exports = this.getConnection();