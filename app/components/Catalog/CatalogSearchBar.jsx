import React from 'react'
import { FormControl } from 'react-bootstrap'

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
    let { searchTerm } = this.props

    console.log(searchTerm)
    let searchInput = <FormControl type='text' placeholder='Search' onKeyUp={this.handleSearch} />
    if (searchTerm !== '') {
      searchInput = <FormControl type='text' defaultValue={searchTerm} placeholder='Search' onKeyUp={this.handleSearch} />
    }
    return (
      <div className={'catalogMainSearchBox'}>
        {searchInput}
      </div>
    )
  }
}

