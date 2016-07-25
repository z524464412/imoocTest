define(function(require, exports, module) {
  var SeaWorker, has_q, is_worker;
  has_q = typeof Q === 'function';
  is_worker = typeof importScripts === 'function';
  Function.prototype.inWorker = Function.prototype.worker_method = function(name, fn) {
    if (!is_worker || typeof fn !== 'function') {
      return;
    }
    return this.prototype[name] = fn;
  };
  Function.prototype.inBrowser = Function.prototype.browser_method = function(name, fn) {
    if (is_worker || typeof fn !== 'function') {
      return;
    }
    return this.prototype[name] = fn;
  };
  Function.prototype.service = Function.prototype.worker_service = function(name, fn) {
    if (typeof fn !== 'function') {
      return;
    }
    if (is_worker) {
      return this.prototype[name] = fn;
    } else {
      return this.prototype[name] = function() {
        var args, cb, n;
        n = arguments.length;
        cb = arguments[n - 1];
        if (typeof cb === 'function') {
          args = Array.prototype.slice.call(arguments, 0, n - 1);
        } else {
          args = Array.prototype.slice.call(arguments, 0, n);
          cb = null;
        }
        if (has_q) {
          return this.invoke_promise(name, args, cb);
        } else {
          return this.invoke(name, args, cb);
        }
      };
    }
  };
  SeaWorker = (function() {
    SeaWorker.worker_method('init', function() {
      return self.onmessage = (function(_this) {
        return function(e) {
          var args, err, id, name, result;
          name = e.data.service;
          args = e.data.payload;
          id = e.data.id;
          try {
            result = _this[name].apply(void 0, args);
            return self.postMessage({
              service: name,
              id: id,
              result: result
            });
          } catch (_error) {
            err = _error;
            return self.postMessage({
              service: name,
              id: id,
              error: err.toString()
            });
          }
        };
      })(this);
    });

    SeaWorker.browser_method('init', function() {
      var launcher_url, payload, this_url;
      this.cb = {};
      this.id = 0;
      this_url = module.uri;
      launcher_url = this_url.replace("worker.js", "launcher.js");
      payload = {
        sea_url: seajs.data.loader,
        opts: SeaWorker.__sea_opts,
        worker_url: this.constructor.__sea_mod_uri
      };
      this._worker = new Worker(launcher_url);
      this._worker.onmessage = (function(_this) {
        return function(e) {
          var _ref;
          if (((_ref = e.data) != null ? _ref.service : void 0) != null) {
            return _this.handle(e.data);
          }
        };
      })(this);
      return this._worker.postMessage(payload);
    });

    SeaWorker.browser_method('handle', function(data) {
      var c, err;
      c = this.cb[data.id];
      delete this.cb[data.id];
      if (c.service !== data.service) {
        err = "Expect callback id=" + data.id + " for service " + c.service + ". Got " + data.service;
        if (has_q) {
          c.promise.reject(err);
        } else {
          throw err;
        }
      }
      if (has_q) {
        if (data.error != null) {
          c.promise.reject(data.error);
        } else {
          c.promise.resolve(data.result);
        }
      } else {
        if (typeof c.fn === "function") {
          c.fn(data.error, data.result);
        }
      }
    });

    SeaWorker.browser_method('invoke', function(service, args, callback) {
      this._worker.postMessage({
        service: service,
        payload: args,
        id: this.id
      });
      this.cb[this.id] = {
        service: service,
        fn: callback
      };
      return this.id++;
    });

    SeaWorker.browser_method('invoke_promise', function(service, args, callback) {
      var deferred;
      deferred = Q.defer();
      this._worker.postMessage({
        service: service,
        payload: args,
        id: this.id
      });
      this.cb[this.id] = {
        service: service,
        fn: callback,
        promise: deferred
      };
      this.id++;
      return deferred.promise.nodeify(callback);
    });

    function SeaWorker() {
      this.init();
    }

    SeaWorker.register = function(worker_class) {
      var worker;
      if (!is_worker) {
        return;
      }
      return worker = new worker_class();
    };

    SeaWorker.config = function(sea_opts) {
      return SeaWorker.__sea_opts = sea_opts;
    };

    SeaWorker.map = function(data, service, max_worker_count, callback) {
      var deferred, errors, fetch_next, finished_count, i, index, make_callback, results, return_result, returned, task, w, _i, _j, _len, _ref;
      if (has_q) {
        deferred = Q.defer();
      }
      if (this.__pool == null) {
        this.__pool = [];
      }
      for (i = _i = 0; 0 <= max_worker_count ? _i <= max_worker_count : _i >= max_worker_count; i = 0 <= max_worker_count ? ++_i : --_i) {
        if (this.__pool[i] instanceof this) {
          continue;
        }
        this.__pool[i] = new this();
      }
      i = -1;
      fetch_next = function() {
        i++;
        return data[i];
      };
      errors = null;
      results = [];
      finished_count = 0;
      returned = false;
      return_result = function() {
        if (returned) {
          return;
        }
        returned = true;
        if (has_q) {
          if (errors != null) {
            deferred.reject(errors);
          } else {
            deferred.resolve(results);
          }
        } else {
          if (typeof callback === "function") {
            callback(errors, results);
          }
        }
      };
      make_callback = function(w, index) {
        return function(err, r) {
          var task, _index;
          if (err != null) {
            if (errors == null) {
              errors = {};
            }
            errors[index] = err;
          }
          results[index] = r;
          if (finished_count < data.length - 1) {
            finished_count++;
            task = fetch_next();
            _index = i;
            if (i >= data.length) {
              return;
            }
            if (has_q) {
              return w.invoke_promise(service, [task], make_callback(w, _index));
            } else {
              return w.invoke(service([task], make_callback(w, _index)));
            }
          } else {
            return return_result();
          }
        };
      };
      _ref = this.__pool.slice(0, +max_worker_count + 1 || 9e9);
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        w = _ref[_j];
        task = fetch_next();
        index = i;
        if (has_q) {
          w.invoke_promise(service, [task], make_callback(w, index));
        } else {
          w.invoke(service, [task], make_callback(w, index));
        }
      }
      return deferred != null ? deferred.promise.nodeify(callback) : void 0;
    };

    SeaWorker.reduce = function(data, reducer, state) {
      var i, v, _i, _len;
      if (data == null) {
        return [];
      }
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        v = data[i];
        state = reducer.call(void 0, state, v, i, data);
      }
      return state;
    };

    SeaWorker.extend = require('./extender');

    return SeaWorker;

  })();
  seajs.on("exec", function(mod) {
    var _ref;
    return (_ref = mod.exports) != null ? _ref.__sea_mod_uri = mod.uri : void 0;
  });
  return module.exports = SeaWorker;
});
