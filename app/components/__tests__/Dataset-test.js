import React from 'react'
import TestUtils from 'react/lib/ReactTestUtils'
import expect from 'expect'
import Dataset from '../dataset/Dataset.jsx'


describe('Dataset', function () {
  it('renders without problems', function () {
    var dataset = TestUtils.renderIntoDocument(<Dataset/>)
    expect(dataset).toExist()
  })
})