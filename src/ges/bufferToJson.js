/**
 * Created by rharik on 7/7/15.
 */


module.exports = function() {
    return function bufferToJson(item) {
        if(!Buffer.isBuffer(item)){
            return item;
        }
        return JSON.parse(item.toString('utf8'));
    }
};