import React, { Component } from 'react'
import _ from 'lodash'
import d3 from 'd3'
import { Col } from 'react-bootstrap'
import BlankChart from './BlankChart'
import ChartExperimentalTitle from './ChartExperimentalTitle'
import ChartExperimentalSubTitle from './ChartExperimentalSubTitle'
import $ from 'jquery'
import ChartExperimentalBarStuff from './ChartExperimentalBarStuff'
import ChartExperimentalLineStuff from './ChartExperimentalLineStuff'
import ChartExperimentalAreaStuff from './ChartExperimentalAreaStuff'
// https://www.npmjs.com/package/jsx-control-statements

class ChartExperimentalCanvas extends Component {

  componentWillMount () {
    var _self = this

    $(window).on('resize', function (e) {
      _self.updateSize()
    })

    this.setState({width: this.props.width})
  }
  componentDidMount () {
    this.updateSize()
  }
  componentWillUnmount () {
    $(window).off('resize')
  }

  updateSize () {
    var ReactDOM = require('react-dom')
    var node = ReactDOM.findDOMNode(this)
    var parentWidth = $(node).width()

    if (parentWidth < this.props.width) {
      this.setState({width: parentWidth - 20})
    } else {
      this.setState({width: this.props.width})
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    let thisChart = {
      thisChartData: this.props.chartData,
      thisChartType: this.props.chartType
    }
    let nextChart = {
      nextChartData: nextProps.chartData,
      nextChartType: nextProps.chartType
    }
    return !_.isEqual(thisChart, nextChart)
  }

  dataTypeColors (col, categoryFields) {
    let btnColors = ['#3498db', '#27ae60', '#16a085', '#7986cb', '#d35400', '#c0392b', '#a97964', '#8e44ad', '#f39c12']
    let numberFields = ['double', 'money', 'number']
    let textFields = ['text']
    let dateFields = ['date', 'calendar_date']
    let contactFields = ['email', 'phone', 'url']
    let locationFields = ['location']
    let booleanFields = ['checkbox']

    let allFields = [categoryFields, numberFields, textFields, dateFields, contactFields, locationFields, booleanFields]
    let selectedColor
    let isType = function (col, fieldList) {
      if (col) {
        if (typeof fieldList === 'function') {
          return fieldList(col)
        } else {
          if (fieldList.indexOf(col['type']) > -1) {
            return true
          }
        }
        return false
      }

      for (let i = 0; i < allFields.length; i++) {
        if (isType(col, allFields[i])) {
          return btnColors[i]
        }
      }
    }
  }

  convertChartData (chartData, selectedColumnDef) {
    let yrFormat = d3.time.format('%Y')
    if (chartData) {
      if (chartData.length > 1) {
        let newChartData = []
        let i = chartData.length
        let len = chartData.length
        for (i = 0; i < len; i++) {
          let newdict = {}
          if (selectedColumnDef) {
            let reData = /date/
            if (reData.test(selectedColumnDef.type)) {
              newdict['key'] = yrFormat(new Date(chartData[i]['label']))
              newdict['value'] = Number(chartData[i]['value'])
            }else {
              // console.log(chart.chartData[i]['label'])
              newdict['key'] = String(chartData[i]['label'])
              newdict['value'] = Number(chartData[i]['value'])
            }
          }
          newChartData.push(newdict)
        }
        return newChartData
      }
    }
    return chartData
  }

  isGroupByz (groupByKeys, barChartType) {
    if (groupByKeys) {
      if (groupByKeys.length > 1) {
        return true
      }
    }
    return false
  }

  render () {
    let { rowLabel, selectedColumnDef, columns, sumBy, groupBy, filters, groupKeys, chartData, chartType } = this.props
    let isGroupBy = this.isGroupByz(groupKeys)
    if (!isGroupBy) {
      chartData = this.convertChartData(chartData, selectedColumnDef)
    }
    let fillColor = '#7dc7f4'
    console.log('in *canvas*')
    console.log(this.props)
    let xAxisPadding = { left: 20, right: 20 }
    let xTickCnt = 5
    let yTickCnt = 6
    let dotColorOuter = '#7dc7f4'
    let dotColorInner = '#3f5175'
    // let margin = {top: 20, right: 30, left: 20, bottom: 5}
    let margin = {top: 30, right: 10, bottom: 20, left: 10}
    let w = this.state.width - (margin.left + margin.right)
    let h = this.props.height - (margin.top + margin.bottom)
    let formatValue = d3.format('.1s')
    // let formatValue = d3.format('d')
    let valTickFormater = function (d) { return formatValue(d)}
    let ytickCnt = 5
    let xtickCnt = 5
    let legendMargin = { bottom: 50 }
    let AxisPading = { left: 20, right: 20, bottom: 0 }
    let yAxisPadding = { top: 10 }
    return (
    <div>
    <Choose>
      <When condition={selectedColumnDef}>
        <Choose>
          <When condition={chartType === 'bar'}>
            <ChartExperimentalBarStuff
              w={w}
              h={h}
              isGroupBy={isGroupBy}
              margin={margin}
              rowLabel={rowLabel}
              fillColor={fillColor}
              groupKeys={groupKeys}
              chartData={chartData}
              yTickCnt={yTickCnt}
              xTickCnt={xTickCnt}
              xAxisPadding={xAxisPadding}
              valTickFormater={valTickFormater}
              colType={selectedColumnDef.type}
              xAxisPadding={xAxisPadding}
              legendMargin={legendMargin} />
          </When>
          <When condition={chartType === 'line'}>
            <ChartExperimentalLineStuff
              w={w}
              h={h}
              isGroupBy={isGroupBy}
              margin={margin}
              yTickCnt={yTickCnt}
              xTickCnt={xTickCnt}
              rowLabel={rowLabel}
              fillColor={fillColor}
              groupKeys={groupKeys}
              chartData={chartData}
              valTickFormater={valTickFormater}
              xAxisPadding={xAxisPadding}
              legendMargin={legendMargin} />
          </When>
          <When condition={chartType === 'area'}>
            <ChartExperimentalAreaStuff
              w={w}
              h={h}
              isGroupBy={isGroupBy}
              margin={margin}
              rowLabel={rowLabel}
              valTickFormater={valTickFormater}
              fillColor={fillColor}
              groupKeys={groupKeys}
              chartData={chartData}
              yTickCnt={yTickCnt}
              xTickCnt={xTickCnt}
              xAxisPadding={xAxisPadding}
              valTickFormater={valTickFormater} />
          </When>
          <Otherwise>
            <div>
              hello world
            </div>
          </Otherwise>
        </Choose>
      </When>
      <Otherwise>
        <BlankChart/>
      </Otherwise>
    </Choose>
    </div>
    )
  }
}

ChartExperimentalCanvas.propTypes = {
  chartData: React.PropTypes.array,
  chartType: React.PropTypes.string,
  groupKeys: React.PropTypes.array,
  columns: React.PropTypes.object,
  filters: React.PropTypes.object,
  rowLabel: React.PropTypes.string,
  selectedColumnDef: React.PropTypes.object,
  groupBy: React.PropTypes.string,
  sumBy: React.PropTypes.string
}

ChartExperimentalCanvas.defaultProps = {
  width: 800,
  height: 500,
  chartType: 'bar'
}
export default ChartExperimentalCanvas
