
var Promise = require('bluebird');
var ges = require('ges-client');

module.exports = function(options) {
    return  new Promise(function (resolve, reject) {
        ges(options, function (err, con) {
            if (err) {
                reject(err);
            } else {
                resolve(con);
            }
        });
    });
};