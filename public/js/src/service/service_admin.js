define(function(require,exports,module){

    var S_core = require('service_core');
    module.exports = {
        //用户登出
        logout:function(param,callback){
            S_core.post('/logout',param,callback,null,null);
        },
        //用户登陆
        signin:function(param,callback){
            S_core.post('/user/signin',param,callback,null,null);
        },
        //用户注册
        signup:function(param,callback){
            S_core.post('/user/signup',param,callback,null,null);
        },
    }
})