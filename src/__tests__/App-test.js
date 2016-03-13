import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import expect from 'expect'
import App from '../app.jsx'

describe('App', function () {
  it('renders without problems', function () {
    var dataset = TestUtils.renderIntoDocument(<App/>)
    expect(dataset).toExist()
  })
})

