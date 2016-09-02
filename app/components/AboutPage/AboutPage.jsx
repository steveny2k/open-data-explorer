require('./_AboutPage.scss')

import React from 'react'
import { hashHistory } from 'react-router'
import { Grid, Row, Col } from 'react-bootstrap'


export default class AboutPage extends React.Component{
  render () {
    console.log("inside the sbout");
    return (
      <Grid fluid id='main-container' className={'catalogMain'}>
        <Row className={'catalogMainFacets'}>
            <h1>the about section</h1>
        </Row>
      </Grid>
    )
  }
}
