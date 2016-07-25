var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require, exports, module) {
  var ImageWorker, SeaWorker;
  SeaWorker = require('../worker');
  require('./image-util');
  ImageWorker = (function(_super) {
    __extends(ImageWorker, _super);

    function ImageWorker() {
      return ImageWorker.__super__.constructor.apply(this, arguments);
    }

    ImageWorker.worker_service('sepia', function(src) {
      src.each(function(p) {
        var b, g, r;
        r = 0.393 * p.r + 0.769 * p.g + 0.189 * p.b;
        g = 0.349 * p.r + 0.686 * p.g + 0.168 * p.b;
        b = 0.272 * p.r + 0.534 * p.g + 0.131 * p.b;
        return src.setRGBA(p.i, r, g, b, p.a);
      });
      return src;
    });

    return ImageWorker;

  })(SeaWorker);
  SeaWorker.register(ImageWorker);
  return module.exports = ImageWorker;
});
