/**
 * Created by reharik on 8/13/15.
 */

var Container = require('dagon');
module.exports = function(options) {
    return new Container(x=>
        x.pathToRoot(__dirname)
            .requireDirectoryRecursively('./src')
            .for('gesConnection').instantiate(x=>x.initializeWithMethod('openConnection').withInitParameters(options))
            .for('gesRepository').instantiate(x=>x.asFunc())
            .for('readModelRepository').require("/src/postgres/postgresRepository")
            .for('readModelRepository').instantiate(x=>x.asFunc().withParameters(options))
            .rename('lodash').withThis('_')
            .rename('bluebird').withThis('Promise')
            .complete());
};