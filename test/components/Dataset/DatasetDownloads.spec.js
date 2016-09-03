import React from 'react'
import { mount } from 'enzyme'

import DatasetDownloads from '../../../app/components/Dataset/DatasetDownloads'
import { Col } from 'react-bootstrap'

describe('<DatasetDownloads />', () => {

  it('Renders 3 download options with valid links', () => {
    const wrapper = mount(<DatasetDownloads apiDomain='data.sfgov.org' id='4545-4545' migrationId='1212-1212' />)
    const downloadOpts = wrapper.find('ul.dropdown-menu li a')

    expect(downloadOpts).to.have.length(3)

    const match = /(csv|json|geojson)/
    downloadOpts.forEach((node) => {
      expect(node.prop('href')).to.match(match)
    })
  })

})
