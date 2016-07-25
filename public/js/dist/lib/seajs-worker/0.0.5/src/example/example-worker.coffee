define (require, exports, module) ->
  SeaWorker = require '../worker'
  # @nodoc
  class ExampleWorker extends SeaWorker
    @worker_service 'echo', (msg) ->
      console.log "Browser sends: #{msg}"
      return msg

    @worker_service 'add', (a, b) ->
      console.log "Browser wants to add #{a}, #{b}"
      console.log "Worker require('./adder')"
      adder = require './adder'
      return adder a, b

  SeaWorker.register ExampleWorker

  module.exports = ExampleWorker
