import React, { Component } from 'react'

class CustomXaxisLabel extends Component {
  render () {
    // review this, you can also pass in x, y, width
    const {val} = this.props
    // let xVal = (0 - ((width / 2) - 50))
    return (
      <g>
        <text
          x={435}
          y={480}
          dy={16}
          textAnchor='middle'
          fill='#666'>
          {val}
        </text>
      </g>

    )
  }
}
export default CustomXaxisLabel
