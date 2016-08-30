import React, { Component } from 'react'
import ChartOptions from '../Query/ChartOptions'
import ChartType from './ChartType'
import ChartColumns from './ChartColumns'
import { Row, Col, Accordion } from 'react-bootstrap'
import './_Chart.scss'

class ChartSideBar extends Component {
  render () {
    let { chartType, displayChartOptions, selectedColumn, dataset, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, applyChartType, selectColumn } = this.props
    let { columns, query } = dataset

    return (
      <Col md={3}>
        <Row>
          <Accordion>
            <Row>
              <ChartOptions
                {...query}
                columns={columns}
                handleGroupBy={handleGroupBy}
                handleAddFilter={handleAddFilter}
                handleRemoveFilter={handleRemoveFilter}
                applyFilter={applyFilter}
                updateFilter={updateFilter}
                handleSumBy={handleSumBy} />
            </Row>
            <Row>
              <ChartType
                applyChartType={applyChartType}
                displayChartOptions={displayChartOptions}
                chartType={chartType} />
            </Row>
            <Row>
              <ChartColumns
                dataset={dataset}
                selectColumn={selectColumn}
                columns={columns}
                selectedColumn={selectedColumn}
              />
            </Row>
          </Accordion>
        </Row>
      </Col>
    )
  }
}
export default ChartSideBar
