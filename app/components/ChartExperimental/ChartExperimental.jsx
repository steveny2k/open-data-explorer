
//import { BarChart } from 'react-d3';
import React, { Component } from 'react'
import d3 from 'd3'

import { Grid } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
//import LineChart from './LineChart'
//import BarChart from './BarChart'
//import ChartCanvas from './ChartCanvas'
import Panel from './Panel'
require('./_ChartExperimental.scss')
import ChartExperimentalCanvas from './ChartExperimentalCanvas'

class ChartExperimental extends Component {


 render () {
    let { metadata, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, changeDateBy, applyChartType, selectColumn, chart } = this.props
    let { ...other } = metadata
    let columns = this.props.metadata.columns
    let otherProps = {...other}
    let displayChartOptions = null
    otherProps.selectedColumnDef = chart.selectedColumn ? columns[chart.selectedColumn] : null

    return (
       <Row>
       <ChartExperimentalCanvas
          chart={chart}
          changeDateBy={changeDateBy}
          columns={columns}
          {...otherProps} />
         <Panel
          columns={columns}
          metadata={metadata}
          selectColumn={selectColumn}/>
      </Row>
    )
  }
}

export default ChartExperimental

