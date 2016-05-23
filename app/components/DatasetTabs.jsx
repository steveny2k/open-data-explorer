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
      <Row>
        <Col sm={12}>
          <Nav
            bsStyle='tabs'
            justified
            activeKey={active}
            onSelect={this.handleTabSelect}>
            <NavItem eventKey={'overview'}>
              Overview
            </NavItem>
            <NavItem eventKey={'details'}>
              Dataset Details
            </NavItem>
            <NavItem eventKey={'charts'}>
              Charts
            </NavItem>
            <NavItem eventKey={'table'}>
              Table Preview
            </NavItem>
          </Nav>
        </Col>
      </Row>)
  }
}

export default DatasetTabs
