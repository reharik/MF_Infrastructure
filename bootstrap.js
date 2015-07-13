/**
 * Created by rharik on 6/23/15.
 */
var container = require('./src/dependz/Container');


module.exports =  function(optionalRegistry) {
    var rootRegistry = x=>
        x.pathToPackageJson('/package.json')
            .replace('lodash').withThis('_')
            .replace('bluebird').withThis('Promise')
            .complete();

    var registries = [rootRegistry, optionalRegistry];
    return new container(registries);
};
