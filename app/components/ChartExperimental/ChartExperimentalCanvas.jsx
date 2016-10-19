

import React, { Component } from 'react'
import { toTitleCase } from '../../helpers'
import pluralize from 'pluralize'
import _ from 'lodash'
import d3 from 'd3'
import { Button, Col, ButtonGroup } from 'react-bootstrap'
import BlankChart from './BlankChart'
import ChartExperimentalTitle from './ChartExperimentalTitle'
//https://www.npmjs.com/package/jsx-control-statements
import BarChart from './BarChart'
import LineChart from './LineChart.jsx'

class ChartExperimentalCanvas extends Component {
  constructor (props) {
    super(props)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !_.isEqual(this.props.chart, nextProps.chart)
  }

  barChartType(selectedColumnDef, categoryColumns){
    if (selectedColumnDef){
      if (categoryColumns.indexOf(selectedColumnDef.key) >= 0) {
        return true
      }
    }
    return false
  }
  lineChartType(selectedColumnDef, categoryColumns){
    if (selectedColumnDef){
      if(selectedColumnDef.type == "date"){
        return true
      }
    }
    return false
  }
  convertChartData(chart){
    let chartData = []
    if(chart.chartData){
      var i, len = chart.chartData.length;
      for(i = 0; i < len; i++) {
        let newdict = {}
        //console.log(chart.chartData[i]['label'])
        newdict["key"] = chart.chartData[i]['label']
        newdict["value"] = Number(chart.chartData[i]['value'])
        chartData.push(newdict)
      }
    }
    return chartData
  }

  render () {
    //console.log(this.props);
    let { chart, rowLabel, selectedColumnDef, data, columns, sumBy, groupBy, displayChartOptions, categoryColumns } = this.props

    let barChartType = this.barChartType(selectedColumnDef, categoryColumns)
    let lineChartType = this.lineChartType(selectedColumnDef, categoryColumns)
    let chartData = this.convertChartData(chart)
    //console.log(chartData);

    let lineColor="blue"
    let yAxisTicks=5
    let yGridTicks=5
    let chartId = "test one"
    let dotColorOuter = "#7dc7f4"
    let dotColorInner = "#3f5175"
    let barColor = "#74d3eb"
    return (
      <Col md={9}>
        <Choose>
          <When condition={ selectedColumnDef }>

            <ChartExperimentalTitle
              columns={columns}
              sumBy={sumBy}
              rowLabel={rowLabel}
              groupBy={groupBy}
              selectedColumnDef={selectedColumnDef}/>

              <Choose>
                <When condition={ barChartType }>
                <BarChart
                  chart_data={chartData}
                  barColor={barColor}
                  yAxisTicks={yAxisTicks}
                  yGridTicks={yGridTicks}
                  chartId={chartId}/>
                </When>
                <When condition={ lineChartType }>
                <LineChart
                  chart_data={chartData}
                  lineColor={lineColor}
                  yAxisTicks={yAxisTicks}
                  yGridTicks={yGridTicks}
                  chartId={chartId}
                  dotColorInner = {dotColorInner}
                  dotColorOuter= {dotColorOuter}/>
                </When>

                <Otherwise>
                  <div> hello world </div>
                </Otherwise>
              </Choose>
          </When>
          <Otherwise>
            <BlankChart/>
          </Otherwise>
          </Choose>
      </Col>
    )
  }
}

export default ChartExperimentalCanvas
