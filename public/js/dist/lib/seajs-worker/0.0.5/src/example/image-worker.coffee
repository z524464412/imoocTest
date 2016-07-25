define (require, exports, module) ->
  SeaWorker = require '../worker'
  require './image-util'
  # @nodoc
  class ImageWorker extends SeaWorker
    @worker_service 'sepia', (src) ->
      src.each (p) ->
        r = 0.393 * p.r + 0.769 * p.g + 0.189 * p.b
        g = 0.349 * p.r + 0.686 * p.g + 0.168 * p.b
        b = 0.272 * p.r + 0.534 * p.g + 0.131 * p.b
        src.setRGBA p.i, r, g, b, p.a
      return src
      
  SeaWorker.register ImageWorker

  module.exports = ImageWorker
