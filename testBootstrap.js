/**
 * Created by rharik on 6/23/15.
 */
var bootstrap = require('DAGon');

module.exports = new bootstrap(x=>
    x.pathToRoot(__dirname)
        .requireDirectoryRecursively('./src')
        .for('gesConnection').callInitMethod('openConnection')
        .for('testAgg').require("/unitTests/mocks/testAgg")
        .for('testAggNoCMDHandlers').require("/unitTests/mocks/testAggNoCMDHandlers")
        .for('testAggNoEventHandlers').require("/unitTests/mocks/testAggNoEventHandlers")
        .for('TestEventHandler').require("/unitTests/mocks/TestEventHandler")
        .for('gesclient').require("/unitTests/mocks/gesClientMock")
        .rename('lodash').withThis('_')
        .rename('bluebird').withThis('Promise')
        .complete());


