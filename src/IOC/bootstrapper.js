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
        //console.log(bootstrapper.whatDoIHave());
        //console.log(_type);
        return bootstrapper.getInstanceOf(_type).instance;
    };
    var whatDoIHave = function(){
        return bootstrapper.whatDoIHave();
    };
    var inject = function(dependencies){
        if(!_.isArray(dependencies)){ dependencies = [dependencies];}
        dependencies.forEach(d => {
            invariant(d.name, 'injected dependecy must have a name');
            invariant(d.instance || d.path, 'injected dependecy must have either an instance or a path');
        });
        bootstrapper.inject(dependencies);
    };
    return {
        initialize: initialize,
        getInstanceOf: getInstanceOf,
        whatDoIHave: whatDoIHave,
        inject: inject
    }
}();


class Bootstrapper{
    constructor(registryFunc) {
        var registryDSL = new RegistryDSL();
        this.registry = registryFunc(registryDSL);
        // analze path to see if it incluedes the package.json or just the path.
        // for now presuming it has the path
        // also presuming from app root
        var recur = recursion(this.registry);
        recur.prepareForRecursion();
        this.dependencyGraph = recur.kickOfRecursion();
    }

    getInstanceOf(_type){
        return this.dependencyGraph.find(x=>x.name == _type);
    }

    whatDoIHave(){
        return this.dependencyGraph.map(x=>{return {name:x.name, resolved:x.resolved}});//, instance:x.instance}});
    }

    inject(dependencies){
        // taking in an array here because we don't want to kick off the recursion for every injection
        var recur = recursion(this.registry);
        recur.prepareForRecursion();
        dependencies.forEach(x=>recur.inject(x));
        this.dependencyGraph = recur.kickOfRecursion();
    }
}

var recursion = function(_registry){
    var graph = [];
    var registry = _registry;
    var pjson = require(path.join(appRoot, registry.pathToJsonConfig));

    var prepareForRecursion = function(){
        validation.validatePJson(pjson);
        buildInitialList();
        processRegistryFile();
        validation.validateGraph(graph);
    };

    var kickOfRecursion = function(){
        recurseTree(graph);
        return graph;
    };

    var buildInitialList = function() {
        Object.keys(pjson.dependencies)
            .forEach(x=> {
                invariant(x && x.length > 1, 'Dependency must have a valid key ' + x);
                graph.push({
                    name: x.replace('-', ''), resolved: false, instance: function () {
                        return require(x)
                    }
                })
            });
        Object.keys(pjson.internalDependencies)
            .forEach(x=> {
                invariant(x && x.length > 1, 'Internal Dependency must have a valid key');
                invariant(pjson.internalDependencies[x] && pjson.internalDependencies[x].length > 2,
                    'Internal Dependency ' + x + ' must have a valid path');
                var instance = require(path.join(appRoot + pjson.internalDependencies[x]));
                graph.push({name: x, resolved: false, instance: instance})
            });
    };

    var recurseTree = function(items){
        return items.forEach(x=> {
            var children = getChildren(x);
            if (children && children.length > 0) {
                recurseTree(children);
            }
            resolveDependency(x);
        });
    };

    var getChildren = function(item) {
        if(item.resolved){return [];}
        var children = [];
        fnArgs(item.instance).forEach(depName => children.push(findDependencyFromGraph(depName,item.name)));
        return children;
    };

    var resolveDependency = function(item) {
        if (item.resolved) { return; }

        var itemsDependencies = [];
        fnArgs(item.instance).forEach(d=> itemsDependencies.push(findDependencyFromGraph(d, item.name).instance));
        item.resolved = true;
        var resolvedInstance = itemsDependencies.length>0 ? item.instance.apply(item.instance, itemsDependencies) : item.instance();
        item.instance = resolvedInstance;
    };

    var findDependencyFromGraph = function(dependencyName, callingFunction) {
        var dependency = graph.find(x=>x.name == dependencyName);
        invariant(dependency,'Module '+callingFunction+' has a dependency that can not be resolved: '+dependencyName);
        return dependency;
    };

    var processRegistryFile = function() {
        registry.dependencyDeclarations.forEach(x=>{
            inject(x);
        });
        registry.renamedDeclarations.forEach(x=> {
            var target = graph.find(i=>i.name == x.oldName);
            if(target) {target.name = x.name}
        });
    };



    var updateDependency = function (target, dependency) {
        target.instance = dependency.instance;
    };

    var addNewDependency = function (dependency) {
        var newDep= {
            name: dependency.name,
            instance: dependency.instance
        };
        graph.push(newDep);
    };

    var inject = function(dependency){
        if(dependency.path){
            dependency.instance = require(path.join(appRoot + dependency.path));
        }
        if(!_.isFunction(dependency.instance)) {
            dependency.instance = function () {return dependency.instance; };
        }

        var target = graph.find(x=>x.name == dependency.name);
        if(target) {updateDependency(target, dependency);}
        else{addNewDependency(dependency);}


    };

    return {
        prepareForRecursion:prepareForRecursion,
        kickOfRecursion:kickOfRecursion,
        inject:inject
    }
};

var validation = {
    validateGraph(graph) {
        graph.forEach(x=>{
            invariant(x.name && x.name.length>0, 'Dependency must have a valid name property');
            invariant(x.instance && _.isFunction(x.instance), 'Dependency '+x.name+' does not have an instance that is a function');
        })
    },
    validatePJson(pjson) {
        //make tis more robust;
        Object.keys(pjson.internalDependencies)
            .forEach(x=> invariant(pjson.internalDependencies[x].length>1, 'internalDependency '+x+'must have valid path'));
    }
};

module.exports = container;