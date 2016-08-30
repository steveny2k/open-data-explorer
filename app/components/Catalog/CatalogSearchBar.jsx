import React from 'react'
import { Input } from 'react-bootstrap'

export default class CatalogSearchBar extends React.Component {
  constructor (props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
  }

  handleSearch (ev) {
    let {helper} = this.props
    helper.setQuery(ev.target.value).search()
  }

  render () {
    return (
      <div className={'catalogMainSearchBox'}>
        <Input type='text' placeholder='Search' onKeyUp={this.handleSearch} />
      </div>
    )
  }
}
