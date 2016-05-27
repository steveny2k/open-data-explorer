import './_Dataset.scss'

import React, { Component, PropTypes } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import moment from 'moment'
import { numberFormat } from 'underscore.string'
import DownloadLinks from './DatasetDownloads'

class DatasetFrontMatter extends Component {
  render () {
    const { name, description, id, licenseName, licenseLink, rowsUpdatedAt, publishingDepartment, apiDomain, rowCount } = this.props
    let dayUpdated = moment.unix(rowsUpdatedAt).format('MM/DD/YYYY hh:mm A')
    return (
      <div className={'container-fluid dataSetTitle'}>
        <Row id="header">
          <Col sm={9}>
            <h1 className = {'datasetName'}> {name}</h1>
          </Col>
          <Col sm={3} className={'datasetDownLoadButtons'}>
            <DownloadLinks apiDomain={apiDomain} id={id} />
            <Button bsStyle='primary' href={`https://dev.socrata.com/foundry/${apiDomain}/${id}`} target='_blank'>API</Button>
          </Col>
        </Row>
        <Row id='header2'>
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
      </div>
    )
  }
}

export default DatasetFrontMatter
