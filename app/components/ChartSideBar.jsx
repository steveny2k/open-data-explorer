import React, { Component } from 'react'
import ChartCanvas from './ChartCanvas'
import ChartOptions from './ChartOptions'
import ChartType from './ChartType'
import ChartColumns from './ChartColumns'
import { Button, Row, Col, ButtonGroup} from 'react-bootstrap'


class ChartSideBar extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    console.log("rendering the chart chartSideBar")
    console.log(this.props)
    let { chartType, displayChartOptions, selectedColumn, dataset, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, changeDateBy, applyChartType, selectColumn } = this.props
    let { columns, query, ...other } = dataset
    let otherProps = {...other}
    console.log(displayChartOptions);
    return (
      <Col md={3}>
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
            chartType={chartType}/>
        </Row>
        <Row className={'chartButtonRow'}>
          <ChartColumns
            dataset= {dataset}
            selectColumn={selectColumn}
            columns= {columns}
           />
        </Row>
      </Col>
    )
  }
}
export default ChartSideBar
