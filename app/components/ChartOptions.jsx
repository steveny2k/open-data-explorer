require('react-select/dist/react-select.css')

import React, { Component } from 'react'
import Select from 'react-select'

import ChartFilters from './ChartFilters'

class ChartOptions extends Component {
  renderGroupByOptions () {
    let {columns, groupBy, handleGroupBy, selectedColumn} = this.props
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
      <Select
        name='groupby'
        placeholder='Select a field to group by'
        options={groupableColumns}
        value={groupBy}
        onChange={handleGroupBy}/>
      )
  }

  render () {
    let {columns, handleAddFilter, handleRemoveFilter, filters, applyFilter, updateFilter, selectedColumn} = this.props
    let groupByOptions = null
    if (columns[selectedColumn].type !== 'number') {
      groupByOptions = this.renderGroupByOptions()
    }
    return (
      <div>
        {groupByOptions}
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
