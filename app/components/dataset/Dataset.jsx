require('./dataset.scss')

import React from 'react'
import { Grid, Row, Col, Nav, NavItem, Button } from 'react-bootstrap'
import { hashHistory } from 'react-router'
import request from 'superagent'
import _ from 'lodash'
import moment from 'moment'
import soda from 'soda-js'
import pluralize from 'pluralize'
// might be best to use underscore inflector for both titleize and pluralize (among other transforms) - https://github.com/jeremyruppel/underscore.inflection

import DownloadLinks from './DownloadLinks.jsx'
import DataTable from './DataTable.jsx'
import DatasetMap from './DatasetMap.jsx'
import ChartsContainer from './charts/ChartsContainer.jsx'
import DataDictionary from './dictionary/DataDictionary.jsx'
import Login from '../home/Login.jsx'

const viewOptions = ['overview', 'details', 'charts', 'map', 'table']
// since only a handful of categories may be numeric, setting an array here to reduce the API call overhead - we should likely encode these as text anyway in the dataset
const numericCategories = ['supervisor_district']

export default class Dataset extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      domain: 'data.sfgov.org',
      datasetId: null,
      tableWidth: 0,
      viewDef: [],
      fieldDefs: [],
      dataPage: 0,
      data: [],
      orderBy: '',
      numRows: null,
      map: false,
      selectedCol: null,
      colSortDirs: {},
      viewType: 'overview',
      mapToken: 'pk.eyJ1IjoiZGF0YXNmIiwiYSI6ImNpazF6YWZ0NTM5bjV2eWtpOG1pZWlndGUifQ.z1NQOOB-SDyNVbspnyMKmw',
      mapView: {
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v8',
        center: [-122.438153, 37.767806],
        zoom: 11
      },
      bbox: [-122.53463745117182, 37.702746645595056, -122.33963012695307, 37.83247440097922]
    }

    this.loadView = this.loadView.bind(this)
    this.loadData = this.loadData.bind(this)
    this.loadColumnProps = this.loadColumnProps.bind(this)
    this.handleTabSelect = this.handleTabSelect.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.onSortChange = this.onSortChange.bind(this)

    this.nbeId
  }

  handleTabSelect (evkey) {
    let pathArray = this.props.location.pathname.split('/')
    // assure we are passing the viewtype at the end of the dataset path
    hashHistory.push('/' + pathArray[1] + '/' + pathArray[2] + '/' + pathArray[3] + '/' + viewOptions[evkey])
  }

  handlePagination (event, selectedEvent) {
    this.setState({dataPage: selectedEvent.eventKey - 1}, this.loadData)
  }

  onSortChange (columnKey, sortDir) {
    this.newState.colSortDirs = {
      [columnKey]: sortDir
    }
    this.loadData()
  }

  loadView () {
    var migrationUrl = 'https://' + this.state.domain + '/api/migrations/' + this.props.params.id + '.json'
    request.get(migrationUrl, function (err, response) {
      var nbeId = this.nbeId = response.body.nbeId
      var viewUrl = 'https://' + this.state.domain + '/api/views/' + response.body.obeId + '.json'
      var el = document.getElementById('content')
      var isMap = false
      var fieldDefs = []
      request.get(viewUrl, function (err, response) {
        var viewDef = response.body
        var pkey = response.body.rowIdentifierColumnId || null
        viewDef.columns.map(function (column) {
          var colDef = {}
          // exclude system calculated fields
          if (!column.fieldName.includes(':@')) {
            colDef.id = column.id
            colDef.pkey = (pkey == colDef.id ? true : false)
            colDef.key = column.fieldName
            colDef.name = column.name.replace(/[_-]/g, ' ')
            colDef.type = column.dataTypeName
            colDef.view = column.format.view ? column.format.view : null
            colDef.width = column.width
            colDef.description = column.description
            colDef.smallest = column.cachedContents.smallest || null
            colDef.largest = column.cachedContents.largest || null
            if (colDef.type == 'location') {
              isMap = true
            }
            fieldDefs = fieldDefs.concat([colDef])
          }
        })
        var countUrl = 'https://' + this.state.domain + '/resource/' + nbeId + '.json?$select=count(*)'
        var numRows = 0
        request.get(countUrl, function (err, response) {
          numRows = parseInt(response.body[0].count)
          var viewType = this.props.params.viewType ? this.props.params.viewType : this.state.viewType
          this.newState = {
            datasetId: nbeId,
            viewDef: viewDef,
            viewType: viewType,
            fieldDefs: fieldDefs,
            tableWidth: el.offsetWidth - 30,
            map: isMap,
            numRows: numRows
          }
          this.loadColumnProps()
        }.bind(this))
      }.bind(this))
    }.bind(this))
  }

  loadColumnProps () {
    var fieldDefsUpdated = this.newState.fieldDefs
    fieldDefsUpdated.forEach(function (column, i) {
      if (column.type === 'text' || numericCategories.indexOf(column.key) > -1) {
        let colKey = column.key === 'category' ? 'category' : column.key + ' as category'
        let select = column.type === 'text' ? '$select=count(*), ' + colKey : '$select=count(*),' + column.key + ' as category'
        let groupBy = '$group=category'
        var queryString = [
          'https://' + this.state.domain + '/resource/' + this.nbeId + '.json?',
          select,
          groupBy,
          '$order=count+desc',
          '$limit=100'].join('&')
        request.get(queryString, function (err, response) {
          if (response.body.length !== 100 && response.body.length !== 1 && response.body[0].count / this.newState.numRows <= 0.95) {
            column.type = 'category'
            let order = response.body.map(function (cat) {
              if (typeof cat.category !== 'undefined') {
                return cat.category
              } else {
                return 'Unknown'
              }
            })
            let counts = response.body.map(function (cat) {
              return cat.count
            })
            column.stats = {
              order: order,
              counts: counts
            }
          }
        }.bind(this))
      }
    }.bind(this))
    this.newState.fieldDefs = fieldDefsUpdated
    this.initiateSortOrder()
  }

  initiateSortOrder () {
    let {viewDef} = this.newState
    this.newState.colSortDirs = {}
    if (viewDef.metadata.jsonQuery) {
      viewDef.metadata.jsonQuery.order.map(function (order, i) {
        let colSortDirsNew = {
          [order.columnFieldName]: (order.ascending ? 'asc' : 'desc')
        }
        this.newState.colSortDirs = _.merge(colSortDirsNew, this.newState.colSortDirs)
      }.bind(this))
    }
    this.loadData()
  }

  loadData () {
    let consumer = new soda.Consumer(this.state.domain)

    let query = consumer.query()
      .withDataset(this.nbeId)
      .limit(1000)
      .offset(1000 * this.state.dataPage)

    if (this.newState.colSortDirs) {
      for (var key in this.newState.colSortDirs) {
        // check also if property is not inherited from prototype
        if (this.newState.colSortDirs.hasOwnProperty(key)) {
          query.order(key + ' ' + this.newState.colSortDirs[key])
        }
      }
    }

    query.getRows()
      .on('success', function (rows) {
        this.newState.data = rows
        this.setState(this.newState)
      }.bind(this))
      .on('error', function (error) {})
  }

  componentDidMount () {
    if (this.props.params.id !== this.state.datasetId) {
      this.loadView()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.id !== this.state.datasetId) {
      this.setState({datasetId: nextProps.params.id}, this.loadView)
    }
    if (nextProps.params.viewType !== this.state.viewType) {
      this.setState({viewType: nextProps.params.viewType})
    }
  }

  render () {
    'use strict'
    let {viewDef} = this.state
    let {rowsUpdatedAt, name, license, metadata} = viewDef
    let dayUpdated = moment.unix(rowsUpdatedAt).format('MM/DD/YYYY hh:mm A')
    let apiLink = 'https://dev.socrata.com/foundry/' + this.state.domain + '/' + this.state.datasetId
    let rowLabel = metadata ? (metadata.rowLabel ? pluralize(metadata.rowLabel) : 'Records') : ''
    let licenseLink = ''

    if (license) {
      licenseLink = <a href={license.termsLink} target='_blank'>{license.name}</a>
    }

    var active = _.indexOf(viewOptions, this.state.viewType)
    var mapTab = this.state.map ? <NavItem eventKey={3}>
                                    Map
                                  </NavItem> : null
    var tabs = (
      <Row>
        <Col sm={12}>
          <Nav
            bsStyle='tabs'
            justified
            activeKey={active}
            onSelect={this.handleTabSelect}>
            <NavItem eventKey={0}>
              Overview
            </NavItem>
            <NavItem eventKey={1}>
              Dataset Details
            </NavItem>
            <NavItem eventKey={2}>
              Charts
            </NavItem>
            {mapTab}
            <NavItem eventKey={4}>
              Table Preview
            </NavItem>
          </Nav>
        </Col>
      </Row>)

    var returnContent = function (params) {
      if (params.viewType === 'map') {
        return (
        <DatasetMap token={this.state.mapToken} view={this.state.mapView} bbox={this.state.bbox} />
        )
      } else if (params.viewType === 'charts') {
        return (
        <ChartsContainer datasetId={this.state.datasetId} fieldDefs={this.state.fieldDefs} rowLabel={rowLabel} />
        )
      } else if (params.viewType === 'details') {
        return (
        <DataDictionary fieldDefs={this.state.fieldDefs} />
        )
      } else {
        return (
        <DataTable
          data={this.state.data}
          fieldDefs={this.state.fieldDefs}
          colSortDirs={this.state.colSortDirs}
          width={this.state.tableWidth}
          totalRows={this.state.numRows}
          perPage={1000}
          currentPage={this.state.dataPage + 1}
          handlePagination={this.handlePagination}
          onSortChange={this.onSortChange} />
        )
      }
    }.bind(this)

    let content = returnContent(this.props.params)

    if (!this.state.datasetId) {
      return (
      <Grid fluid id='main-container'>
        <Row>
          <Col sm={12} id='content'>
          </Col>
        </Row>
      </Grid>
      )
    } else {
      return (
        <Grid fluid id='main-container'>
          <Row id='header'>
            <Col sm={12}>
              <h1>{name}</h1>
            </Col>
            <Col sm={9}>
              <DownloadLinks domain={this.state.domain} datasetId={this.state.datasetId} />
              <Button bsStyle='primary' href={apiLink} target='_blank'>
                API
              </Button>
              <p>
                {this.state.viewDef.description}
              </p>
            </Col>
            <Col sm={3}>
              <b>Publishing Department:</b>
              {metadata.custom_fields['Department Metrics']['Publishing Department']}
              <br/>
              <b>License:</b>
              {licenseLink}
              <br/>
              <b>Number of Rows:</b>
              {this.state.numRows}
              <br/>
              <b>Data Last Updated:</b>
              {dayUpdated}
            </Col>
          </Row>
        {tabs}
          <Row>
            <Col sm={12} id='content'>
            {content}
            </Col>
          </Row>
        </Grid>
      )
    }
  }
}
