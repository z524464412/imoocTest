define(function(require, exports, module) {
  var Worker, sea_opts, worker;
  Worker = require('./image-worker');
  sea_opts = {
    base: '../dist'
  };
  Worker.config(sea_opts);
  worker = new Worker();
  return $(document).ready(function() {
    var $canvas, $status, dst_canvas, dst_ctx, img, src_canvas, src_ctx;
    console.log('Page Ready');
    $canvas = $('#src');
    src_canvas = $canvas[0];
    src_ctx = src_canvas.getContext('2d');
    $canvas = $('#dst');
    dst_canvas = $canvas[0];
    dst_ctx = dst_canvas.getContext('2d');
    $status = $('#status');
    $canvas.mousedown(function() {
      return $canvas.animate({
        opacity: 0
      });
    });
    $canvas.mouseup(function() {
      return $canvas.animate({
        opacity: 1
      });
    });
    img = new Image();
    img.onload = function() {
      var height, i, img_src, n, s, segs, step, width, _i;
      $status.text("Image Ready");
      width = src_canvas.width = dst_canvas.width = img.width;
      height = src_canvas.height = dst_canvas.height = img.height;
      src_ctx.drawImage(img, 0, 0, width, height);
      img_src = src_ctx.getImageData(0, 0, width, height);
      n = 10;
      segs = [];
      step = height / n;
      for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
        s = src_ctx.getImageData(0, step * i, width, step);
        segs.push(s);
      }
      $status.text("Start Processing");
      return Worker.map(segs, 'sepia', 5).then(function(dsts) {
        Worker.reduce(dsts, (function(ctx, s, i) {
          ctx.putImageData(s, 0, i * step);
          return ctx;
        }), dst_ctx);
        return $status.text("Complete (hold mouse on canvas to see orignal version)");
      });
    };
    return img.src = 'cat-break-couple.jpg';
  });
});
