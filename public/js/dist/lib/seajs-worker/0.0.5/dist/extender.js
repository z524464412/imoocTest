var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require, exports, module) {
  var extender;
  extender = function(proto) {
    var derived, key, value;
    derived = (function(_super) {
      __extends(_Class, _super);

      function _Class() {
        if (proto != null ? proto.hasOwnProperty('constructor') : void 0) {
          proto.constructor.apply(this, arguments);
        } else {
          _Class.__super__.constructor.apply(this, arguments);
        }
      }

      return _Class;

    })(this);
    if (proto != null) {
      for (key in proto) {
        if (!__hasProp.call(proto, key)) continue;
        value = proto[key];
        derived.prototype[key] = value;
      }
    }
    derived.prototype.__super = function() {
      return derived.__super__.constructor.apply(this, arguments);
    };
    return derived;
  };
  return module.exports = extender;
});
