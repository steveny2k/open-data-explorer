import React, { Component } from 'react'
import PanelColumns from './PanelColumns'
import { Col, Accordion } from 'react-bootstrap'
import ChartOptions from '../Query/ChartOptions'
import ChartExperimentalType from './ChartExperimentalType'
import './_Chart.scss'
class Panel extends Component {
  // /Panel component for holding filter functions.
  render () {
    let { chartType, displayChartOptions, selectedColumn, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, applyChartType, selectColumn, metadata } = this.props
    let { columns, query } = metadata
    return (
      <Col md={3}>
        <Accordion>
          <ChartOptions
            {...query}
            columns={columns}
            handleGroupBy={handleGroupBy}
            handleAddFilter={handleAddFilter}
            handleRemoveFilter={handleRemoveFilter}
            applyFilter={applyFilter}
            updateFilter={updateFilter}
            handleSumBy={handleSumBy} />
          <ChartExperimentalType applyChartType={applyChartType} displayChartOptions={displayChartOptions} chartType={chartType} />
          <PanelColumns
            metadata={metadata}
            selectColumn={selectColumn}
            columns={columns}
            selectedColumn={selectedColumn} />
        </Accordion>
      </Col>
    )
  }
}
export default Panel
