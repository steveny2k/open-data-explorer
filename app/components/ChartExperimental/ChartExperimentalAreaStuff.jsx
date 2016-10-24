import React, { Component } from 'react'
import d3 from 'd3'
import { XAxis, AreaChart, YAxis, CartesianGrid, Area, Legend, Tooltip } from 'recharts'

class ChartExperimentalAreaStuff extends Component {

  makeAreas (groupKeys) {
    let areas = []
    if (groupKeys) {
      if (groupKeys.length > 1) {
        let colorScale = d3.scale.linear().domain([1, groupKeys.length])
          .interpolate(d3.interpolateHcl)
          .range([d3.rgb('#007AFF'), d3.rgb('#FFF500')])
        areas = groupKeys.map(function (i) {
          if (i) {
            let colorIndex = groupKeys.indexOf(i)
            return (  <Area
                        type='monotone'
                        dataKey={i}
                        stackId='i'
                        key={i}
                        stroke={colorScale('colorIndex')}
                        fill={colorScale(colorIndex)} />)
          }
        })
        return areas
      }
    }
  }
  render () {
    let {h, w, isGroupBy, margin, rowLabel, groupKeys, fillColor, chartData} = this.props
    let areas = this.makeAreas(groupKeys)

    return (
    <Choose>
      <When condition={!isGroupBy}>
        <AreaChart
          width={w}
          height={h}
          data={chartData}
          margin={margin}>
          <XAxis dataKey='key' />
          <YAxis label={rowLabel + ' value'} />
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <Tooltip/>
          <Area
            type='monotone'
            dataKey='value'
            stroke={fillColor}
            fill={fillColor} />
        </AreaChart>
      </When>
      <When condition={isGroupBy}>
        <AreaChart
          width={w}
          height={h}
          data={chartData}
          margin={margin}>
          <XAxis dataKey='label' />
          <YAxis/>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <Tooltip/>
          {areas}
        </AreaChart>
      </When>
    </Choose>
    )
  }
}

ChartExperimentalAreaStuff.propTypes = {
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

export default ChartExperimentalAreaStuff
