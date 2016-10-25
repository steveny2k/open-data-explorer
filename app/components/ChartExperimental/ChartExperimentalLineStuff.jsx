import React, { Component } from 'react'
import d3 from 'd3'
import { XAxis, LineChart, YAxis, CartesianGrid, Line, Legend, Tooltip } from 'recharts'
import CustomKeyAxisTick from './CustomKeyAxisTick'
import CustomYaxisLabel from './CustomYaxisLabel'
class ChartExperimentalLineStuff extends Component {

  makeLines (groupKeys) {
    let lines = []
    if (groupKeys) {
      if (groupKeys.length > 1) {
        let colorScale = d3.scale.linear().domain([1, groupKeys.length])
          .interpolate(d3.interpolateHcl)
          .range([d3.rgb('#007AFF'), d3.rgb('#FFF500')])
        lines = groupKeys.map(function (i) {
          if (i) {
            let colorIndex = groupKeys.indexOf(i)
            return ( <Line
                       type='monotone'
                       dataKey={i}
                       stackId='a'
                       key={i}
                       stroke={colorScale(colorIndex)} />)
          }
        })
        return lines
      }
    }
  }
  render () {
    let {h, w, isGroupBy, valTickFormater, margin, rowLabel, groupKeys, fillColor, chartData, yTickCnt, xTickCnt, xAxisPadding, legendStyle } = this.props
    let lines = this.makeLines(groupKeys)

    return (
    <Choose>
      <When condition={!isGroupBy}>
        <LineChart width={w} height={h} data={chartData}>
          <XAxis
            dataKey='key'
            tickCount={xTickCnt}
            tick={<CustomKeyAxisTick/>}
            padding={xAxisPadding} />
          <YAxis
            type='number'
            label={<CustomYaxisLabel val={rowLabel} h={h} />}
            tickCount={yTickCnt}
            tickFormatter={valTickFormater}
            domain={[0, 'dataMax + 100']} />
          <CartesianGrid stroke='#eee' strokeDasharray='3 3' vertical={false} />
          <Line
            type='monotone'
            strokeWidth='3'
            dataKey='value'
            stroke={fillColor} />
          <Tooltip />
          <Legend wrapperStyle={legendStyle} />
        </LineChart>
      </When>
      <When condition={isGroupBy}>
        <LineChart
          width={w}
          height={h}
          data={chartData}
          margin={margin}>
          <XAxis dataKey="label" />
          <YAxis
            tickFormatter={valTickFormater}
            tickCount={yTickCnt}
            domain={[0, 'dataMax + 100']}
            label={<CustomYaxisLabel val={rowLabel + ' value'} h={h} />} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip/>
          {lines}
        </LineChart>
      </When>
    </Choose>
    )
  }
}

ChartExperimentalLineStuff.propTypes = {
  chartData: React.PropTypes.array,
  h: React.PropTypes.number,
  w: React.PropTypes.number,
  chartProperties: React.PropTypes.object,
  isGroupBy: React.PropTypes.bool,
  margin: React.PropTypes.object,
  rowLabel: React.PropTypes.string,
  groupKeys: React.PropTypes.array,
  fillColor: React.PropTypes.string,
// valTickFormater: React.PropTypes.function
}

export default ChartExperimentalLineStuff
