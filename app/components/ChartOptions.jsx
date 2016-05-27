require('react-select/dist/react-select.css')

import React, { Component } from 'react'
import Select from 'react-select'

import ChartFilters from './ChartFilters'

class ChartOptions extends Component {
  render () {

    let {columns, sumBy, handleSumBy, groupBy, handleGroupBy, handleAddFilter, handleRemoveFilter, filters, applyFilter, updateFilter, selectedColumn} = this.props

    let groupableColumns
    let sumableColumns

    let isNumericForSum = function(col){
      let numberFields = ['double', 'money','number']
      if(numberFields.indexOf(col['type']) > -1){
        return true
      }
      return false
    }

     //for GROUP_BY
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
    //for SUM_BY
    if (columns) {
      let columnKeys = Object.keys(columns)
      sumableColumns = columnKeys.filter((col) => {
        return isNumericForSum(columns[col]) || false
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
        <Select
          name='sumby'
          placeholder='Select a field to sum by'
          options={sumableColumns}
          value={sumBy}
          onChange={handleSumBy}/>
      </div>
    )
  }
}

export default ChartOptions
