import React, { Component } from 'react'
import ChartColumns from './PanelColumns'
import { Col, Accordion } from 'react-bootstrap'

class BlankChart extends Component {
  ///Blank chart that gets intialized when user first hits chart page.
  render () {
    return (
        <div className='chartCanvasBlankCanvas'>
          Click on a dataset column to the right to start your charting adventure :-)
        </div>
    )
  }
}

export default BlankChart
