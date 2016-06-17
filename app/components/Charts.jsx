import React, { Component } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ChartCanvas from './ChartCanvas'
import ChartOptions from './ChartOptions'
import ChartType from './ChartType'
import ChartColumns from './ChartColumns'


class Charts extends Component {
  constructor (props) {
    super(props)

    //this.renderColumnButton = this.renderColumnButton.bind(this)
    this.renderChartArea = this.renderChartArea.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.dataset.query.isFetching
  }


  renderChartArea (props) {
    let { dataset, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, changeDateBy, applyChartType} = this.props
    let { columns, query, ...other } = dataset

    //set the props here; will get set by the reducer
    let chartType
    let otherProps = {...other}
    let displayChartOptions = false
    otherProps.selectedColumnDef = query.selectedColumn ? columns[query.selectedColumn] : null

    if (otherProps.selectedColumnDef && otherProps.selectedColumnDef.type === 'date') {
      chartType = 'area'
      displayChartOptions = true
    }
    else{
        chartType = 'bar'
    }

    let checkChartType = query.chartType
    if(checkChartType &&  displayChartOptions) {
      chartType = checkChartType
    }
    else {
      chartType = 'bar'
    }

    return (
      query && query.data
      ? (<Row>
        <Col md={9}>
          <ChartCanvas
            query={query}
            data={query.data}
            dateBy={query.dateBy}
            changeDateBy={changeDateBy}
            groupBy={query.groupBy}
            sumBy={query.sumBy}
            filters={query.filters}
            columns={columns}
            chartType={chartType}
            applyChartType={applyChartType}
            displayChartOptions={displayChartOptions}
            {...otherProps} />
        </Col>
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
        </Col>
      </Row>


      )
      : false
    )
  }

  render () {
    console.log("This is chart rendering")
    console.log(this.props);
    console.log(this.props.dataset);
    let { dataset, selectColumn}  = this.props
    let ChartArea = this.renderChartArea()
    return (
      <div className={'container-fluid'}>
        <Row className={'chartButtonRow'}>
          <Col md={12}>
          <ChartColumns
            dataset= {dataset}
            selectColumn={selectColumn}
           />
          </Col>
        </Row>
        {ChartArea}
      </div>

    )
  }
}

export default Charts
