define(function(require, exports, module) {
  ImageData.prototype.n8 = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  ImageData.prototype.n4 = [[0, -1], [-1, 0], [1, 0], [0, 1]];
  ImageData.prototype.get_n = function(x, y, delta) {
    var N, d, ni, nx, ny, _i, _len;
    N = [];
    for (_i = 0, _len = delta.length; _i < _len; _i++) {
      d = delta[_i];
      nx = x + d[0];
      ny = y + d[1];
      ni = (ny * this.width + nx) * 4;
      if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
        continue;
      }
      N.push({
        i: ni,
        x: nx,
        y: ny
      });
    }
    return N;
  };
  ImageData.prototype.get_n4 = function(x, y) {
    return this.get_n(x, y, this.n4);
  };
  ImageData.prototype.get_n8 = function(x, y) {
    return this.get_n(x, y, this.n8);
  };
  ImageData.prototype.setRGBA = function(i, r, g, b, a) {
    i = i - i % 4;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
    return this.data[i + 3] = a;
  };
  ImageData.prototype.each = function(callback) {
    var data, i, pixel, x, y, _i, _ref, _results;
    data = this.data;
    _results = [];
    for (y = _i = 0, _ref = this.height; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = this.width; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          i = (y * this.width + x) * 4;
          pixel = {
            i: i,
            x: x,
            y: y,
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: data[i + 3]
          };
          _results1.push(typeof callback === "function" ? callback(pixel) : void 0);
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };
  ImageData.prototype.each_n8 = function(callback) {
    var N, d, data, i, ni, nx, ny, pixel, x, y, _i, _ref, _results;
    data = this.data;
    _results = [];
    for (y = _i = 0, _ref = this.height; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _k, _len, _ref1, _ref2, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = this.width; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          i = (y * this.width + x) * 4;
          pixel = {
            i: i,
            x: x,
            y: y,
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: data[i + 3]
          };
          N = [];
          _ref2 = this.n8;
          for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
            d = _ref2[_k];
            nx = x + d[0];
            ny = y + d[1];
            ni = (ny * this.width + nx) * 4;
            if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
              continue;
            }
            N.push({
              i: ni,
              x: nx,
              y: ny,
              r: data[ni],
              g: data[ni + 1],
              b: data[ni + 2],
              a: data[ni + 3]
            });
          }
          _results1.push(typeof callback === "function" ? callback(pixel, N) : void 0);
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };
  return ImageData.prototype.each_n4 = function(callback) {
    var N, d, data, i, ni, nx, ny, pixel, x, y, _i, _ref, _results;
    data = this.data;
    _results = [];
    for (y = _i = 0, _ref = this.height; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _k, _len, _ref1, _ref2, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = this.width; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          i = (y * this.width + x) * 4;
          pixel = {
            i: i,
            x: x,
            y: y,
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: data[i + 3]
          };
          N = [];
          _ref2 = this.n4;
          for (_k = 0, _len = _ref2.length; _k < _len; _k++) {
            d = _ref2[_k];
            nx = x + d[0];
            ny = y + d[1];
            ni = (ny * this.width + nx) * 4;
            if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height) {
              continue;
            }
            N.push({
              i: ni,
              x: nx,
              y: ny,
              r: data[ni],
              g: data[ni + 1],
              b: data[ni + 2],
              a: data[ni + 3]
            });
          }
          _results1.push(typeof callback === "function" ? callback(pixel, N) : void 0);
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };
});
