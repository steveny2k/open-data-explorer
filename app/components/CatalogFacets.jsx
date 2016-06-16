import React, { Component } from 'react'
import { Checkbox, Radio } from 'react-bootstrap'

class CatalogFacets extends Component {
  render () {
    let {facets} = this.props

    var categories = facets.categories.map((cat, i) => {
      return <Checkbox
        name='categoryOptions'
        onClick={this.props.handleCategorySelect.bind(this, cat.name, 'categories')}
        key={i}
        checked={cat.isRefined}
        className={'facetCategories'}
        >{`${cat.name}` + ` (${cat.count})`}</Checkbox>
    })

    var departments = facets.departments.map((cat, i) => {
      console.log(cat.isRefined)
      return <Radio
        name='departmentOptions'
        onClick={this.props.handleCategorySelect.bind(this, cat.name, 'departments')}
        key={i}
        checked={cat.isRefined}>{`${cat.name}` + ` (${cat.count})`}</Radio>
    })

    return (
      <div className={'facets'}>
        <div className={'facet'}>
          <h3 className={'categories'}>Categories</h3>
          {categories}
        </div>
        <div className={'facet'}>
          <h3 className={'categories'}>Departments</h3>
          {departments}
        </div>
      </div>
    )
  }
}

export default CatalogFacets
