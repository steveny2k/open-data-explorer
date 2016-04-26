import React, { Component } from 'react'
import Chart from '../Charts/Chart'

export default class Overview extends Component {
  constructor () {
    super()

    this.state = {
      cards: [
        {
          cols: 6,
          type: 'chart',
          groupBy: 'supervisor_district',
          selectedCol: 'neighborhood',
          filters: []
        }
      ]
    }
  }

  render () {
    return (
    <div>
    </div>
    )
  }
}
