var Comment =require('../models/comment');
var _ =require('underscore');

//comment post movie
exports.save = function(req,res){
    var _comment = req.body.comment;
    var movieId = _comment.movie;
    console.log(_comment.cid)
    if(_comment.cid){
        Comment.findById(_comment.cid,function(err,comment){
            var reply = {
                from :_comment.from,
                to:_comment.tid,
                content:_comment.content
            };
            console.log(comment+"1111");
            comment.reply.push(reply);
            comment.save(function(err,comment){
                if(err){
                    console.log(err)
                }
                res.redirect('/movie/detail/'+movieId);
            });
        })
    }else{
        var comment = new Comment(_comment);

        comment.save(function(err,comment){
            console.log(comment);
            if(err){
                console.log(err);
            }
            res.redirect('/movie/detail/'+movieId);
        })
    }



};