import React from 'react'
import { shallow } from 'enzyme'

import DatasetFrontMatter from '../../../app/components/Dataset/DatasetFrontMatter'
import { Col } from 'react-bootstrap'

describe('<DatasetFrontMatter/>', () => {

  it('sets foo equal to bar', () => {
    var foo = 'bar'
    expect(foo).to.equal('bar')
  })

  it('should render 2 columns', () => {
    const wrapper = shallow(<DatasetFrontMatter />)
    expect(wrapper.find(Col)).to.have.length(2)
  })

})
