import './_Dataset.scss'

import React, { Component } from 'react'
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap'
import DownloadLinks from './DatasetDownloads'
import moment from 'moment'

class DatasetFrontMatter extends Component {
  render () {
    const { name, id, rowsUpdatedAt, apiDomain, migrationId } = this.props
    let dayUpdated = moment.unix(rowsUpdatedAt).format('MM/DD/YYYY')
    let timeUpdated = moment.unix(rowsUpdatedAt).format('hh:mm A')
    return (
      <Row className={'dataSetTitle'} id='header'>
        <Col sm={9}>
          <h1 className={'datasetName'}> {name}</h1>
          <p className={'small text-muted'}>Data last updated {dayUpdated} at {timeUpdated}</p>
        </Col>
        <Col sm={3} className={'datasetDownLoadButtons'}>
          <ButtonGroup style={{float: 'right', marginTop: '1em'}}>
            <DownloadLinks apiDomain={apiDomain} id={id} migrationId={migrationId} />
            <Button className={'datasetLinks'} bsStyle='primary' href={`https://dev.socrata.com/foundry/${apiDomain}/${id}`} target='_blank'>API Docs</Button>
          </ButtonGroup>
        </Col>
      </Row>
    )
  }
}

export default DatasetFrontMatter
