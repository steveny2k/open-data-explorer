import React, { Component } from 'react'
class Bars extends Component {

  makeBars (manyBars, barColor, x, xMany, y, yMany, h, w, showToolTip, hideToolTip, d, i) {
    if (manyBars) {
      return (
      <rect
        fill={barColor}
        rx="3"
        ry="3"
        key={i}
        x={xMany(d.value)}
        y={yMany(d.key)}
        height={yMany.rangeBand()}
        width={xMany(d.value)}
        key={i}
        onMouseOver={showToolTip}
        onMouseOut={hideToolTip}
        data-key="value"
        data-value={d.value} />
      )
    }else {
      return (
      <rect
        fill={barColor}
        rx="3"
        ry="3"
        key={i}
        x={x(d.key)}
        y={y(d.value)}
        height={h - y(d.value)}
        width={x.rangeBand()}
        key={i}
        onMouseOver={showToolTip}
        onMouseOut={hideToolTip}
        data-key="value"
        data-value={d.value} />
      )
    }
  }

  render () {
    let _self = this
    let chartData = this.props.chartData
    let x = this.props.x
    let xMany = this.props.xMany
    let y = this.props.y
    let yMany = this.props.yMany
    let h = this.props.h
    let barColor = this.props.barColor
    let manyBars = this.props.manyBars
    let w = this.props.w

    let bars = []
    for (let i = 0; i < chartData.length; i++) {
      let bar = this.makeBars(manyBars, barColor, x, xMany, y, yMany, h, w, _self.props.showToolTip, _self.props.hideToolTip, chartData[i], i)
      bars.push(bar)
    }

    return (
    <g>
      {bars}
    </g>
    )
  }

}
Bars.propTypes = {
  chartData: React.PropTypes.array
}
export default Bars
