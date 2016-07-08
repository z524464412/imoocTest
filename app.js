//var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//
//var routes = require('./routes/index');
//var users = require('./routes/users');
//var movie = require('./routes/index')
//var mysql = require('mysql');
//var async = require('async');
//var app = express();
////var conn  = mysql.createConnection({
////    host:'localhost',
////    user:'root',
////    password:'',
////    database:'test',
////    port:3306
////})
////conn.connect();
////var sqls ={
////    'insertSQL': 'insert into tb1(username) values("conan"),("fens.me")',
////    'selectSQL': 'select * from tb1 limit 10',
////    'deleteSQL': 'delete from tb1',
////    'updateSQL': 'update tb1 set username="conan update"  where username="conan"'
////    };
////var tasks = ['deleteSQL', 'insertSQL', 'selectSQL', 'updateSQL', 'selectSQL'];
////    async.eachSeries(tasks,function(item,callback){
////        console.log(item +"==>" + sqls[item]);
////        conn.query(sqls[item],function(err,res){
////            console.log(res);
////            callback(err,res);
////        });
////    },function(err){
////        console.log('err:'+err);
////    });
////var pool = mysql.createPool({
////    host:'localhost',
////    user:'root',
////    password:'',
////    database:'test',
////    port:3306
////})
////var selectSQL = 'select * from tb1 limit 10';
////pool.getConnection(function(err,conn){
////    if(err){
////        console.log("pool ==>"+err);
////    }
////    conn.query(selectSQL,function(err,rows){
////        if(err){
////            console.log(err);
////        }
////        for(var i in rows){
////            console.log(rows[i])
////        }
////        conn.release();
////    });
////})
//
//// view engine setup
////var mongoose =require('mongoose');
////var db = mongoose.connect("mongodb://127.0.0.1:27017/test");
////var TestSchema = new mongoose.Schema({
////    username:{type:String,default:"匿名用户"},
////    title:{type:String},
////    age:{type:Number,default:0},
////    email:{type:String},
////    time:{type:Date,default:Date.now},
////    content:{type:String}
////});
////var TestModel = db.model("test1",TestSchema);
////var TestEntity = new TestModel({
////    username:"helloworld",
////    age:28,
////    email:"helloworld@qq.com"
////});
////TestEntity.save(function(err,doc){
////    if(err){
////        console.log("error:"+err);
////    }else{
////        console.log(doc)
////    }
////});
////var mongooseSchema = new mongoose.Schema({
////    username:{type:String,default:"匿名用户"},
////    title:{type:String},
////    age:{type:Number,default:0},
////    email:{type:String},
////    time:{type:Date,default:Date.now},
////    content:{type:String}
////});
/////**
//// * 添加mongoose实例方法
//// */
////mongooseSchema.methods.findbyusername =function(username,callback){
////    return this.model('mongoose').find({username:username},callback);
////};
/////**
//// * 添加mongoose静态方法,静态方法在Model层就能使用
//// */
////mongooseSchema.statics.findbytitle = function(title,callback){
////    return this.model('mongoose').find({title:title},callback);
////};
////var mongooseModel = db.model('mongoose',mongooseSchema);
////var doc = {username : 'emtity_demo_username', title : 'emtity_demo_title', content : 'emtity_demo_content'};
////var mongooseEntity = new mongooseModel(doc);
////mongooseEntity.save();
////db.connection.on("error",function(error){
////    console.log("数据库连接失败:"+error);
////});
////db.connection.on("open",function(){
////    console.log("-------数据库连接成功---");
////});
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//
//// uncomment after placing your favicon in /public
////app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//
//app.use('/', routes);
//app.use('/users', users);
//
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});
//
//
//module.exports = app;
var express = require('express');
var jade = require('jade');
var mongoose =require('mongoose');
var path = require('path');
var bodyParser =require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var app =express();
app.locals.moment = require('moment');
var dbUrl = 'mongodb://127.0.0.1/imooc';
mongoose.connect(dbUrl);
app.set('views', path.join(__dirname, './public/views/pages'));
app.set('view engine','jade');
app.use(cookieParser());
app.use(require('connect-multiparty')());
app.use(cookieSession({
    name:'session',
    keys:['key1','key2'],
}));
//静态资源请求路径
app.use(express.static(path.join(__dirname,'public')));
//表单数据格式化
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
require('./routes/index')(app);

module.exports = app;