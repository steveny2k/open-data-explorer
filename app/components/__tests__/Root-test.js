var React = require('react')
var expect = require('expect') // my root-test lives in components/__tests__/, so this is how I require in my components.

describe('root', function () {
  it('makes foo equal to bar', function () {
    var foo = 'bar'
    expect(foo).toEqual('bar')
  })
})
