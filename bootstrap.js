/**
 * Created by rharik on 6/23/15.
 */
var container = require('DAGon');

//
//module.exports =  function(optionalRegistry) {
//    var rootRegistry = x=>
//        x.pathToRoot(__dirname)
//            .requireDirectoryRecursively('./src')
//            .replace('lodash').withThis('_')
//            .replace('bluebird').withThis('Promise')
//            .complete();
//
//    var registries = [rootRegistry, optionalRegistry];
//    return new container(registries);
//};

module.exports =  function() {
    var rootRegistry = x=>
        x.pathToRoot(__dirname)
            .requireDirectoryRecursively('./src')
            .rename('lodash').withThis('_')
            .rename('bluebird').withThis('Promise')
            .complete();

    var registries = [rootRegistry];
    return new container(registries);
};
