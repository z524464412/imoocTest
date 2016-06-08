var Movie =require('../models/movie');
var Catetory = require('../models/catetory');

exports.index = function(req,res){
    Catetory
        .find({})
        .populate({path:'movies',options:{limit:5}})
        .exec(function(err,catetories){
            if(err){
                console.log(err);
            }
            res.render('index', {
                title: 'demo1 首页1',
                catetories: catetories
            });
        });
}
