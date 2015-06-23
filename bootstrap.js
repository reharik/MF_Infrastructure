/**
 * Created by rharik on 6/23/15.
 */
var bootstrapper = require('./src/IOC/bootstrapper');

module.exports ={
    start:function(){
        if(!global.container) {
            console.log('loading dependencies');
            bootstrapper.start('./package.json');
        }else {
            console.log('global.container already loaded');
        }
    },
    inject:function(substitutions){
        bootstrapper.inject(substitutions);
    }
};