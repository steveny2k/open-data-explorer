require('./_AboutPage.scss')

import React from 'react'
import { Grid, Row } from 'react-bootstrap'

export default class AboutPage extends React.Component {
  render () {
    return (
      <Grid fluid id='main-container' className={'catalogMain'}>
        <Row className={'catalogMainFacets'}>
          <h1>the about section</h1>
        </Row>
      </Grid>
    )
  }
}
