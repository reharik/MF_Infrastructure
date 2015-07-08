/**
 * Created by rharik on 6/23/15.
 */
var container = require('./src/dependz/Container');


module.exports =  new container(x=>
        x.pathToPackageJson('/package.json')
            .replace('lodash').withThis('_')
            .replace('bluebird').withThis('Promise')
            .forDependencyParam('TestAgg').requireThisInternalModule("/unitTests/mocks/testAgg")
            .forDependencyParam('TestEventHandler').requireThisInternalModule("/unitTests/mocks/TestEventHandler")
            .forDependencyParam('NotificationHandler').requireThisInternalModule("/unitTests/mocks/NotificationHandler")
            .complete());
