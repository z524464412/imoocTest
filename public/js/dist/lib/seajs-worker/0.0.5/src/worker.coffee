define (require, exports, module) ->
  has_q = typeof Q == 'function'
  is_worker = typeof importScripts == 'function'

  Function::inWorker = Function::worker_method = (name, fn) ->
    if not is_worker or typeof fn != 'function'
      return
    @::[name] = fn

  Function::inBrowser = Function::browser_method = (name, fn) ->
    if is_worker or typeof fn != 'function'
      return
    @::[name] = fn

  Function::service = Function::worker_service = (name, fn) ->
    if typeof fn != 'function'
      return
    if is_worker
      @::[name] = fn
    else
      @::[name] = ->
        n = arguments.length
        cb = arguments[n - 1]
        if typeof cb == 'function'
          args = Array::slice.call(arguments, 0, n - 1)
        else
          args = Array::slice.call(arguments, 0, n)
          cb = null
        if has_q
          return @invoke_promise name, args, cb
        else
          return @invoke name, args, cb

  # Base class for all workers.
  # A worker class will be instantiate twice
  # , creating one instance running in browser as a RPC interface
  # and the other running in a web worker doing all the work.
  # A web worker will be created and managed by the browser instance.
  #
  # @method .extend(proto)
  #   @note For JavaScript
  #   Create a derived class
  #   @example Create a worker class in JavaScript
  #     var Derived = SeaWorker.extend({
  #       field: 'I am a field',
  #       method: function () {
  #         // I'm a function exists in both worker and browser
  #       },
  #       constructor: function (n) {
  #         this.n = n;
  #         // Call parent constructor if needed
  #         // this.__super(n);
  #       }
  #     });
  #
  #     // Worker side methods
  #     Derived.inWorker("methodInWorkerOnly", function() {});
  #
  #     // Browser side methods
  #     Derived.inBrowser("methodInBrowserOnly", function() {});
  #
  #     // Worker service, running in worker, called from browser
  #     Derived.service("foo", function() {});
  #
  #   @param proto [Object] Derived class prototype
  #   @return [Class]
  # @method .service(name, fn)
  #   @note For JavaScript
  #   Short-hand version of {SeaWorker.worker_service}
  # @method .inWorker(name, fn)
  #   @note For JavaScript
  #   Short-hand version of {SeaWorker.worker_method}
  # @method .inBrowser(name, fn)
  #   @note For JavaScript
  #   Short-hand version of {SeaWorker.browser_method}
  # @method .worker_service(name, fn)
  #   Defines a service that runs in worker.
  #   @param [String] name the name of the service
  #   @param fn [Function] the function body
  # @method .worker_method(name, fn)
  #   Defines a method that only exists in worker instance
  #   @param [String] name the name of the method
  #   @param fn [Function] the function body
  # @method .browser_method(name, fn)
  #   Defines a method that only exists in browser instance
  #   @param [String] name the name of the method
  #   @param fn [Function] the function body
  # @method #service_name(args, callback)
  #   Each `worker_service` will have a corresponding method defined
  #   in browser instance with the same name. The same argument list
  #   is identical to the service, plus one optional callback.
  #   It serves as a RPC interface.
  #   The callback should be in the form of `(err, result) ->`
  #   This class also works with [Q](https://github.com/kriskowal/q).
  #   When Q is detected, a promise object will be returned.
  #   @param args [ArgumentList] the arguments
  #   @option callback [Callback] the callback
  #   @return [null or Promise]
  class SeaWorker
    @worker_method 'init', ->
      # Message handler
      self.onmessage = (e) =>
        name = e.data.service
        args = e.data.payload
        id = e.data.id
        try
          result = @[name].apply undefined, args
          self.postMessage
            service: name
            id: id
            result: result
        catch err
          self.postMessage
            service: name
            id: id
            error: err.toString()

    @browser_method 'init', ->
      # Data members
      @cb = {}
      @id = 0

      # Find launcher script
      this_url = module.uri
      launcher_url = this_url.replace "worker.js", "launcher.js"

      # Payload for initializing worker
      payload =
        sea_url: seajs.data.loader
        opts: SeaWorker.__sea_opts
        worker_url: @constructor.__sea_mod_uri

      # Create worker
      @_worker = new Worker launcher_url
      @_worker.onmessage = (e) =>
        if e.data?.service?
          @handle e.data
      @_worker.postMessage payload

    @browser_method 'handle', (data) ->
      c = @cb[data.id]
      delete @cb[data.id]
      if c.service != data.service
        err = "Expect callback id=#{data.id} for service #{c.service}. Got #{data.service}"
        if has_q
          c.promise.reject err
        else
          throw err
      if has_q
        if data.error?
          c.promise.reject data.error
        else
          c.promise.resolve data.result
      else
        c.fn? data.error, data.result
      return

    @browser_method 'invoke', (service, args, callback) ->
      @_worker.postMessage
        service: service
        payload: args
        id: @id
      @cb[@id] =
        service: service
        fn: callback
      @id++

    @browser_method 'invoke_promise', (service, args, callback) ->
      deferred = Q.defer()
      @_worker.postMessage
        service: service
        payload: args
        id: @id
      @cb[@id] =
        service: service
        fn: callback
        promise: deferred
      @id++
      deferred.promise.nodeify callback

    constructor: ->
      @init()

    # Register a derived worker class.
    # @param worker_class [class] the derived worker class
    @register: (worker_class)->
      if not is_worker
        return

      worker = new worker_class()

    # Config sea.js in worker context
    # @param sea_opts  [Object] sea.js options
    # @see https://github.com/seajs/seajs/issues/262 Sea.js Configuration (in Chinese)
    @config: (sea_opts) ->
      SeaWorker.__sea_opts = sea_opts

    # Map an Array of data to a new one. Each element is processed by a worker
    # service. Up to `max_worker_count` workers will be executing in parallel
    # at the same time. Results are returned by callback or promise (if Q is available)
    # @param data [Array] the data array to be proessed
    # @param service [String] the name of a worker service
    # @param max_worker_count [Interget] the maxiumum number of workers running in parallel
    # @option callback [Function] callback the optional (if Q is available) callback
    # @return [null or Promise]
    @map: (data, service, max_worker_count, callback) ->
      if has_q
        deferred = Q.defer()
      # Creat worker pool
      @__pool ?= []
      for i in [0..max_worker_count]
        if @__pool[i] instanceof @ then continue
        @__pool[i] = new @()

      # Helper
      # Fetch data
      i = -1
      fetch_next = ->
        i++
        return data[i]

      # Results
      errors = null
      results = []
      finished_count = 0
      returned = false
      return_result = ->
        if returned then return
        returned = true
        if has_q
          if errors?
            deferred.reject errors
          else
            deferred.resolve results
        else
          callback? errors, results
        return

      # Call back maker
      make_callback = (w, index) ->
        return (err, r) ->
          if err?
            errors ?= {}
            errors[index] = err
          results[index] = r
          # Not finished?
          if finished_count < data.length - 1
            finished_count++

            # Fetch new one
            task = fetch_next()
            _index = i
            if i >= data.length
              return

            if has_q
              w.invoke_promise service, [task], make_callback(w, _index)
            else
              w.invoke service [task], make_callback(w, _index)
          else
            # Finished
            return_result()

      # Get initial tasks
      for w in @__pool[0..max_worker_count]
        # TBD: race condition?
        task = fetch_next()
        index = i
        if has_q
          w.invoke_promise service, [task], make_callback(w, index)
        else
          w.invoke service, [task], make_callback(w, index)

      # Return promise or null
      return deferred?.promise.nodeify callback

    # Boills down a Array of values into a single value.
    # `state` is the inital state of the reduction, and each
    # succeesive step of it should be returned by `reducer`.
    # The `reducer` is passed four arguments:
    # * `state`
    # * `value`
    # * `index`
    # * reference to the entire Array (a.k.a. `data`)
    # @note This method is synchronized and runs on callsite
    # @todo Provide asynchronized version that runs in worker
    # @param data [Array] the data array to be reduced
    # @param reducer [Function] the reducer
    # @param state [Object] the initial state
    # @return [Object] the reduced value
    @reduce: (data, reducer, state) ->
      if not data? then return []
      for v, i in data
        state = reducer.call undefined, state, v, i, data
      return state

    @extend: require './extender'

  # Fired when module is first loaded and executed
  seajs.on "exec", (mod) ->
    # Set module URI for later use
    mod.exports?.__sea_mod_uri = mod.uri

  module.exports = SeaWorker
