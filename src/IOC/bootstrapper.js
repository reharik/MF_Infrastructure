/**
 * Created by rharik on 6/23/15.
 */
var path = require('path');
var _ = require('lodash');
var fnArgs = require('fn-args');
var appRoot = path.resolve('./');




var container = function(){
    var bootstrapper;
    initialize(registryFunc) {
        bootstrapper = new Bootstrapper(registryFunc);
        bootstrapper.init();
    }
    getInstanceOf(_type){
        return bootstrapper.getInstanceOf(_type);
    }
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
        this.explicitOverrides = registry.dependencyDeclarations;
        processDependencies();
    }

    processDependencies(){
        this.dependencyGraph = getKeys(this.pjson.dependencies).map(x=> {return {name:x, resolved:false, instance:function(){return require(x)}}})
            .concat(getKeys(this.pjson.internalDependencies).map(x=> {return {name:x, resolved:false, instance:require(this.pjson.internalDependencies[x])}}));
        recurseTree(this.dependencyGraph);
    }

    recurseTree(items){
        items.map(x=>{
            var children = getUnResolvedChildren(x);
            if(children && children.length>0){
                recurseTree(children);
            }else{
                return resolveDependency(x);
            }
        })
    }

    getUnResolvedChildren(item) {
        return fnArgs(item.instance).filter(d => this.dependencyGraph.some(r=> r.name == d && !r.resolved ));
    }

    resolveDependency(item) {
        var override = this.explicitOverrides.find(x=>x.name == item.name);
        if(override){
            override.instance = require(override.path);
            return {name:override.name,
                resolved:true,
                instance:override.instance(fnArgs(override.instance).map(d => this.dependencyGraph.find(x=>x.name==d).instance))};
        }else{
            return {name:item.name,
                resolved:true,
                instance:item.instance(fnArgs(item.instance).map(d => this.dependencyGraph.find(x=>x.name==d).instance))};
        }
    }

};