import React, { Component, PropTypes } from 'react'
import DatasetFrontMatter from './DatasetFrontMatter'
import DatasetTabs from './DatasetTabs'
import API_DOMAIN from '../constants/AppConstants'

class Dataset extends Component {

  componentWillMount () {
    this.props.onLoad().then(() => {
      this.props.loadColumnProps()
    })
  }

  render () {
    const { dataset, children, ...other } = this.props
    return (
      <div>
        <DatasetFrontMatter apiDomain={API_DOMAIN} {...dataset} />
        <DatasetTabs {...other} />
        {children}
      </div>
    )
  }
}

Dataset.propTypes = {
  dataset: React.PropTypes.object.isRequired
}

export default Dataset
