/**
 * Created by reharik on 6/10/15.
 */


var Subscription = require('./SubscriptionMock');

class gesConnectionMock{
    constructor(){
        this.subscription;
        this._appendToStreamShouldFail;
        this._readStreamEventForwardShouldFail;
        this.readStreamEventForwardResult;
    }
    subscribeToStream(){
        this.subscription = new Subscription();
        return this.subscription;
    }

    appendToStream(streamName, data, cb){
        console.log('mock append');

        var results = {streamName:streamName, data:data};
        if(this._appendToStreamShouldFail){ cb(results); }
        else { cb(null,results); }
    }

    readStreamEventsForward(streamName, skipTake, cb){
        console.log('mock read');
        var results = {streamName:streamName, skipTake:skipTake, result: this.readStreamEventForwardResult};
        if(this._readStreamEventForwardShouldFail){
            cb(this.readStreamEventForwardResult?this.readStreamEventForwardResult: results);
        }
        else {
            cb(null,this.readStreamEventForwardResult?this.readStreamEventForwardResult: results);
        }
    }
    readStreamEventForwardShouldReturnResult(result){
        console.log('result '+result);
        this.readStreamEventForwardResult = result;
    }
    readStreamEventForwardShouldFail(){this._readStreamEventForwardShouldFail=true;}
    appendToStreamShouldFail(){this._appendToStreamShouldFail=true;}

}

module.exports = new gesConnectionMock();