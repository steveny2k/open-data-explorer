import './_Dataset.scss'

import React, { Component } from 'react'
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import moment from 'moment'
import { numberFormat } from 'underscore.string'
import DownloadLinks from './DatasetDownloads'

class DatasetFrontMatter extends Component {
  render () {
    const { name, id, rowsUpdatedAt, apiDomain } = this.props
    let dayUpdated = moment.unix(rowsUpdatedAt).format('MM/DD/YYYY hh:mm A')
    return (
      <Row className={'dataSetTitle'} id='header'>
        <Col sm={9}>
          <h1 className={'datasetName'}> {name}</h1>
        </Col>
        <Col sm={3} className={'datasetDownLoadButtons'}>
          <ButtonGroup style={{float: 'right'}}>
            <DownloadLinks apiDomain={apiDomain} id={id} />
            <Button className={'datasetLinks'} bsStyle='primary' href={`https://dev.socrata.com/foundry/${apiDomain}/${id}`} target='_blank'>API</Button>
          </ButtonGroup>
        </Col>
      </Row>
    )
  }
}

export default DatasetFrontMatter
