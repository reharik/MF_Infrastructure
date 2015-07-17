/**
 * Created by rharik on 6/23/15.
 */
'use strict';

var container = require('./node_modules/dependz/index');

module.exports = function (optionalRegistry) {
    var rootRegistry = function rootRegistry(x) {
        return x.pathToRoot(__dirname).replace('lodash').withThis('_').replace('bluebird').withThis('Promise').makeThisDependencyASingleton('gesConnection').complete();
    };

    var registries = [rootRegistry, optionalRegistry];
    return new container(registries);
};