'use strict'

function h (value) {
  /* jshint validthis: true */
  if (!(this instanceof h)) return new h(value)
  this._wrapped = value
}

h.toTitleCase = require('./toTitleCase')

// Implement chaining
h.prototype = {
  value: function value () {
    return this._wrapped
  }
}

function fn2method (key, fn) {
  if (typeof fn !== 'function') return
  h.prototype[key] = function () {
    var args = [this._wrapped].concat(Array.prototype.slice.call(arguments))
    var res = fn.apply(null, args)
    // if the result is non-string stop the chain and return the value
    return typeof res === 'string' ? new h(res) : res
  }
}

// Copy functions to instance methods for chaining
for (var key in h) fn2method(key, h[key])

module.exports = h
