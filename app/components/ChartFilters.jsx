import React, { Component } from 'react'
import Select from 'react-select'
import { Well, Button } from 'react-bootstrap'
import _ from 'lodash'

class ChartFilters extends Component {
  constructor (props) {
    super(props)
    this.renderFilterList = this.renderFilterList.bind(this)
  }

  renderFilterList () {
    let { filters, columns, handleRemoveFilter } = this.props

    let filterOptions = Object.keys(filters).map((key) => {
      let filter = columns[key]
      let filterContent = null
      let filterType = (filter.type === 'text' || filter.type === 'number') && filter.categories ? 'category' : filter.type

      switch (filterType) {
        case 'calendar_date':
          filterContent = <div>calendar</div>
          break
        case 'category':
          filterContent = <div>category</div>
          break
        case 'checkbox':
          filterContent = <div>checkbox</div>
          break
        case 'number':
          filterContent = <div>number</div>
          break
      }

      let filterOption = (<Well bsSize="small" className="filter" key={filter.key}>
          <div className="filter-content">
          <Button className="close" onClick={handleRemoveFilter.bind(this, filter.key)}>&times;</Button>
          <h4>{filter.name}</h4>
            {filterContent}
          </div>
        </Well>)

      return filterOption
    })
    return filterOptions
  }

  render () {
    let { handleAddFilter, columns, filters } = this.props
    let checkboxes = false
    // these are specific to Socrata, filterable columns should just be set in the state when columns are processed
    const notFilters = ['checkbox', 'location', 'url']

    let options = Object.keys(columns).filter((column) => {
      let option = columns[column]
      if (option.type === 'checkbox') checkboxes = true
      if (notFilters.indexOf(option.type) > -1) return false
      if (!option.categories && option.type === 'text') return false
      return true
    }).map((column, i) => {
      let option = columns[column]
      return {
        value: option.key,
        label: option.name
      }
    })
    return (
      <div>
        <Select
          name='filters'
          placeholder="Select fields you'd like to filter by"
          options={options}
          onChange={handleAddFilter}/>
        {filters ? this.renderFilterList() : false}
      </div>

    )
  }
}

export default ChartFilters
