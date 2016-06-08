var User = require('../models/user');
exports.signup = function(req,res){
    var _user =req.body.user;
    User.find({name: _user.name},function(err,user){
        console.log(user)
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
                res.redirect('/admin/user/list');
            });
        }
    })
};
exports.signin = function(req,res){
    var _user =req.body.user;
    var name =_user.name;
    var password =_user.password;
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
            console.log(isMatch);
            if(isMatch){
                req.session.user = user;

                console.log('PassWord is matched');
                return res.redirect('/')
            }else{
                console.log('PassWord is not matched');
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
