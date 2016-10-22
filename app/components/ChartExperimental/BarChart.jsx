import React, { Component } from 'react'
import d3 from 'd3'
import Grid from './Grid'
import ToolTip from './Tooltip'
import Axis from './Axis'
import $ from 'jquery'
import Bars from './Bars'

class BarChart extends Component {

  constructor (props) {
    super(props)
    this.state = {tooltip: {display: false, data: {key: '', value: ''}}, width: 0}
    this.hideToolTip = this.hideToolTip.bind(this)
    this.showToolTip = this.showToolTip.bind(this)
  }

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

  hideToolTip (e) {
    e.target.setAttribute('fill', '#7dc7f4')
    this.setState({tooltip: {display: false, data: {key: '', value: ''}}})
  }

  showToolTip (e) {
    e.target.setAttribute('fill', '#FFFFFF')
    this.setState({
      tooltip: {
        display: true,
        data: {
          key: e.target.getAttribute('data-key'),
          value: e.target.getAttribute('data-value')
        },
        pos: {
          x: e.target.getAttribute('x'), y: e.target.getAttribute('y')
        }
      }
    })
  }

  keyOrientation (manyBars) {
    let keyOrientation = ''
    if (manyBars) {
      keyOrientation = 'left'
    } else {
      keyOrientation = 'bottom'
    }
    return keyOrientation
  }

  valueOrientation (manyBars) {
    let valueOrientation = ''
    if (manyBars) {
      valueOrientation = 'bottom'
      console.log(valueOrientation)
    } else {
      valueOrientation = 'left'
    }
    return valueOrientation
  }

  manyBarz (chartData) {
    if (chartData.length > 20) {
      return true
    }
    return false
  }

  render () {
    console.log(this.props)
    let chartData = this.props.chartData
    let manyBars = this.manyBarz(chartData)
    let {chartId, barColor, valueAxisTicks, valueGridTicks} = this.props

    let margin = {top: 5, right: 50, bottom: 20, left: 40}
    let w = this.state.width - (margin.left + margin.right)
    let h = this.props.height - (margin.top + margin.bottom)

    let transform = 'translate(' + margin.left + ',' + margin.top + ')'
    let format = d3.format(',.0f')

    let x = d3.scale.ordinal()
      .domain(chartData.map(function (d) {
        return d.key
      }))
      .rangeRoundBands([0, w], 0.07)

    let y = d3.scale.linear()
      .domain([0, d3.max(chartData, function (d) {
        return d.value + (d.value * .15)
      })]).range([h, 0])

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickValues(chartData.map(function (d, i) {
        return d.key
      }))

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(valueAxisTicks)
      .tickSize(-w, 0, 0)

    let yGrid = d3.svg.axis()
      .scale(y)
      .orient('left')
      .ticks(valueGridTicks)
      .tickSize(-w, 0, 0)
      .tickFormat('')

    let xMany = y = d3.scale.linear()
      .domain([0, d3.max(chartData, function (d) {
        return d.value
      })]).range([  this.state.width, 0])

    let yMany = d3.scale.ordinal()
      .domain(d3.range(chartData.length))
      .rangeBands([0, h], 0.07)

    // .tickValues(chartData.map(function (d, i) {
    // return d.value
    // }))
    let xAxisMany = d3.svg.axis()
      .scale(xMany)
      .orient('bottom')
      .ticks(valueAxisTicks)
      .tickSize(-w, 0, 0)

    let yAxisMany = d3.svg.axis()
      .scale(yMany)
      .orient('left')
      .tickValues(chartData.map(function (d, i) {
        return d.key
      }))

    let xGridMany = d3.svg.axis()
      .scale(xMany)
      .orient('bottom')
      .ticks(valueGridTicks)
      .tickSize(0)
      // .tickFormat('')

    return (
    <div>
      <svg id={chartId} width={this.state.width} height={this.props.height}>
        <g transform={transform}>
          <Choose>
            <When condition={manyBars}>
              <Grid h={h} grid={xGridMany} gridType="x" />
              <Axis h={h} axis={xAxisMany} axisType="x" />
              <Axis h={h} axis={yAxisMany} axisType="y" />
            </When>
            <Otherwise>
              <Grid h={h} grid={yGrid} gridType="y" />
              <Axis h={h} axis={yAxis} axisType="y" />
              <Axis h={h} axis={xAxis} axisType="x" />
            </Otherwise>
          </Choose>
          <Bars
            manyBars={manyBars}
            chartData={chartData}
            x={x}
            xMany={xMany}
            y={y}
            yMany={yMany}
            h={h}
            w={w}
            barColor={barColor}
            showToolTip={this.showToolTip}
            hideToolTip={this.hideToolTip} />
          <ToolTip tooltip={this.state.tooltip} />
        </g>
      </svg>
    </div>
    )
  }
}

BarChart.defaultProps = {
  width: 800,
  height: 400,
  chartId: 'vi_chart'

}

export default BarChart
