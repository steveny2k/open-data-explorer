import React, { Component } from 'react'
import _ from 'lodash'
import d3 from 'd3'
import { Col } from 'react-bootstrap'
import BlankChart from './BlankChart'
import ChartExperimentalTitle from './ChartExperimentalTitle'
import ChartExperimentalSubTitle from './ChartExperimentalSubTitle'
import $ from 'jquery'

// https://www.npmjs.com/package/jsx-control-statements
// import LineChart from './LineChart.jsx'
import { LineChart, XAxis, BarChart, YAxis, CartesianGrid, Bar, Area, Legend, Line, AreaChart, Tooltip } from 'recharts'

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

  convertChartData (chartData) {
    if (chartData) {
      if (chartData.length > 1) {
        let newChartData = []
        let i = chartData.length
        let len = chartData.length
        for (i = 0; i < len; i++) {
          let newdict = {}
          // console.log(chart.chartData[i]['label'])
          newdict['key'] = String(chartData[i]['label'])
          newdict['value'] = Number(chartData[i]['value'])
          newChartData.push(newdict)
        }
        return newChartData
      }
    }
    return chartData
  }

  getChartProperties (chartData) {
    let chartProperties = {}
    if (chartData) {
      chartProperties = {
        horizontal: false,
        vertical: true,
        manyBars: false,
        layout: 'horizontal'
      }
      if (chartData.length > 20) {
        chartProperties.layout = 'vertical'
        chartProperties.manyBars = true
      }
    }
    return chartProperties
  }

  isGroupByz (groupByKeys, barChartType) {
    if (groupByKeys) {
      if (groupByKeys.length > 1) {
        return true
      }
    }
    return false
  }

  makeBars (groupByKeys) {
    let colorScale = d3.scale.linear().domain([1, groupByKeys.length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb('#007AFF'), d3.rgb('#FFF500')])

    let bars
    bars = groupByKeys.map(function (i) {
      if (i) {
        let colorIndex = groupByKeys.indexOf(i)
        console.log(colorIndex)
        return ( <Bar
                   dataKey={i}
                   key={i}
                   stackId="a"
                   fill={colorScale(colorIndex)} />)
      }
    })
    return bars
  }

  makeStuff (groupByKeys) {
    let colorScale = d3.scale.linear().domain([1, groupByKeys.length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb('#007AFF'), d3.rgb('#FFF500')])

    let items = {}
    items.bars = groupByKeys.map(function (i) {
      if (i) {
        let colorIndex = groupByKeys.indexOf(i)
        console.log(colorIndex)
        return (<Bar
                  dataKey={i}
                  stackId='a'
                  key={i}
                  fill={colorScale(colorIndex)}
                  key={i} />)
      }
    })
    items.lines = groupByKeys.map(function (i) {
      if (i) {
        let colorIndex = groupByKeys.indexOf(i)
        return (
        <Line
          type='monotone'
          dataKey={i}
          stackId='a'
          key={i}
          stroke={colorScale(colorIndex)} />
        )
      }
    })
    items.areas = groupByKeys.map(function (i) {
      if (i) {
        let colorIndex = groupByKeys.indexOf(i)
        return (
        <Area
          type='monotone'
          dataKey={i}
          stackId='i'
          key={i}
          stroke={colorScale('colorIndex')}
          fill={colorScale(colorIndex)} />
        )
      }
    })
    return items
  }

  render () {
    let barColor, lineColor, chartType,categoryColumns, items, manyBars, chartData, gridDirection, barsLayout
    let { rowLabel, selectedColumnDef, columns, sumBy, groupBy, filters} = this.props
    let groupKeys
    let bars
    groupKeys = this.props.query.groupKeys
    let chartProperties
    let isGroupBy = this.isGroupByz(groupKeys)
    chartType = this.props.chartType
    chartData = this.props.chart.chartData
    console.log('**in here****')
    console.log(this.props)
    if (!isGroupBy) {
      chartData = this.convertChartData(chartData)
      chartProperties = this.getChartProperties(chartData)
    }else {
      chartProperties = this.getChartProperties(chartData)
      bars = this.makeBars(groupKeys)
      console.log(bars)
      items = this.makeStuff(groupKeys)
    }
    // barColor = this.dataTypeColors(selectedColumnDef, categoryColumns)
    // console.log(barColor)
    // lineColor = this.dataTypeColors(selectedColumnDef, categoryColumns)

    barColor = '#7dc7f4'
    lineColor = '#7dc7f4'

    let yAxisTicks = 8
    let yGridTicks = 6
    let chartId = 'test one'
    let dotColorOuter = '#7dc7f4'
    let dotColorInner = '#3f5175'
    // let margin = {top: 20, right: 30, left: 20, bottom: 5}
    let margin = {top: 30, right: 50, bottom: 20, left: 40}
    let w = this.state.width - (margin.left + margin.right)
    let h = this.props.height - (margin.top + margin.bottom)

    return (
    <Col md={9}>
    <Choose>
      <When condition={selectedColumnDef}>
        <ChartExperimentalTitle
          columns={columns}
          sumBy={sumBy}
          rowLabel={rowLabel}
          groupBy={groupBy}
          selectedColumnDef={selectedColumnDef} />
        <Choose>
          <When condition={filters}>
            <ChartExperimentalSubTitle columns={columns} filters={filters} />
          </When>
          <Otherwise>
          </Otherwise>
        </Choose>
        <Choose>
          <When condition={chartType == 'bar' && !isGroupBy && chartProperties.manyBars}>
            <BarChart
              width={w}
              height={h}
              layout={chartProperties.layout}
              data={chartData}
              margin={margin}>
              <XAxis type="number" />
              <YAxis dataKey="key" type="category" />
              <CartesianGrid strokeDasharray="3 3" horizontal={chartProperties.horizontal} vertical={chartProperties.vertical} />
              <Tooltip/>
              <Legend />
              <Bar dataKey="value" fill={barColor} />
            </BarChart>
          </When>
          <When condition={chartType == 'bar' && !isGroupBy && !chartProperties.manyBars}>
            <BarChart
              width={w}
              height={h}
              layout={chartProperties.layout}
              data={chartData}
              margin={margin}>
              <XAxis type="key" type="category" />
              <YAxis label={rowLabel + ' value'} type="number" />
              <CartesianGrid strokeDasharray="3 3" vertical={chartProperties.vertical} horizontal={chartProperties.horizontal} />
              <Tooltip/>
              <Legend />
              <Bar dataKey="value" fill={barColor} />
            </BarChart>
          </When>
          <When condition={chartType == 'line' && !isGroupBy}>
            <LineChart width={w} height={h} data={chartData}>
              <XAxis dataKey="key" />
              <YAxis label={rowLabel + ' value'} />
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" vertical={false} />
              <Line type="monotone" dataKey="value" stroke={lineColor} />
              <Tooltip />
              <Legend />
            </LineChart>
          </When>
          <When condition={chartType == 'area' && !isGroupBy}>
            <AreaChart
              width={w}
              height={h}
              data={chartData}
              margin={margin}>
              <XAxis dataKey="key" />
              <YAxis label={rowLabel + ' value'} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip/>
              <Area
                type='monotone'
                dataKey='value'
                stroke={lineColor}
                fill={lineColor} />
            </AreaChart>
          </When>
          <When condition={isGroupBy && chartType == 'bar' && !chartProperties.manyBars}>
            <BarChart
              width={w}
              height={h}
              data={chartData}
              margin={margin}>
              <XAxis dataKey="label" type="category" />
              <YAxis type="number" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip/>
              <Legend />
              {items.bars}
            </BarChart>
          </When>
          <When condition={chartType == 'bar' && isGroupBy && chartProperties.manyBars}>
            <BarChart
              width={w}
              height={h}
              layout={chartProperties.layout}
              data={chartData}
              margin={margin}>
              <XAxis type="number" />
              <YAxis dataKey="label" type="category" />
              <CartesianGrid strokeDasharray="3 3" horizontal={chartProperties.horizontal} vertical={chartProperties.vertical} />
              <Tooltip/>
              <Legend />
              {items.bars}
            </BarChart>
          </When>
          <When condition={chartType == 'area' && isGroupBy}>
            <AreaChart
              width={w}
              height={h}
              data={chartData}
              margin={margin}>
              <XAxis dataKey="label" />
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip/>
              {items.areas}
            </AreaChart>
          </When>
          <When condition={chartType == 'line' && isGroupBy}>
            <LineChart
              width={w}
              height={h}
              data={chartData}
              margin={margin}>
              <XAxis dataKey="label" />
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip/>
              {items.lines}
            </LineChart>
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
    </Col>
    )
  }
}

ChartExperimentalCanvas.defaultProps = {
  width: 800,
  height: 500

}
export default ChartExperimentalCanvas
