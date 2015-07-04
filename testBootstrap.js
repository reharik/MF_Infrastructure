/**
 * Created by rharik on 6/23/15.
 */
var container = require('./src/dependz/Container');

module.exports = new container(x=>
        x.pathToPackageJson('../package.json')
        .forDependencyParam('testAgg').requireThisInternalModule("/unitTests/mocks/testAgg")
        .forDependencyParam('testAggNoCMDHandlers').requireThisInternalModule("/unitTests/mocks/testAggNoCMDHandlers")
        .forDependencyParam('testAggNoEventHandlers').requireThisInternalModule("/unitTests/mocks/testAggNoEventHandlers")
        .forDependencyParam('TestEventHandler').requireThisInternalModule("/unitTests/mocks/TestEventHandler")
        .forDependencyParam('gesclient').requireThisInternalModule("/unitTests/mocks/gesClientMock")
        .replace('lodash').withThis('_')
        .replace('bluebird').withThis('Promise')
        .complete());

