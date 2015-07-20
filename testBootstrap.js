/**
 * Created by rharik on 6/23/15.
 */
var bootstrap = require('DAGon');

module.exports = new bootstrap(x=>
    x.pathToRoot(__dirname)
        .requireDirectoryRecursively('./src')
        .forDependencyParam('testAgg').requireThisInternalModule("/unitTests/mocks/testAgg")
        .forDependencyParam('testAggNoCMDHandlers').requireThisInternalModule("/unitTests/mocks/testAggNoCMDHandlers")
        .forDependencyParam('testAggNoEventHandlers').requireThisInternalModule("/unitTests/mocks/testAggNoEventHandlers")
        .forDependencyParam('TestEventHandler').requireThisInternalModule("/unitTests/mocks/TestEventHandler")
        .forDependencyParam('gesclient').requireThisInternalModule("/unitTests/mocks/gesClientMock")
        .replace('lodash').withThis('_')
        .replace('bluebird').withThis('Promise')
        .complete());


