var User = require('../models/user');
exports.index = function(req,res){
    res.render('admin/main',{

    });
    //res.sendfile("public/views/pages/admin/main.jade");
};


exports.signinPage = function(req,res){
    res.render('login/signinPage');
};
exports.signupPage = function(req,res){
    res.render('login/signupPage');
};
exports.signup = function(req,res){
    var _user = req.body.param;
    User.find({name: _user.name},function(err,user){
        if(err){
            console.log(err);
        }
        if(!user){
            return res.redirect('/');
        }else{
            var user = new User(user);
            user.save(function(err,user){
                console.log(user);
                if(err){
                    console.log(err)
                }
                //return res.json({status:1,result:user});

               //return res.redirect('/admin/user/list');
            });
        }
    })
};

exports.signin = function(req,res){
    var _user =req.body.user;
    //var _user = req.body
    var name =_user.username;
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
                //console.log('密码匹配成功');
                //return res.json({status:1,result:user});
                return res.redirect('/');
            }else{
                //return res.json({status:0});
                return res.redirect('/');
            }
        });
    })
};
//logot
exports.logout =function(req,res){
    delete req.session.user;
    //delete app.locals.user;
    res.redirect('/');

};


//userlist page
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

//midware for user
exports.signinRequired = function(req,res,next) {
    var user = req.session.user;
    if(!user){
        return res.redirect('/');
    }
    next();
};
//midware for user
exports.adminRequired = function(req,res,next) {
    var user = req.session.user;
    console.log(user);
    if(user.role <= 10){
        return res.redirect('/');
    }
    next();
};
exports.permissions = function(req,res,next){
    res.redirect('/');
}