require('react-select/dist/react-select.css')

import React, { Component } from 'react'
import Select from 'react-select'

import ChartFilters from './ChartFilters'

class ChartOptions extends Component {
  render () {
    let {columns, groupBy, handleGroupBy, handleAddFilter, handleRemoveFilter, filters, applyFilter, updateFilter, selectedColumn} = this.props
    let groupableColumns

    if (columns) {
      let columnKeys = Object.keys(columns)
      groupableColumns = columnKeys.filter((col) => {
        if (columns[col].key !== selectedColumn) {
          if (columns[col].categories) return true
          if (columns[col].type === 'date') return true
        }
        return false
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
          applyFilter={applyFilter}
          updateFilter={updateFilter}/>
      </div>
    )
  }
}

export default ChartOptions
