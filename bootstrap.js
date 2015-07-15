/**
 * Created by rharik on 6/23/15.
 */
var container = require('./node_modules/dependz/index');


module.exports =  function(optionalRegistry) {
    var rootRegistry = x=>
        x.pathToRoot(__dirname)
            .replace('lodash').withThis('_')
            .replace('bluebird').withThis('Promise')
            .complete();

    var registries = [rootRegistry, optionalRegistry];
    return new container(registries);
};
