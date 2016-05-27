import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router'
import { Row, Col, Nav, NavItem } from 'react-bootstrap'

class DatasetTabs extends Component {
  constructor (props) {
    super(props)

    this.handleTabSelect = this.handleTabSelect.bind(this)
  }

  handleTabSelect (key) {
    let pathArray = this.props.location.pathname.split('/')
    // assure we are passing the viewtype at the end of the dataset path
    hashHistory.push('/' + pathArray[1] + '/' + pathArray[2] + '/' + pathArray[3] + '/' + key)
  }

  render () {
    let active = this.props.routes[2].path
    return (
      <Row className={'chartTabs'}>
        <Col sm={12}>
          <Nav
            bsStyle='tabs'
            justified
            activeKey={active}
            onSelect={this.handleTabSelect}>
            <NavItem eventKey={'overview'} className={'tabSelected'}>
              Overview
            </NavItem>
            <NavItem eventKey={'details'} className={'tabSelected'}>
              Dataset Details
            </NavItem>
            <NavItem eventKey={'charts'} className={'tabSelected'}>
              Charts
            </NavItem>
            <NavItem eventKey={'table'} className={'tabSelected'}>
              Table Preview
            </NavItem>
          </Nav>
        </Col>
      </Row>)
  }
}

export default DatasetTabs
