import React, { Component } from 'react'
import d3 from 'd3'
import { XAxis, BarChart, YAxis, CartesianGrid, Bar, Legend, Tooltip } from 'recharts'
import CustomYaxisLabel from './CustomYaxisLabel'
import CustomXaxisLabel from './CustomXaxisLabel'
import CustomKeyAxisTick from './CustomKeyAxisTick'

class ChartExperimentalBarStuff extends Component {
  makeBars (groupKeys, grpColorScale) {
    let bars = []
    if (groupKeys) {
      if (groupKeys.length > 1) {
        let colorScale = d3.scale.linear().domain([1, groupKeys.length])
          .interpolate(d3.interpolateHcl)
          .range([d3.rgb(grpColorScale['start']), d3.rgb(grpColorScale['end'])])
        bars = groupKeys.map(function (i) {
          if (i) {
            let colorIndex = groupKeys.indexOf(i)
            return (
              <Bar
                dataKey={i}
                stackId='a'
                key={i}
                fill={colorScale(colorIndex)} />)
          }
        })
        return bars
      }
    }
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
  render () {
    let {h, w, isGroupBy, margin, rowLabel, groupKeys, fillColor, chartData, yTickCnt, xTickCnt, valTickFormater, grpColorScale, domainMax, isDateSelectedCol} = this.props
    console.log(this.props)
    let bars = this.makeBars(groupKeys, grpColorScale)
    let chartProperties = this.getChartProperties(chartData)
    let xpadding = {bottom: 300}
    return (
      <Choose>
        <When condition={!isGroupBy && chartProperties.manyBars}>
          <BarChart
            width={w}
            height={h}
            layout={chartProperties.layout}
            data={chartData}
            margin={margin}>
            <XAxis
              tickFormatter={valTickFormater}
              type='number'
              tickCount={xTickCnt}
              padding={xpadding}
              label={<CustomXaxisLabel val={'Number of ' + rowLabel + 's'} w={w} />} />
            <YAxis dataKey='key' type='category' minTickGap={10} />
            <CartesianGrid strokeDasharray='3 3' horizontal={chartProperties.horizontal} vertical={chartProperties.vertical} />
            <Tooltip />
            <Bar dataKey='value' fill={fillColor} />
          </BarChart>
        </When>
        <When condition={!isGroupBy && !chartProperties.manyBars}>
          <BarChart
            width={w}
            height={h}
            data={chartData}
            margin={margin}>
            <Choose>
              <When condition={isDateSelectedCol}>
                <XAxis dataKey='key' type='category' tick={<CustomKeyAxisTick />} />
              </When>
              <Otherwise>
                <XAxis dataKey='key' type='category' />
              </Otherwise>
            </Choose>
            <YAxis
              tickFormatter={valTickFormater}
              tickCount={yTickCnt}
              domain={[0, domainMax]}
              type='number'
              label={<CustomYaxisLabel val={'Number of ' + rowLabel + 's'} h={h} />} />
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <Tooltip />
            <Bar dataKey='value' fill={fillColor} />
            <Legend />
          </BarChart>
        </When>
        <When condition={isGroupBy && chartProperties.manyBars}>
          <BarChart
            width={w}
            height={h}
            layout={chartProperties.layout}
            data={chartData}
            margin={margin}>
            <XAxis
              tickFormatter={valTickFormater}
              tickCount={yTickCnt}
              domain={[0, domainMax]}
              type='number'
              label={<CustomYaxisLabel val={rowLabel + ' value'} h={h} />} />
            <YAxis dataKey='label' type='category' />
            <CartesianGrid strokeDasharray='3 3' horizontal={chartProperties.horizontal} vertical={chartProperties.vertical} />
            <Tooltip />
            <Legend />
            {bars}
          </BarChart>
        </When>
        <When condition={isGroupBy && !chartProperties.manyBars}>
          <BarChart
            width={w}
            height={h}
            data={chartData}
            margin={margin}>
            <XAxis dataKey='label' type='category' />
            <YAxis
              tickFormatter={valTickFormater}
              tickCount={yTickCnt}
              domain={[0, domainMax]}
              type='number'
              label={<CustomYaxisLabel val={rowLabel + ' value'} h={h} />} />
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <Tooltip />
            <Legend />
            {bars}
          </BarChart>
        </When>
      </Choose>
    )
  }
}

ChartExperimentalBarStuff.propTypes = {
  chartData: React.PropTypes.array,
  h: React.PropTypes.number,
  w: React.PropTypes.number,
  isGroupBy: React.PropTypes.bool,
  margin: React.PropTypes.object,
  rowLabel: React.PropTypes.string,
  groupKeys: React.PropTypes.array,
  fillColor: React.PropTypes.string
}

export default ChartExperimentalBarStuff
