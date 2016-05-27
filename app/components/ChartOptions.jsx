require('react-select/dist/react-select.css')

import React, { Component } from 'react'
import Select from 'react-select'

import ChartFilters from './ChartFilters'

class ChartOptions extends Component {
  renderGroupByOptions () {
    let {columns, groupBy, handleGroupBy, selectedColumn} = this.props
    let groupableColumns
     // for GROUP_BY
    if (columns) {
      let columnKeys = Object.keys(columns)
      groupableColumns = columnKeys.filter((col) => {
        if (columns[col].key !== selectedColumn) {
          if (columns[col].categories) return true
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
        onChange={handleGroupBy}
        className={'filterF'}
        />
      )
  }

  renderSumByOptions () {
    let {columns, handleSumBy, sumBy} = this.props
    let sumableColumns

    let isNumericForSum = function (col) {
      let numberFields = ['double', 'money', 'number']
      if (col.unique) return false
      if (col.categories) return false
      if (numberFields.indexOf(col['type']) > -1) {
        return true
      }
      return false
    }

    // for SUM_BY
    if (columns) {
      let columnKeys = Object.keys(columns)
      sumableColumns = columnKeys.filter((col) => {
        return isNumericForSum(columns[col]) || false
      }).map((col) => {
        return {label: columns[col].name, value: columns[col].key}
      })
    }

    if (sumableColumns.length === 0) {
      return false
    } else {
      return (
        <Select
          name='sumby'
          placeholder='Select a field to sum by'
          options={sumableColumns}
          value={sumBy}
          onChange={handleSumBy}
          className={'filterF'}
          />)
    }
  }

  render () {
    let {columns, handleAddFilter, handleRemoveFilter, filters, applyFilter, updateFilter, selectedColumn} = this.props
    let groupByOptions = null
    let sumByOptions = null

    if (columns[selectedColumn].type !== 'number' || columns[selectedColumn].categories) {
      groupByOptions = this.renderGroupByOptions()
      sumByOptions = this.renderSumByOptions()
    }

    return (
      <div className={'chartFiltersStyle'}>
        {groupByOptions}
        <ChartFilters
          columns={columns}
          filters={filters}
          handleAddFilter={handleAddFilter}
          handleRemoveFilter={handleRemoveFilter}
          applyFilter={applyFilter}
          updateFilter={updateFilter}
          className={'filterF'}/>
        {sumByOptions}
      </div>
    )
  }
}

export default ChartOptions
