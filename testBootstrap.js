/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/IOC/bootstrapper');
var _ = require('lodash');


var bootstrap = {
        start: function () {
            this.container = {};
            if (_.isEmpty(this.container)) {
                bootstrapper.initialize(x=>{
                    return x.pathToJsonConfig('./package.json')
                        .forDependencyParam('testAgg').requireThisModule("/unitTests/mocks/testAgg")
                        .forDependencyParam('testAggNoCMDHandlers').requireThisModule("/unitTests/mocks/testAggNoCMDHandlers")
                        .forDependencyParam('testAggNoEventHandlers').requireThisModule("/unitTests/mocks/testAggNoEventHandlers")
                    .complete();
                });
                this.container = bootstrapper;
            }
        },
        container:{}
    };
module.exports = bootstrap;