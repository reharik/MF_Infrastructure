/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/IOC/bootstrapper');
var _ = require('lodash');


var bootstrap = {
        start: function () {
            this.container = {};
            if (_.isEmpty(this.container)) {
                bootstrapper.initialize(x=>x.pathToJsonConfig('./package.json').complete());
                this.container = bootstrapper;
            }
        },
        container:{}
    };
module.exports = bootstrap;