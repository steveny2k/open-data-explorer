import React, { Component } from 'react'

class CustomYaxisLabel extends Component {
  render () {
    const {x, y, h, val } = this.props
    let xVal = (0 - ((h / 2) - 50))
    return (
    <g>
      <text
        x={xVal}
        y={0 - 3}
        dy={16}
        textAnchor='middle'
        fill='#666'
        transform='rotate(-90)'>
        {val}
      </text>
    </g>

    )
  }
}
export default CustomYaxisLabel
