import React, { Component } from 'react'
import ChartCanvas from './ChartCanvas'
import ChartOptions from '../Query/ChartOptions'
import ChartType from './ChartType'
import ChartColumns from './ChartColumns'
import { Button, Row, Col, ButtonGroup, Panel, Accordion} from 'react-bootstrap'
import './_Chart.scss'

class ChartSideBar extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { chartType, displayChartOptions, selectedColumn, dataset, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, changeDateBy, applyChartType, selectColumn } = this.props
    let { columns, query, ...other } = dataset
    let otherProps = {...other}
    const panelTitle = (
        <h3 className="ChartSideBarTitle">Chart Options</h3>
    );

    return (
      <Col md={3}>
      <Row>
          <Accordion>
          <Row>
            <ChartColumns
            dataset= {dataset}
            selectColumn={selectColumn}
            columns= {columns}
           />
          </Row>
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
          </Accordion>
        </Row>
      </Col>
    )
  }
}
export default ChartSideBar
