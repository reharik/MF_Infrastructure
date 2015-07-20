/**
 * Created by rharik on 6/23/15.
 */
var container = require('DAGon');
console.log(__dirname);
module.exports =  new container(x=>
        x.pathToRoot(__dirname)
            .requireDirectoryRecursively('./src')
            .callInitMethod({method:'openConnection'})
            .rename('lodash').withThis('_')
            .rename('bluebird').withThis('Promise')
            .for('TestAgg').require("/unitTests/mocks/testAgg")
            .for('TestEventHandler').require("/unitTests/mocks/TestEventHandler")
            .for('NotificationHandler').require("/unitTests/mocks/NotificationHandler")
            .complete());
