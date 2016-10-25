import React, { Component } from 'react'
import ChartOptions from '../Query/ChartOptions'
import GroupOptions from '../Query/GroupOptions'
import ChartType from './ChartType'
import ChartColumns from './ChartColumns'
import ColumnSelector from '../Query/ColumnSelector'
import { Col, Accordion } from 'react-bootstrap'
import './_Chart.scss'

class ChartSideBar extends Component {
  render () {
    let { chartType, displayChartOptions, selectedColumn, metadata, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, applyChartType, selectColumn } = this.props
    let { columns, query } = metadata
    let { groupableColumns, selectableColumns } = this.props.panelProps
    let { groupBy } = query

    return (
      <Col md={3}>
        <Accordion>
          <ColumnSelector
            columns={selectableColumns}
            selected={selectedColumn}
            onSelectColumn={selectColumn} />
          <GroupOptions
            columns={groupableColumns}
            selected={groupBy}
            onGroupBy={handleGroupBy} />
          <ChartOptions
            {...query}
            selectedColumn={selectedColumn}
            columns={columns}
            handleGroupBy={handleGroupBy}
            handleAddFilter={handleAddFilter}
            handleRemoveFilter={handleRemoveFilter}
            applyFilter={applyFilter}
            updateFilter={updateFilter}
            handleSumBy={handleSumBy} />
          <ChartType
            applyChartType={applyChartType}
            displayChartOptions={displayChartOptions}
            chartType={chartType} />
          <ChartColumns
            metadata={metadata}
            selectColumn={selectColumn}
            columns={columns}
            selectedColumn={selectedColumn} />
        </Accordion>
      </Col>
    )
  }
}
export default ChartSideBar
