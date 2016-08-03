import React, { Component, PropTypes } from 'react'
import DatasetFrontMatter from './DatasetFrontMatter'
import DatasetNav from './DatasetNav'
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
      <section id={'Dataset'}>
        <DatasetFrontMatter apiDomain={API_DOMAIN} {...dataset} />
        <DatasetNav {...other} />
        {children}
      </section>
    )
  }
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default Dataset
