
// import { BarChart } from 'react-d3';
import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import Panel from './Panel'
require('./_ChartExperimental.scss')
import ChartExperimentalCanvas from './ChartExperimentalCanvas'

class ChartExperimental extends Component {

  chartTypeChecks (otherProps, query, columns) {
    let chartDisplay = { displayChartOptions: false, chartType: null }
    if (otherProps.selectedColumnDef && otherProps.selectedColumnDef.type === 'date') {
      chartDisplay.chartType = 'area'
      chartDisplay.displayChartOptions = true
    } else {
      chartDisplay.chartType = 'bar'
    }
    let checkChartType = query.chartType
    if (checkChartType && chartDisplay.displayChartOptions) {
      chartDisplay.chartType = checkChartType
    } else {
      chartDisplay.chartType = 'bar'
    }
    return chartDisplay
  }

  render () {
    let groupKeys
    let { chart, metadata, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, changeDateBy, applyChartType, selectColumn } = this.props
    let { columns, query, ...other } = metadata
    console.log(this.props)
    groupKeys = query.groupKeys
    let chartData = this.props.chart.chartData
    let otherProps = {...other}
    let displayChartOptions = null
    otherProps.selectedColumnDef = query.selectedColumn ? columns[query.selectedColumn] : null
    let chartDisplay = this.chartTypeChecks(otherProps, query, columns)
    displayChartOptions = chartDisplay.displayChartOptions
    let chartType = chartDisplay.chartType
    return (
      <Row>
        <ChartExperimentalCanvas
          chart={chart}
          chartData={chartData}
          groupKeys={groupKeys}
          changeDateBy={changeDateBy}
          columns={columns}
          {...otherProps}
          query={query}
          groupKeys={groupKeys}
          dateBy={query.dateBy}
          changeDateBy={changeDateBy}
          groupBy={query.groupBy}
          sumBy={query.sumBy}
          filters={query.filters}
          columns={columns}
          chartType={chartType}
          applyChartType={applyChartType}
          displayChartOptions={displayChartOptions}
          />
        <Panel
          {...query}
          columns={columns}
          handleGroupBy={handleGroupBy}
          handleAddFilter={handleAddFilter}
          handleRemoveFilter={handleRemoveFilter}
          applyFilter={applyFilter}
          updateFilter={updateFilter}
          handleSumBy={handleSumBy}
          applyChartType={applyChartType}
          displayChartOptions={displayChartOptions}
          chartType={chartType}
          metadata={metadata}
          selectColumn={selectColumn} />
      </Row>
    )
  }
}

export default ChartExperimental

