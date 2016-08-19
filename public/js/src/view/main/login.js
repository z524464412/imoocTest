define(function(require,exports,module){
    var S_admin = require("service_admin");
    module.exports = {
        init :function(){
            _SELF.bindAll();
        }
    };
    var _layout ={
        signinBtn:'.signinBtn ',
        username:'#username',
        password:"#password",
        confirmPWD:"#confirmPWD"
    };
    var _SELF ={
        param :{
            name:'',
            password:''
        },
        bindAll:function(){
            $(document).on('click',_layout.signinBtn,function(){
                _SELF.name = $(_layout.username).val();
                _SELF.password = $(_layout.password).val();
                _SELF.signinBtn();
            })
        },
        signinBtn:function(){
            var param ={};
            param.name =_SELF.name;
            param.password =_SELF.password;
            S_admin.signup(param,function(data){
                console.log(data);
            })
        }
    }
});