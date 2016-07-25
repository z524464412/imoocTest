var initialized;

initialized = false;

self.onmessage = function(e) {
  var opts;
  if (initialized) {
    return;
  }
  opts = e.data;
  importScripts(opts.sea_url);
  if (opts.opts != null) {
    seajs.config(opts.opts);
  }
  seajs.use(opts.worker_url);
  return initialized = true;
};
