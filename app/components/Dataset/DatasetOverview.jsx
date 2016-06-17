import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'

class DatasetOverview extends Component {
  render () {
    return (
      <Row id='DatasetOverview-description'>
        <Col sm={9}>
          <p className={'dataSetInfoDescription'}>{description}</p>
        </Col>
        <Col sm={3} className={'dataSetInfo'}>
          <b>Publishing Department:</b>{publishingDepartment}<br/>
          <b>License:</b> <a href={licenseLink}>{licenseName}</a><br/>
          <b>Number of Rows:</b> {numberFormat(parseInt(rowCount))}<br/>
          <b>Data Last Updated:</b> {dayUpdated}
        </Col>
      </Row>
    )
  }
}

export default DatasetOverview
