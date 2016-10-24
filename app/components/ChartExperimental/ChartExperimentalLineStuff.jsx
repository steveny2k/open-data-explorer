import React, { Component } from 'react'
import d3 from 'd3'
import { XAxis, LineChart, YAxis, CartesianGrid, Line, Legend, Tooltip } from 'recharts'

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
    let {h, w, isGroupBy, margin, rowLabel, groupKeys, fillColor, chartData} = this.props
    let lines = this.makeLines(groupKeys)
    return (
    <Choose>
      <When condition={!isGroupBy}>
        <LineChart width={w} height={h} data={chartData}>
          <XAxis dataKey="key" />
          <YAxis label={rowLabel + ' value'} />
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" vertical={false} />
          <Line type="monotone" dataKey="value" stroke={fillColor} />
          <Tooltip />
          <Legend />
        </LineChart>
      </When>
      <When condition={isGroupBy}>
        <LineChart
          width={w}
          height={h}
          data={chartData}
          margin={margin}>
          <XAxis dataKey="label" />
          <YAxis/>
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
  fillColor: React.PropTypes.string
}

export default ChartExperimentalLineStuff
