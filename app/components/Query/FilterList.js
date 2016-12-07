import React, { Component} from 'react'
import FilterDateTime from './FilterDateTime'
import FilterNumeric from './FilterNumeric'
import FilterCategory from './FilterCategory'
import FilterBoolean from './FilterBoolean'
import {Well, Button} from 'react-bootstrap'

export class FilterList extends Component {
  render () {
    let { filters, columns, handleRemoveFilter, applyFilter, updateFilter } = this.props
    let filterOptions = Object.keys(filters).map((key) => {
      let filterContent = null
      let filterType
      let filter
      let checkboxOptions = {}
      if (key !== 'checkboxes') {
        filter = columns[key]
        filterType = (filter.type === 'text' || filter.type === 'number') && filter.categories ? 'category' : filter.type
      } else {
        filter = {key: 'checkboxes', name: 'Checkboxes (true/false)'}
        filterType = 'checkbox'
        checkboxOptions = Object.keys(columns).filter((option) => {
          return columns[option].type === 'checkbox'
        }).map((option) => {
          return {value: columns[option].key, label: columns[option].name}
        })
      }
      switch (filterType) {
        case 'date':
          let startDate = filters[key].options ? filters[key].options.min : filter.min
          let endDate = filters[key].options ? filters[key].options.max : filter.max
          filterContent =
            <FilterDateTime
              key={filter.key}
              fieldKey={filter.key}
              startDate={startDate}
              endDate={endDate}
              applyFilter={applyFilter} />
          break
        case 'category':
          let optionsForFilter = filter.categories.map(function (record) {
            if (!record.category) {
              return { label: 'Blank', value: 'blank' }
            }
            return { label: record.category, value: record.category }
          })
          filterContent = <FilterCategory
            key={filter.key}
            fieldKey={filter.key}
            options={optionsForFilter}
            applyFilter={applyFilter}
            filter={filters[key]} />
          break
        case 'checkbox':
          filterContent = <FilterBoolean
            key={filter.key}
            fieldKey={filter.key}
            options={checkboxOptions}
            applyFilter={applyFilter}
            filter={filters[key]} />
          break
        case 'number':
          let nextRange = filters[key].options ? filters[key].options.nextRange : [parseInt(filter.min), parseInt(filter.max)]
          let currentRange = filters[key].options ? (filters[key].options.currentRange ? filters[key].options.currentRange : [parseInt(filter.min), parseInt(filter.max)]) : [parseInt(filter.min), parseInt(filter.max)]
          filterContent = <FilterNumeric
            key={filter.key}
            fieldKey={filter.key}
            min={parseInt(filter.min)}
            max={parseInt(filter.max)}
            currentRange={currentRange}
            nextRange={nextRange}
            filter={filters[key]}
            applyFilter={applyFilter}
            updateFilter={updateFilter} />
          break
      }
      let filterOption =
        <Well bsSize='small' className='filter' key={filter.key}>
          <div className='filter-content'>
            <Button className='close' onClick={handleRemoveFilter.bind(this, filter.key)}> &times; </Button>
            <h4>{filter.name}</h4>
            {filterContent}
          </div>
        </Well>
      return filterOption
    })
    return (
      {filterOptions}
    )
  }
}
