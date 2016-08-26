var User = require('../models/user');


//注册验证
exports.signup = function(req,res){
    var _user =req.body;
    console.log(_user);
    User.find({name: _user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            return res.redirect('/');
        }else{
            var user = new User(_user);
            user.save(function(err,user){
                console.log(user);
                if(err){
                    console.log(err)
                }
                return res.json({status:'1'});
            });
        }
    })
};
//登陆验证
exports.signin = function(req,res){
    var _user =req.body;
    //var _user = req.body
    var name =_user.name;
    var password =_user.password;
    if(!_user){
        console.log('操作失败');
       return
    }
    User.findOne({name:name},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            return res.redirect('/');
        }
        user.comparePassword(password,function(err,isMatch){
            if(err){
                console.log(err)
            }
            if(isMatch){
                req.session.user = user;
                return res.json({status:'1'});
            }else{
                return res.json({status:'err_login'});
            }
        });
    })
};
//登出
exports.logout =function(req,res){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');

};


//用户列表页面
exports.list = function(req, res) {
        User.fetch(function(err, users) {
            if (err) {
                console.log(err);
            }
            res.render('userlist', {
                title: 'imooc 用户列表页',
                users: users
            });
        });
};

//用户登陆验证
exports.signinRequired = function(req,res,next) {
    var user = req.session.user;
    if(!user){
        return res.redirect('/');
    }
    next();
};
//用户权限验证
exports.adminRequired = function(req,res,next) {
    var user = req.session.user;
    console.log(user);
    if(user.role <= 10){
        return res.redirect('/');
    }
    next();
};
//注册页面跳转
exports.signinPage = function(req,res){
    res.render('login/signinPage');
};
//登陆页面跳转
exports.signupPage = function(req,res){
    res.render('login/signupPage');
}