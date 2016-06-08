var Movie =require('../models/movie');
var Comment = require('../models/comment');
var _ =require('underscore');

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
    res.render('admin', {
        title: 'demo1 后台录入页',
        movie: {
            _id: '',
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    });
};


//admin update movie
//app.get('/admin/update/:id', function(req, res) {
exports.update = function(req,res){
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function(err, movie) {
            console.log(movie);
            res.render('admin', {
                title: 'demo1 后台更新页',
                movie: movie
            });
        });
    }
};
//admin post movie
//app.post('/admin/movie/new', function(req, res) {
exports.save = function(req,res){
    console.log(req.body);
    console.log(req.body.movie);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    console.log(id);
    if (id !== undefined) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/detail/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            year: movieObj.year,
            poster: movieObj.poster,
            flash: movieObj.flash,
            summary: movieObj.summary
        });
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/detail/' + movie._id);
        });
    }
};



//list page
//app.get('/admin/list', function(req, res) {
exports.list =function(req,res){
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'demo1 列表页',
            movies: movies
        });
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