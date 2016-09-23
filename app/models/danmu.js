var mongoose =require('mongoose');
var DanmuSchema = require('../schemas/danmu');
var Danmu = mongoose.model('Danmu',DanmuSchema);
module.exports(Danmu);