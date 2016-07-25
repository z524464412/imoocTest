define (require, exports, module) ->
  extender = (proto) ->
    derived = class extends @
      constructor: ->
        if proto?.hasOwnProperty 'constructor'
          proto.constructor.apply @, arguments
        else
          super

    if proto?
      for own key, value of proto
        derived::[key] = value

    derived::__super = ->
      derived.__super__.constructor.apply @, arguments

    return derived
  module.exports = extender
