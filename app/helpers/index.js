'use strict'

function H (value) {
  /* jshint validthis: true */
  if (!(this instanceof H)) return new H(value)
  this._wrapped = value
}

H.toTitleCase = require('./toTitleCase')
H.findMinObjKeyValue = require('./findMinObjKeyValue.js')
H.findMaxObjKeyValue = require('./findMaxObjKeyValue.js')
H.replacePropertyNameValue = require('./replacePropertyNameValue')
H.fillArray = require('./fillArray.js')
H.isColTypeTest = require('./isColTypeTest.js')

// Implement chaining
H.prototype = {
  value: function value () {
    return this._wrapped
  }
}

function fn2method (key, fn) {
  if (typeof fn !== 'function') return
  H.prototype[key] = function () {
    var args = [this._wrapped].concat(Array.prototype.slice.call(arguments))
    var res = fn.apply(null, args)
    // if the result is non-string stop the chain and return the value
    return typeof res === 'string' ? new H(res) : res
  }
}

// Copy functions to instance methods for chaining
for (var key in H) fn2method(key, H[key])
module.exports = H
