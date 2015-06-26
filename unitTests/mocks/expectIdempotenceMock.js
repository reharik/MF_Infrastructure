/**
 * Created by rharik on 6/19/15.
 */

module.exports = function(){
    return {
        passes:false,
        mock: function(){
            return passes;
        },
        setPassesToTrue:function(){this.passes = true;}
    }
};