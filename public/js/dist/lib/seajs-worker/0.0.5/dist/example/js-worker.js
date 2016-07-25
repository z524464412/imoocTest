define(function(require, exports, module) {
  var SeaWorker;
  SeaWorker = require('../worker');
  
  var JsWorker = SeaWorker.extend();

  JsWorker.service('echo', function (msg) {
    return msg;
  });

  JsWorker.service('add', function (a, b) {
    var adder = require('./adder');
    return adder(a, b);
  });

  SeaWorker.register(JsWorker);
  ;
  return module.exports = JsWorker;
});
