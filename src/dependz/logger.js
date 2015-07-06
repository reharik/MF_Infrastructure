

module.exports = function(colors){
    return  {
        trace:function(x){console.log('Trace: '+x.yellow);},
        debug:function(x){console.log('Debug: '.cyan+x);},
        info:function(x){console.log('Info: '+x.green);},
        warn:function(x){console.log('Warn: '+x.magenta);},
        error:function(x){console.log('Error: '+x.red);}
    };
};
