var Movie =require('../models/movie');
var Category= require('../models/category');
var Comment = require('../models/comment');
var _ =require('underscore');
var fs = require('fs');
var path = require('path');
//detail page
exports.detail =function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie) {
        Comment
            .find({movie:id})
            .populate('from','name')
            .populate('reply.from replay.to','name')
            .exec(function(err,comments){
            res.render('detail', {
                title: 'demo1' + movie.title,
                id: id,
                movie: movie,
                comments:comments
            });
        })
    })
};

//admin page
//app.get('/admin/movie', function(req, res) {
exports.new =function(req,res){
    Category.find({},function(err,categories){
        res.render('admin', {
            title: 'demo1 后台录入页',
            categories:categories,
            movie: {}
        });
    })
};


//admin update movie
//app.get('/admin/update/:id', function(req, res) {
exports.update = function(req,res){

    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function (err, categories) {
                res.render('admin', {
                    title: 'demo1 后台更新页',
                    movie: movie,
                    categories:categories
                });
            });
        });
    }
};
//admin poster
exports.savePoster = function(req,res,next){
    var posterData =req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename =posterData.originalFilename;
    //console.log(req.files);
    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp =Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp +'.'+type;
            var newPath = path.join(__dirname,'../../','/public/upload/'+poster);
            fs.writeFile(newPath,data,function(err){
                req.poster = poster;
                next();
            });
        })
    }else{
        next();
    }
};
//admin post movie
//app.post('/admin/movie/new', function(req, res) {
exports.save = function(req,res){
    //console.log(req.body);
    //console.log(req.body.movie);
    //console.log(req)
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;
    var _movie;
    console.log(movieObj);
    if(req.poster){
        movieObj.poster = req.poster;
    }
    //console.log(id+"req.body.movie._id");
    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                category(categoryId,categoryName,movie);
            });
        });
    } else {
        _movie = new Movie(movieObj);
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            category(categoryId,categoryName,movie);
        });
    }
    function category (categoryId,categoryName,movie){
        if(categoryId){
            Category.findById(categoryId,function(err,category){
                category.movies.push(movie._id);
                category.save(function(err,category){
                    res.redirect('/movie/detail/' + movie._id);
                })
            });
        }else if(categoryName){
            var category = new Category({
                name:categoryName,
                movies:[movie._id]
            })
            category.save(function(err,category){
                movie.category = category._id;
                movie.save(function(err,movie){
                    res.redirect('/movie/detail/' + movie._id);
                })
            })
        }
    }
};



//list page
//app.get('/admin/list', function(req, res) {
exports.list =function(req,res){
    //Movie.fetch(function(err, movies) {
    //    if (err) {
    //        console.log(err);
    //    }
    //    for(var i=0;i<movies.length;i++){
    //        console.log(movies[i].category)
    //        Category.find({movies:movies[i].category},function(err,categories){
    //            if(err){
    //                console.log(err)
    //            }
    //            //console.log(categories.name)
    //            //movies[i].categoryType = categories.name;
    //            //console.log(categories);
    //            //console.log(movies);
    //        });
    //    }
    //    res.render('list', {
    //        title: 'demo1 列表页',
    //        movies: movies
    //    });
    //});
    Movie
        .find({})
        .populate('category','name')
        .exec(function(err,movies){
            if(err){
                console.log(err);
            }
            res.render('list',{
                title:'demo1 列表页',
                movies:movies
            })
        });
};


//admin delete movie
//app.delete('/admin/list',function(req,res){
exports.del = function(req,res){
    var id = req.query.id;
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err);
            }else{
                res.json({success:1});
            }
        });
    }
};