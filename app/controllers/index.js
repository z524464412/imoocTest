var Movie = require('../models/movie');
var Category = require('../models/category');
exports.index = function(req,res){
    Category
        .find({})
        .populate({path:'movies',options:{limit:6}})
        .exec(function(err,categories){
            if(err){
                console.log(err);
            }
            console.log(categories);
            //使用angular
            //res.json(categories)
            /**
             * 不使用angular
             */
            res.render('index', {
                title: 'imooc 首页',
                categories: categories
            });
        });
};


exports.search = function(req,res){
    var catId =req.query.cat;
    var page =parseInt(req.query.p,10) || 0;
    var count = 6;
    var index = page * count;
    var q =req.query.q;
    if(catId) {
        Category
            .find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster',
            })
            .exec(function (err, categories) {
                if (err) {
                    console.log(err);
                }
                var category = categories[0] || {};
                var movies = category.movies || []
                var results = movies.slice(index, index + count);
                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: category.name,
                    query: 'cat=' + catId,
                    pageNo: (parseInt(page) + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            });
    }else{
        Movie.find({title: new RegExp(q+'.*')})
            .exec(function(err,movies){
                if (err) {
                    console.log(err);
                }
                var results = movies.slice(index, index + count);
                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: q,
                    query: 'q=' + q,
                    pageNo: (parseInt(page) + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            })
    }
}
