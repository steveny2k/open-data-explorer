require('react-select/dist/react-select.css')

import React, { Component } from 'react'
import Select from 'react-select'

import ChartFilters from './ChartFilters'

class ChartOptions extends Component {
  render () {
    let {columns, groupBy, handleGroupBy, handleAddFilter, handleRemoveFilter, filters, applyFilter} = this.props
    let groupableColumns

    if (columns) {
      let columnKeys = Object.keys(columns)
      groupableColumns = columnKeys.filter((col) => {
        return columns[col].categories || false
      }).map((col) => {
        return {label: columns[col].name, value: columns[col].key}
      })
    }

    return (
      <div>
        <Select
          name='groupby'
          placeholder='Select a field to group by'
          options={groupableColumns}
          value={groupBy}
          onChange={handleGroupBy}/>
        <ChartFilters
          columns={columns}
          filters={filters}
          handleAddFilter={handleAddFilter}
          handleRemoveFilter={handleRemoveFilter}
          applyFilter={applyFilter}/>
      </div>
    )
  }
}

export default ChartOptions
