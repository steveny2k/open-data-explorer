import React, { Component } from 'react'

class CustomXaxisLabel extends Component {
  render () {
    const {x, y, width, val } = this.props
    let xVal = (0 - ((width / 2) - 50))
    return (
    <g>
      <text
        x={435}
        y={480}
        dy={16}
        textAnchor='middle'
        fill='#666'>
        {'Number of ' + val + 's'}
      </text>
    </g>

    )
  }
}
export default CustomXaxisLabel
