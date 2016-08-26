define(function(require,exports,module){
    var S_admin = require("service_admin");
    module.exports = {
        init :function(){
            _SELF.bindAll();
        }
    };
    var _layout ={
        username:'.username',
        password:".password",
        confirmPWD:"#confirmPWD",
        signinBtn:'#signinBtn',
        signupBtn:'#signupBtn'
    };
    var _SELF ={
        param :{
            name:'',
            password:''
        },
        bindAll:function(){
            $(document).on('click',_layout.signinBtn,function(){
                _SELF.signinSave();
            }).on('click',_layout.signupBtn,function(){
                _SELF.signupSave();
            });
        },
        signinSave:function(){
            var param ={};
            param.name =$(_layout.username).val();
            param.password =$(_layout.password).val();
            S_admin.signin(param,function(data){
                window.location.href="/";
            })
        },
        signupSave:function(){
            var param = {};
            param.name =$(_layout.username).val();
            param.password =$(_layout.password).val();
            S_admin.signup(param,function(data){
                nAlert('success','注册成功');
                setTimeout(function(){
                    window.location.href="/user/signinPage";
                },2000);
            })
        }
    }
});