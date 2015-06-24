/**
 * Created by rharik on 6/23/15.
 */
var path = require('path');
var _ = require('lodash');
var fnArgs = require('fn-args');
var appRoot = path.resolve('./');


module.exports = function(){
    var pjson;
    var resolvedDeps = {};
    var unresolvedDeps = {};

    var start = function(pathToPackageJson){
        // analze path to see if it incluedes the package.json or just the path.
        // for now presuming it has the path
        // also presuming from app root
        pjson = require(path.join(appRoot,pathToPackageJson));
        loadOutsideDependencies();
        loadInsideDependencies();
        resolveInsideDependencies();
        return resolvedDeps;
    };

    var loadOutsideDependencies = function() {
        getKeys(pjson.dependencies).map(x=> {
            var clean = x.replace('-', '');
            if (!resolvedDeps[clean]) {
                resolvedDeps[clean] = require(x);
            }
        });
    };

    var loadInsideDependencies = function() {
        if(!pjson.internalDependencies) {
            return;
        }
        getKeys(pjson.internalDependencies).map(x=> {
            var pathToDep =path.join(appRoot,pjson.internalDependencies[x]);
            unresolvedDeps[x] = require(pathToDep);
        });
    };

    var checkIfAllDependenciesRegistered = function(module, avaliableDependencies){
        if(!fnArgs(module).every(arg => avaliableDependencies.some(dep => dep==arg))){
            throw(new Error('dependency is not registered'))
        }
    };

    var getArgs = function(module){
        return fnArgs(module).map(x=> resolvedDeps[x]);
    };

    var resolveAndAddToCollection = function(moduleKey){
        var module = unresolvedDeps[moduleKey];
        resolvedDeps[moduleKey] = module.apply(module, getArgs(module))
    };

    var getKeys = function(obj){
        return Object.keys(obj).map(x=>obj[x]);
    };
    var resolveInsideDependencies = function(){
        if(_.isEmpty(unresolvedDeps)){return;}

        var availableDependencies = _.union(getKeys(unresolvedDeps), getKeys(resolvedDeps));

        unresolvedDeps.forEach(x=> checkIfAllDependenciesRegistered(x,availableDependencies));

        var stopLoop;
        while(!stopLoop){
            getKeys(unresolvedDeps).forEach(u=>{
                if(fnArgs(unresolvedDeps[u]).every(getKeys(resolvedDeps))){
                    resolveAndAddToCollection(u);
                    delete unresolvedDeps[u];
                }
            });
            stopLoop = getKeys(unresolvedDeps).length>0;
        }
    };

    var inject = function(substitutions){
        //var keys = substitutions.map(s => Object.keys(s).map(x=> {
        //    console.log(x);
        //    var pathToDep =path.join(appRoot,s[x]);
        //    global.container[x] = require(pathToDep);
        //    console.log(global.container[x] );
        //    return x;
        //}));
        //
        //if(pjson.internalDependencies) {
        //    require.cache = {}
        //    Object.keys(pjson.internalDependencies).map(x=> {
        //        if(!_.some(keys, s=> s == x )) {
        //            console.log("rebuilding; "+x);
        //            var pathToDep = path.join(appRoot, pjson.internalDependencies[x]);
        //            global.container[x] = require(pathToDep);
        //        }
        //    });
        //}
    };
    return {start:start,
            inject:inject};
}();