import React, { Component } from 'react'
import PanelColumns from './PanelColumns'
import { Col, Accordion } from 'react-bootstrap'

class Panel extends Component {
  ///Panel component for holding filter functions.
  render () {
    let { columns,selectColumn, metadata } = this.props

    return (
      <Col md={3}>
        <Accordion>
          <PanelColumns
            metadata={metadata}
            selectColumn={selectColumn}
            columns={columns}
          />
        </Accordion>
      </Col>
    )
  }
}
export default Panel
