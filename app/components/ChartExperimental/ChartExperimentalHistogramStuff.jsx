import React, { Component } from 'react'
import d3 from 'd3'
import { XAxis, BarChart, YAxis, CartesianGrid, Bar, Tooltip } from 'recharts'
import { findMaxObjKeyValue, fillArray } from '../../helpers'
import CustomXaxisLabel from './CustomXaxisLabel'
import HistogramTooltip from './Histogram/HistogramTooltip'
import CustomYaxisLabel from './CustomYaxisLabel'
require('./Histogram/_Histogram.scss')

class ChartExperimentalHistogramStuff extends Component {
  explodeFrequencies (chartData) {
    let freqs = []
    chartData.forEach(function (el) {
      // function fillArray (value, len, arr)
      freqs = fillArray(Number(el.key), Number(el.value), freqs)
    })
    return freqs
  }

  getXScale (chartData, width) {
    return d3.scale.linear().domain([0, d3.max(chartData)]).range([0, width])
  }
  getYScale (chartData, height) {
    return d3.scale.linear().domain([0, d3.max(chartData, (d) => d.y)]).range([height, 0])
  }

  getNumberOfBins (freqs) {
    return d3.thresholdFreedmanDiaconis(freqs, Math.min.apply(null, freqs), Math.max.apply(null, freqs))
  }

  makeBarData (histogramData) {
    function findMean (data) {
      // first pop off the non-numeric keys.
      let min = data['x']
      let max = min + data['dx']
      return (max + min) / 2
    }
    let barData = histogramData.map(function (d, i) {
      let mean = findMean(d)
      return {'value': mean, 'frequency': d.y}
    })
    return barData
  }

  render () {
    let {h, w, margin, rowLabel, fillColor, chartData, yTickCnt, xTickCnt, valTickFormater} = this.props
    let freqs = this.explodeFrequencies(chartData)
    let xScale = this.getXScale(freqs, w)
    let histogramDataFn = d3.layout.histogram().bins(xScale.ticks(15))
    let histogramData = histogramDataFn(freqs)
    let dx = histogramData[0]['dx']
    let barData = this.makeBarData(histogramData)
    let maxValue = findMaxObjKeyValue(barData, 'frequency')
    let domainMax = maxValue + (maxValue * 0.03)

    return (
      <BarChart
        width={w}
        height={h}
        data={barData}
        margin={margin}
        barGap={0}
        barCategoryGap={0} >
        <XAxis
          dataKey='value'
          type='number'
          domain={[0, domainMax]}
          tickCount={xTickCnt}
          label={<CustomXaxisLabel val={'Values of ' + rowLabel} w={w} />} />
        <YAxis
          type='number'
          label={<CustomYaxisLabel val={'Frequency of Values'} h={h} />}
          tickCount={yTickCnt}
          tickFormatter={valTickFormater}
          domain={[0, domainMax]} />
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <Tooltip content={<HistogramTooltip dx={dx} />} />
        <Bar dataKey='frequency' fill={fillColor} />
      </BarChart>
    )
  }
}

ChartExperimentalHistogramStuff.propTypes = {
  chartData: React.PropTypes.array,
  h: React.PropTypes.number,
  w: React.PropTypes.number
}

export default ChartExperimentalHistogramStuff
