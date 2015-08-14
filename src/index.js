/**
 * Created by reharik on 8/13/15.
 */

var container = require('../bootstrap');
module.exports = function index(_options) {
    var options = {
        "eventstore": {
            "host": "eventstore",
            "systemUsers": {"admin": "admin"},
            "adminPassword": "changeit"
        },
        "postgres": {
            "connectionString": "postgres://postgres:password@postgres/",
            "postgres": "postgres",
            "methodFitness": "MethodFitness"
        }
    };
    _.assign(options, _options || {});
    var _container = container(options);
    return _container.getInstanceOf(entryPoint);
};