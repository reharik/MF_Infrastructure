/**
 * Created by rharik on 6/23/15.
 */
var container = require('./src/dependz/Container');


module.exports =  new container(x=>
        x.pathToPackageJson('/package.json')
            .replace('lodash').withThis('_')
            .replace('bluebird').withThis('Promise')
            .forDependencyParam('TestEventHandler').requireThisInternalModule("/unitTests/mocks/TestEventHandler")
            .complete());
