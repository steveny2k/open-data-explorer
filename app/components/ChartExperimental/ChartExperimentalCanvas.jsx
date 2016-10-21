import React, { Component } from 'react'
import _ from 'lodash'
import d3 from 'd3'
import { Col } from 'react-bootstrap'
import BlankChart from './BlankChart'
import ChartExperimentalTitle from './ChartExperimentalTitle'
import ChartExperimentalSubTitle from './ChartExperimentalSubTitle'

// https://www.npmjs.com/package/jsx-control-statements
// import LineChart from './LineChart.jsx'
import { LineChart, XAxis, BarChart, YAxis, CartesianGrid, Bar, Area, Legend, Line, AreaChart, Tooltip } from 'recharts'

class ChartExperimentalCanvas extends Component {

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

    let isType = function (col, fieldList) {
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
  lineTickFormat (d) {
    let parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S.%L').parse
    d.key = parseDate(d.key)
    d.key = d3.time.format('%Y')
  }

  getChartProperties (chartData, chartType) {
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
      if (chartType === 'bar' && chartData.length > 20) {
        chartProperties.direction.horizontal = true
        chartProperties.direction.vertical = false
      }
    }
    return chartProperties
  }

  isSubtitlez (filters) {
    if (filters) {
      return true
    }
    return false
  }

  isGroupByz (groupByKeys, barChartType) {
    if (groupByKeys) {
      if (groupByKeys.length > 1) {
        return true
      }
    }
    return false
  }

  makeBars (groupByKeys, chartType) {
    let colorScale = d3.scale.linear().domain([1, groupByKeys.length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb('#007AFF'), d3.rgb('#FFF500')])

    let items = {}
    items.bars = groupByKeys.map(function (i) {
      if (i) {
        let colorIndex = groupByKeys.indexOf(i)
        return (<Bar dataKey={i} stackId='a' fill={colorScale(colorIndex)} />)
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
          stackId='a'
          stroke={colorScale(colorIndex)}
          fill={colorScale(colorIndex)} />
        )
      }
    })
    return items
  }

  render () {
    console.log(this.props)
    let chartType, items, manyBars, chartData, gridDirection, barsLayout
    let { rowLabel, selectedColumnDef, columns, sumBy, groupBy, filters} = this.props
    let groupKeys = this.props.query.groupKeys
    let chartProperties
    let isGroupBy = this.isGroupByz(groupKeys)
    chartType = this.props.chartType
    chartData = this.props.chart.chartData
    console.log('**in here****')
    chartData = this.convertChartData(chartData)
    chartProperties = this.getChartProperties(chartData)
    if (isGroupBy) {
      items = this.makeBars(chartData)
      chartProperties = this.getChartProperties(groupKeys)
    }
    let barColor = '#7dc7f4'
    let lineColor = '#7dc7f4'

    let isSubtitle = this.isSubtitlez(filters)
    let yAxisTicks = 8
    let yGridTicks = 6
    let chartId = 'test one'
    let dotColorOuter = '#7dc7f4'
    let dotColorInner = '#3f5175'
    let margin = {top: 20, right: 30, left: 20, bottom: 5}
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
          <When condition={isSubtitle}>
            <ChartExperimentalSubTitle columns={columns} filters={filters} />
          </When>
          <Otherwise>
          </Otherwise>
        </Choose>
        <Choose>
          <When condition={chartType == 'bar' && !isGroupBy && chartProperties.manyBars}>
            <BarChart
              width={800}
              height={500}
              layout={chartProperties.layout}
              data={chartData}
              margin={margin}>
              <XAxis/>
              <YAxis dataKey="key" />
              <CartesianGrid strokeDasharray="3 3" horizontal={chartProperties.horizontal} vertical={chartProperties.vertical} />
              <Tooltip/>
              <Legend />
              <Bar dataKey="value" fill={barColor} />
            </BarChart>
          </When>
          <When condition={chartType == 'bar' && !isGroupBy && !chartProperties.manyBars}>
            <BarChart
              width={800}
              height={500}
              layout={chartProperties.layout}
              data={chartData}
              margin={margin}>
              <XAxis type="key" />
              <YAxis label={rowLabel + ' value'} />
              <CartesianGrid strokeDasharray="3 3" horizontal={chartProperties.horizontal} vertical={chartProperties.vertical} />
              <Tooltip/>
              <Legend />
              <Bar dataKey="value" fill={barColor} />
            </BarChart>
          </When>
          <When condition={chartType == 'line' && !isGroupBy}>
            <LineChart width={800} height={500} data={chartData}>
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
              width={800}
              height={500}
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
              width={800}
              height={500}
              data={chartData}
              margin={margin}>
              <XAxis dataKey="label" />
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3" vertical={chartProperties.vertical} hortizontal={chartProperties.horizontal} />
              <Tooltip/>
              <Legend />
              {items.bars}
            </BarChart>
          </When>
          <When condition={chartType == 'area' && isGroupBy}>
            <AreaChart
              width={800}
              height={500}
              data={chartData}
              margin={margin}>
              <XAxis dataKey="key" />
              <YAxis label={rowLabel + ' value'} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip/>
              {items.areas}
            </AreaChart>
          </When>
          <When condition={chartType == 'line' && isGroupBy}>
            <AreaChart
              width={800}
              height={500}
              data={chartData}
              margin={margin}>
              <XAxis dataKey="key" />
              <YAxis label={rowLabel + ' value'} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip/>
              {items.lines}
            </AreaChart>
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

export default ChartExperimentalCanvas
