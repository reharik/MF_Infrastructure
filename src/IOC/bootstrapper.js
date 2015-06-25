/**
 * Created by rharik on 6/23/15.
 */
var path = require('path');
var _ = require('lodash');
var RegistryDSL = require('./RegistryDSL');
var fnArgs = require('fn-args');
var appRoot = path.resolve('./');
var invariant = require('invariant');



var container = function(){
    var bootstrapper;
    var initialize = function(registryFunc) {
        bootstrapper = new Bootstrapper(registryFunc);
    };
    var getInstanceOf = function(_type){
        return bootstrapper.getInstanceOf(_type).instance;
    };
    return {
        initialize: initialize,
        getInstanceOf: getInstanceOf
    }
}();


class Bootstrapper{
    constructor(registryFunc) {
        this.dependencyGraph = [];
        var registryDSL = new RegistryDSL();
        var registry = registryFunc(registryDSL);
        // analze path to see if it incluedes the package.json or just the path.
        // for now presuming it has the path
        // also presuming from app root
        this.pjson = require(path.join(appRoot,registry.pathToJsonConfig));
        this.validatePJson();
        this.explicitOverrides = registry.dependencyDeclarations;
        this.processDependencies();
    }

    processDependencies(){
        this.dependencyGraph = this.getKeys(this.pjson.dependencies)
            .map(x=> {
                invariant(x && x.length>1,'Dependency must have a valid key '+x);
                return {name:x.replace('-',''), resolved:false, instance:function(){return require(x)}}})
            .concat(this.getKeys(this.pjson.internalDependencies)
                .map(x=> {
                    invariant(x && x.length>1,'Internal Dependency must have a valid key');
                    invariant(this.pjson.internalDependencies[x] && this.pjson.internalDependencies[x].length>2,'Internal Dependency '+x+' must have a valid path');
                    var instance = require(path.join(appRoot + this.pjson.internalDependencies[x]));
                    return {name:x, resolved:false, instance: instance}}));
        this.validateGraph();
        this.dependencyGraph = this.recurseTree(this.dependencyGraph);
        console.log("this.dependencyGraph2");
        console.log(this.dependencyGraph);
    }

    getKeys(obj){
        return Object.keys(obj);
    }

    recurseTree(items){
        return items.map(x=> {
            var children = this.getChildren(x);
            if (children && children.length > 0) {
                this.recurseTree(children);
            }
            return this.resolveDependency(x);
        });
    }

    getChildren(item) {
        var children = fnArgs(item.instance)
            .filter(d => this.dependencyGraph.some(r=> r.name == d ))
            .map(x=>this.dependencyGraph.find(m=>m.name == x));
        return children;
    }

    resolveDependency(item) {
        if(item.resolved){return item;}
         //var override = this.explicitOverrides.find(x=>x.name == item.name);
        //if(override){
        //    return resolveOverriddenDependency(override);
        //}else{
            var fnArgs2 = fnArgs(item.instance);
            var map2 = fnArgs2.map(d => {
                var findDependencyFromGraph2 = this.findDependencyFromGraph(d, item.name);
                return findDependencyFromGraph2.instance});
        //console.log(item.instance);
        //console.log(fnArgs2);
        //console.log(map2);
        console.log(map2);
            var instance2 = item.instance.apply(item.instance, map2);
            var newVar = {
                name: item.name,
                resolved: true,
                instance: instance2
            };
         if(!newVar){throw new Error(item)}
            return newVar;
        //}
    }

    findDependencyFromGraph(dependencyName, callingFunction) {
        var dependency = this.dependencyGraph.find(x=>x.name == dependencyName);
        invariant(dependency,'Module '+callingFunction+' has a dependency that can not be resolved: '+dependencyName);
        console.log(dependency);
        return dependency;
    }

    //resolveOverriddenDependency(override) {
    //    override.instance = require(override.path);
    //    return {
    //        name: override.name,
    //        resolved: true,
    //        instance: override.instance(fnArgs(override.instance).map(d => this.dependencyGraph.find(x=>x.name == d).instance))
    //    };
    //}

    getInstanceOf(_type){
        return this.dependencyGraph.find(x=>x.name == _type);
    }

    validatePJson() {
        //make tis more robust;
        this.getKeys(this.pjson.internalDependencies)
            .forEach(x=> invariant(this.pjson.internalDependencies[x].length>1, 'internalDependency '+x+'must have valid path'));
    }

    validateGraph() {
        this.dependencyGraph.forEach(x=>{
            invariant(x.name && x.name.length>1, 'Dependency must have a valid name property');
            invariant(x.instance && _.isFunction(x.instance), 'Dependency '+x.name+' does not have an instance that is a function');
        })
    }
}

module.exports = container;