/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/IOC/bootstrapper');

var bootstrap = function() {};
bootstrap.container = bootstrapper.container;
    start(){
        if(!container) {
            console.log('loading dependencies');
            bootstrapper.start('./package.json');
        }else {
            console.log('container already loaded');
        }
    }

};