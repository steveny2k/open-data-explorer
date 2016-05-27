import React from 'react'
import { Input } from 'react-bootstrap'

export default class CatalogFacets extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let {facets} = this.props

    var categories = facets.categories.map(function (cat, i) {
      return <Input
               type="checkbox"
               name="categoryOptions"
               label={`${cat.name}` + ` (${cat.count})`}
               onClick={this.props.handleCategorySelect.bind(this, cat.name, 'categories')}
               key={i}
               checked={cat.isRefined}
               className={'facetCategories'}
               />
    }.bind(this))

    var departments = facets.departments.map(function (cat, i) {
      console.log(cat.isRefined)
      return <Input
               type="radio"
               name="departmentOptions"
               label={`${cat.name}` + ` (${cat.count})`}
               onClick={this.props.handleCategorySelect.bind(this, cat.name, 'departments')}
               key={i}
               checked={cat.isRefined} />
    }.bind(this))

    return (
    <div className='facets'>
      <div className='facet'>
        <h3 className={'categories'}>Categories</h3>
        {categories}
      </div>
      <div className='facet'>
        <h3 className = {'categories'}>Departments</h3>
        {departments}
      </div>
    </div>
    )
  }
}
