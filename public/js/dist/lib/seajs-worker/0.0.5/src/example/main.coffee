# This example does the same job as:
# http://blogs.msdn.com/b/eternalcoding/archive/2012/09/20/using-web-workers-to-improve-performance-of-image-manipulation.aspx
define (require, exports, module) ->
  Worker = require './image-worker'
  sea_opts =
    base: '../dist'
  Worker.config sea_opts
  worker = new Worker()

  $(document).ready ->
    console.log 'Page Ready'
    $canvas = $('#src')
    src_canvas = $canvas[0]
    src_ctx = src_canvas.getContext '2d'
    $canvas = $('#dst')
    dst_canvas = $canvas[0]
    dst_ctx = dst_canvas.getContext '2d'
    $status = $('#status')

    $canvas.mousedown ->
      $canvas.animate opacity: 0
    $canvas.mouseup ->
      $canvas.animate opacity: 1
    img = new Image()
    img.onload = ->
      $status.text "Image Ready"
      # Set canvas size
      width = src_canvas.width = dst_canvas.width = img.width
      height = src_canvas.height = dst_canvas.height = img.height
      # Show original image
      src_ctx.drawImage img, 0, 0, width, height
      # Get image data ready for processing
      img_src = src_ctx.getImageData 0, 0, width, height

      # Make segements
      n = 10
      segs = []
      step = height / n
      for i in [0..n]
        s = src_ctx.getImageData 0, step * i, width, step
        segs.push s

      $status.text  "Start Processing"
      # Start worker
      Worker.map segs, 'sepia', 5
        .then (dsts) ->
          Worker.reduce dsts, ((ctx, s, i) ->
            ctx.putImageData s, 0, i * step
            return ctx
            ), dst_ctx
          $status.text "Complete (hold mouse on canvas to see orignal version)"
    img.src = 'cat-break-couple.jpg'
