import React from 'react'
import { shallow } from 'enzyme'

import DatasetFrontMatter from '../Dataset/DatasetFrontMatter'

describe('<DatasetFrontMatter/>', () => {

  it('sets foo equal to bar', () => {
    var foo = 'bar'
    expect(foo).to.equal('bar')
  })

  it('should render children when passed in', () => {
    const wrapper = shallow(
      <DatasetFrontMatter>
        <div className='unique' />
      </DatasetFrontMatter>)

    expect(wrapper.contains(<div className='unique' />)).to.equal(true)
  })

})
