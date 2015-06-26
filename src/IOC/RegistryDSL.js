/**
 * Created by rharik on 6/24/15.
 */

module.exports = class RegistryDSL{
    constructor(){
        this._pathToJsonConfig;
        this.dependencyDeclarations = [];
        this.declarationInProcess;
    }

    pathToJsonConfig(path){
        this._pathToJsonConfig = path;
        return this;
    }

    forDependencyParam(param){
        this.declarationInProcess ={
            paramName: param
        };
        return this;
    }

    requireThisModule(path){
        this.declarationInProcess.path=path;
        this.dependencyDeclarations.push(this.declarationInProcess);
        this.declarationInProcess = null;
        return this;
    }

    complete(){
        return {
            pathToJsonConfig:this._pathToJsonConfig,
            dependencyDeclarations:this.dependencyDeclarations
        };
    }
}