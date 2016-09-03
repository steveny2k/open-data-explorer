import React from 'react'
import { Input } from 'react-bootstrap'

export default class CatalogSearchBar extends React.Component {
  constructor (props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
  }

  handleSearch (e) {
    let {helper} = this.props
    helper.setQuery(e.target.value).search()
  }

  render () {
    let { searchTerm } = this.props
    let searchInput = <Input type='text' placeholder='Search' onKeyUp={this.handleSearch} />
    if (searchTerm !== '') {
      searchInput = <Input type='text' defaultValue={searchTerm} onKeyUp={this.handleSearch} />
    }

    return (
      <div className={'catalogMainSearchBox'}>
        { searchInput }
      </div>
    )
  }
}
