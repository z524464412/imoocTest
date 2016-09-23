var Danmu = require('../models/danmu');

exports.setDanmu= function(req,res,next){
    var _danmu = req.body.danmu;
    var danmu = new Danmu(_danmu);
    danmu.save(function(){

    })
}