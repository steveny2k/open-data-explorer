import React, { Component } from 'react'
// import _ from 'lodash'
import d3 from 'd3'
import BlankChart from './BlankChart'
import $ from 'jquery'
import ChartExperimentalBarStuff from './ChartExperimentalBarStuff'
import ChartExperimentalLineStuff from './ChartExperimentalLineStuff'
import ChartExperimentalAreaStuff from './ChartExperimentalAreaStuff'
import ChartExperimentalHistogramStuff from './ChartExperimentalHistogramStuff'
import { findMaxObjKeyValue, isColTypeTest } from '../../helpers'

class ChartExperimentalCanvas extends Component {

  componentWillMount () {
    var _self = this

    $(window).on('resize', function (e) {
      _self.updateSize()
    })

    this.setState({
      width: this.props.width,
      height: this.props.height
    })
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
    let { embed } = this.props

    if (!(parentWidth === this.props.width)) {
      this.setState({width: parentWidth - 20})
    } else {
      this.setState({width: this.props.width})
    }
    if (embed) {
      // this is a hack for now, we'll lift the state up to make handling layout simpler
      let offset = $('#Embed-chartHeader').outerHeight(true) + 21
      console.log(offset)
      this.setState({height: window.innerHeight - offset})
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    /*
    This component needs to be refactored to handle resizing on a container, for now, we'll update the component always
    We should also not rerender the char
    let thisChart = {
      chartData: this.props.chartData,
      chartType: this.props.chartType,
      height: this.props.height,
      width: this.props.width
    }
    let nextChart = {
      chartData: nextProps.chartData,
      chartType: nextProps.chartType,
      height: nextProps.height,
      width: nextProps.width
    }
    return !_.isEqual(thisChart, nextChart) */
    return true
  }

  isSelectedColDate (selectedColumnDef) {
    if (selectedColumnDef.type === 'date') {
      return true
    }
    return false
  }

  convertChartData (chartData, selectedColumnDef, dateBy) {
    let yrFormat = d3.time.format('%Y')
    let monthFormat = d3.time.format('%m-%Y')
    if (chartData) {
      if (chartData.length > 1) {
        let newChartData = []
        let i = chartData.length
        let len = chartData.length
        for (i = 0; i < len; i++) {
          let newdict = {}
          if (selectedColumnDef) {
            let reDate = /date/
            if (reDate.test(selectedColumnDef.type)) {
              if (dateBy === 'month') {
                newdict['key'] = monthFormat(new Date(chartData[i]['label']))
              } else {
                newdict['key'] = yrFormat(new Date(chartData[i]['label']))
              }
              newdict['value'] = Number(chartData[i]['value'])
            } else {
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

  isNumericCol (selectedColumnDef) {
    if (selectedColumnDef.type === 'number') {
      return true
    }
    return false
  }

  setDefaultChartType (selectedColumnDef, chartType) {
    let isDateCol = isColTypeTest(selectedColumnDef, 'date')
    let isNumericCol = isColTypeTest(selectedColumnDef, 'number')
    if (!(chartType)) {
      if (isDateCol) {
        chartType = 'line'
      } else if (isNumericCol) {
        chartType = 'histogram'
      } else {
        chartType = 'bar'
      }
    }
    return chartType
  }

  render () {
    console.log('**chart canvas**')
    // console.log(this.props)
    let {rowLabel, selectedColumnDef, groupKeys, chartData, chartType, dateBy} = this.props
    chartType = this.setDefaultChartType(selectedColumnDef, chartType)
    let fillColor
    let grpColorScale
    const fillColorIndex = {
      'text': '#93c2de',
      'date': '#93deaf',
      'calendar_date': '#93deaf',
      'checkbox': '#deaf93',
      'number': '#de93c2',
      'double': '#de93c2',
      'money': '#de93c2',
      'other': '#E6FF2E'
    }
    const groupByColorIndex = {
      'text': {'start': '#55FFFF', 'end': '#0000ff'},
      'date': {'start': '#204c39', 'end': '#83F52C'},
      'calendar_date': {'start': '#204c39', 'end': '#83F52C'},
      'checkbox': {'start': '#cc8458', 'end': '#F0DACE'},
      'number': {'start': '#c71585', 'end': '#ffc0cb'},
      'double': {'start': '#c71585', 'end': '#ffc0cb'},
      'money': {'start': '#c71585', 'end': '#ffc0cb'}
    }
    let isDateSelectedCol
    let numericCol = this.isNumericCol(selectedColumnDef)
    let isGroupBy = this.isGroupByz(groupKeys)
    if (!isGroupBy) {
      chartData = this.convertChartData(chartData, selectedColumnDef, dateBy)
    }
    if (selectedColumnDef) {
      fillColor = fillColorIndex[selectedColumnDef.type]
      grpColorScale = groupByColorIndex[selectedColumnDef.type]
      isDateSelectedCol = this.isSelectedColDate(selectedColumnDef)
    }
    let xAxisPadding = { left: 20, right: 20 }
    let xTickCnt = 5
    let yTickCnt = 6
    // let dotColorOuter = '#7dc7f4'
    // let dotColorInner = '#3f5175'
    // let margin = {top: 20, right: 30, left: 20, bottom: 5}
    let margin = {top: 1, right: 5, bottom: 1, left: 5}
    let w = this.state.width - (margin.left + margin.right)
    let h = this.state.height - (margin.top + margin.bottom)
    let formatValue = d3.format('.3s')
    // let formatValue = d3.format('d')
    let valTickFormater = function (d) { return formatValue(d) }
    // let ytickCnt = 5
    // let xtickCnt = 5
    let legendMargin = { bottom: 50 }
    // let AxisPading = { left: 20, right: 20, bottom: 0 }
    // let yAxisPadding = { top: 10 }
    let maxValue = findMaxObjKeyValue(chartData, 'value')
    let domainMax = maxValue + (maxValue * 0.03)
    return (
      <div className='chartCanvas'>
        <Choose>
          <When condition={selectedColumnDef}>
            <Choose>
              <When condition={numericCol}>
                <Choose>
                  <When condition={chartType === 'histogram'}>
                    <ChartExperimentalHistogramStuff
                      w={w}
                      h={h}
                      domainMax={domainMax}
                      isGroupBy={isGroupBy}
                      margin={margin}
                      rowLabel={rowLabel}
                      fillColor={fillColor}
                      groupKeys={groupKeys}
                      chartData={chartData}
                      yTickCnt={yTickCnt}
                      xTickCnt={xTickCnt}
                      xAxisPadding={xAxisPadding}
                      valTickFormater={valTickFormater} />
                  </When>
                </Choose>
              </When>
              <When condition={chartType === 'bar'}>
                <ChartExperimentalBarStuff
                  w={w}
                  h={h}
                  domainMax={domainMax}
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
                  legendMargin={legendMargin}
                  grpColorScale={grpColorScale}
                  isDateSelectedCol={isDateSelectedCol} />
              </When>
              <When condition={chartType === 'line'}>
                <ChartExperimentalLineStuff
                  w={w}
                  h={h}
                  isGroupBy={isGroupBy}
                  margin={margin}
                  domainMax={domainMax}
                  yTickCnt={yTickCnt}
                  xTickCnt={xTickCnt}
                  rowLabel={rowLabel}
                  fillColor={fillColor}
                  groupKeys={groupKeys}
                  chartData={chartData}
                  valTickFormater={valTickFormater}
                  xAxisPadding={xAxisPadding}
                  legendMargin={legendMargin}
                  grpColorScale={grpColorScale} />
              </When>
              <When condition={chartType === 'area'}>
                <ChartExperimentalAreaStuff
                  w={w}
                  h={h}
                  isGroupBy={isGroupBy}
                  domainMax={domainMax}
                  margin={margin}
                  rowLabel={rowLabel}
                  valTickFormater={valTickFormater}
                  fillColor={fillColor}
                  groupKeys={groupKeys}
                  chartData={chartData}
                  yTickCnt={yTickCnt}
                  xTickCnt={xTickCnt}
                  xAxisPadding={xAxisPadding}
                  grpColorScale={grpColorScale} />
              </When>
              <Otherwise>
                <div>
                  hello world
                </div>
              </Otherwise>
            </Choose>
          </When>
          <Otherwise>
            <BlankChart />
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
  height: 500
}
export default ChartExperimentalCanvas
