/**
 * Created by rharik on 6/23/15.
 */
var path = require('path');
var appRoot = path.resolve('./');

module.exports = function(){
    var start = function(pathToPackageJson){
        loadDependencies(pathToPackageJson);
    };
    var pjson;
    var loadDependencies = function(pathToPackageJson){
        // analze path to see if it incluedes the package.json or just the path.
        // for now presuming it has the path
        // also presuming from app root
        pjson = require(path.join(appRoot,pathToPackageJson));
        global.container={};

        Object.keys(pjson.dependencies).map(x=>{
            var clean = x.replace('-','');
            if(!global.container[clean]) {
                global.container[clean] = require(x);
            }
        });
        if(pjson.internalDependencies) {
            Object.keys(pjson.internalDependencies).map(x=> {
                if (!global.container[x]) {
                    var pathToDep =path.join(appRoot,pjson.internalDependencies[x]);
                    global.container[x] = require(pathToDep);
                }
            });
        }
        Object.keys(global.container).map(x=>console.log(x));
    };

    var inject = function(substitutions){
        substitutions.forEach(s => Object.keys(s).map(x=> {
            console.log(x);
            var pathToDep =path.join(appRoot,s[x]);
            global.container[x] = require(pathToDep);
            console.log(global.container[x] );
        }));

        // do a diff or something so you have a collection of the internalDependencies minus th substitutions.

        if(pjson.internalDependencies) {
            Object.keys(pjson.internalDependencies).map(x=> {
                    var pathToDep =path.join(appRoot,pjson.internalDependencies[x]);
                    global.container[x] = require(pathToDep);
            });
        }
    };
    return {start:start,
            inject:inject};
}();