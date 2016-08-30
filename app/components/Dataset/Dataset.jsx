import React, { Component } from 'react'
import DatasetFrontMatter from './DatasetFrontMatter'
import DatasetNav from './DatasetNav'
import { API_DOMAIN } from '../../constants/AppConstants'

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
        <div className='container-fluid'>
          <DatasetFrontMatter apiDomain={API_DOMAIN} {...dataset} />
          <DatasetNav {...other} />
          {children}
        </div>
      </section>
    )
  }
}

Dataset.propTypes = {
  dataset: React.PropTypes.object.isRequired
}

export default Dataset
