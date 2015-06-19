/**
 * Created by reharik on 6/10/15.
 */


var Subscription = require('./SubscriptionMock');

class gesConnectionMock{
    constructor(){
        this.subscription;
    }
    subscribeToStream(){
        this.subscription = new Subscription();
        return this.subscription;
    }
}


module.exports = new gesConnectionMock();