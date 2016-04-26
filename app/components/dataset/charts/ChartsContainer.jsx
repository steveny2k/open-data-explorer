require('./charts.scss')

import React from 'react'
import update from 'react-addons-update'
import { Col, Row, Button, ButtonGroup } from 'react-bootstrap'
import request from 'superagent'
import soda from 'soda-js'
import _ from 'lodash'
import { capitalize, titleize } from 'underscore.string'
import pluralize from 'pluralize'
import moment from 'moment'

import Chart from './Chart.jsx'
import ChartOptions from './ChartOptions.jsx'

const viewOptions = {
  '0': 'top',
  '1': 'bottom',
  '2': 'all',
  '3': 'compare'
}

const defaultStartDate = {
  'month': moment().subtract(5, 'years').startOf('year'),
  'day': moment().subtract(1, 'year').startOf('year')
}

const colors = ['#a78ac6', '#04ae14', '#fb680e', '#fe32fe', '#a49659', '#ff5a8b', '#29a5ae', '#0eab6f', '#b479fc', '#de7b5c', '#89a004', '#3599fc', '#c68a13', '#f459c7', '#a99090', '#d47aa0', '#379fd4', '#76a080', '#77a250', '#fd634e', '#c579d6', '#8d8af4', '#df5ef5', '#8199ae', '#e37a31', '#40aa46', '#ea6f7b', '#c8884b', '#c18972', '#0fa98f', '#a4982b', '#fe43de', '#e06eb8', '#65a718', '#7994dd', '#b688a7', '#fd56a9', '#9b9779', '#ff5f6d', '#c88389', '#7d9c97', '#dd67de', '#5fa570', '#9292be', '#b79037', '#929c48', '#899d69', '#c57fb7', '#a985dd', '#e96c99', '#58a0b6', '#df7d02', '#f46d33', '#5ca297', '#9f91a7', '#ee6e65', '#d47f73', '#7da234', '#ec724d', '#54a857', '#2b9cec', '#b98e5a', '#d1842f', '#b4930e', '#af7fed', '#7298cd', '#db788a', '#18ac57', '#f447f6', '#cc855b', '#c773ed', '#4ea587', '#da7e4c', '#ff50b8', '#6a93f4', '#e06ac7', '#28a2c5', '#69a53d', '#ac9172', '#c98199', '#a78cb6']

export default class ChartsContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedCol: null,
      data: [],
      dateBy: 'year',
      groupBy: null,
      viewOption: '0',
      defaultMaxCategories: 5,
      filters: []
    }

    this._dataSuccessHandler = this._dataSuccessHandler.bind(this)
    this._dataFailureHandler = this._dataFailureHandler.bind(this)
    this._setSodaQuery = this._setSodaQuery.bind(this)
    this._handleColumnSelect = this._handleColumnSelect.bind(this)
    this._toggleYearMonth = this._toggleYearMonth.bind(this)
    this._handleGroupBy = this._handleGroupBy.bind(this)
    this._handleViewOptions = this._handleViewOptions.bind(this)
    this._handleCompare = this._handleCompare.bind(this)
    this.handleAddFilter = this.handleAddFilter.bind(this)
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this._buildChartTitle = this._buildChartTitle.bind(this)
    this._mergeFilter = this._mergeFilter.bind(this)

    this.fieldDef
    this.groupDef
    this.selectedCol
    this.dateBy = 'year'
    this.groupBy = null
    this.data = []
  }

  _handleColumnSelect (selectedCol, ev) {
    this.selectedCol = selectedCol
    let fieldDefs = this.props.fieldDefs,
      fieldIdx = _.findIndex(fieldDefs, {'key': selectedCol}),
      fieldDef = this.fieldDef = fieldIdx !== -1 ? fieldDefs[fieldIdx] : null

    this._runQuery()
  }

  _toggleYearMonth () {
    this.dateBy = this.state.dateBy == 'month' ? 'year' : 'month'
    let filterIdx = _.findIndex(this.state.filters, {'key': this.fieldDef.key}),
      filter = this.state.filters[filterIdx]
      // duration = moment.duration(filter.endDate - filter.startDate).asYears()

    if (this.state.dateBy === 'year') {
      let updatedFilter = {}
      updatedFilter.startDate = defaultStartDate.month
      updatedFilter.endDate = moment()
      this.setState({
        filters: update(this.state.filters, {[filterIdx]: {$merge: updatedFilter}})
      }, this._runQuery)
    } else {
      this._runQuery()
    }
  }

  _handleGroupBy (val) {
    this.groupBy = val ? val.value : null
    this._runQuery()
  }

  _handleViewOptions (ev) {
    if (ev.target.value !== this.state.viewOption) {
      if (ev.target.value == 3) {
        this.setState({
          viewOption: ev.target.value
        })
      } else {
        this.setState({
          data: this.data,
          viewOption: ev.target.value
        })
      }
    }
  }

  _handleCompare (key) {
    let data = this.data
    let comparedData = []
    let remainingIndex = null
    let otherKey = 'Other ' + pluralize(this.groupDef.name)
    data.forEach(function (datum, index, array) {
      if (datum.key.toLowerCase() == key.toLowerCase()) {
        datum.key = titleize(datum.key)
        comparedData.push(datum)
      } else {
        if (remainingIndex === null) {
          comparedData.push({key: otherKey, values: []})
          remainingIndex = _.findIndex(comparedData, {key: otherKey})
        }
        datum.values.forEach(function (value, i) {
          var idx = _.findIndex(comparedData[remainingIndex].values, {label: value.label})
          if (idx !== -1) {
            comparedData[remainingIndex].values[idx].value += parseInt(value.value)
          } else {
            comparedData[remainingIndex].values.push({label: value.label, value: parseInt(value.value)})
          }
        })
      }
    })
    this.setState({
      data: comparedData
    })
  }

  handleAddFilter (val) {
    let fieldDefs = this.props.fieldDefs,
      filterDef = fieldDefs[_.findIndex(fieldDefs, {'key': val.value})] || null

    let filter = [{
      name: val.label,
      key: val.value,
      type: filterDef ? filterDef.type : 'checkbox'
    }]

    if (filterDef && filterDef.type === 'number') {
      filter[0].min = parseInt(filterDef.smallest)
      filter[0].max = parseInt(filterDef.largest)
      filter[0].range = [parseInt(filterDef.smallest), parseInt(filterDef.largest)]
    }

    if (filterDef && filterDef.type === 'calendar_date') {
      switch (this.dateBy) {
        case 'year':
        case 'month':
          filter[0].startDate = moment(filterDef.smallest)
          filter[0].endDate = moment(filterDef.largest)
          break
        /*
        case 'month':
        filter[0].startDate = moment().subtract(5,'years').startOf('year')
        filter[0].endDate = moment(filterDef.largest)
        break*/
        default:
          filter[0].startDate = moment().subtract(1, 'year').startOf('year')
          filter[0].endDate = moment(filterDef.largest)
          break
      }
    }

    if (_.findIndex(this.state.filters, {'key': val.value}) === -1) {
      this.setState({
        filters: this.state.filters.concat(filter)
      })
    }
  }

  handleRemoveFilter (key) {
    let fieldDefs = this.props.fieldDefs
    let filterIdx = _.findIndex(this.state.filters, {'key': key})

    this.setState({
      filters: update(this.state.filters, {$splice: [[filterIdx, 1]]})
    }, this._runQuery)
  }

  setFilter (options) {
    let updatedFilters = this._mergeFilter(options)
    this.setState({filters: updatedFilters}, this._runQuery)
  }

  _mergeFilter (options) {
    let filterIdx = _.findIndex(this.state.filters, {'key': options.key}),
      filters = this.state.filters,
      updatedFilters = update(filters, {[filterIdx]: {$merge: options }})

    return updatedFilters
  }

  _dataSuccessHandler (rows) {
    let fieldDef = this.fieldDef
    let groupBy = this.groupBy
    let data = []
    let keys = []
    let selectedCol = this.selectedCol

    // pre-process returned data if necessary
    if (fieldDef.type === 'checkbox') {
      // data returned from checkboxes needs to be pre-processed a little
      var trueKey = selectedCol + '_true'
      var falseKey = selectedCol + '_false'
      for (var i = 0; i < rows.length; i++) {
        var label = rows.length > 1 ? rows[i][groupBy] : fieldDef.name
        label = typeof label === 'undefined' ? 'Unknown' : label
        if (i == 0) {
          data.push({key: 'True', values: [{value: rows[i][trueKey], label: label}]})
          data.push({key: 'False', values: [{value: rows[i][falseKey], label: label}]})
        } else {
          data[0].values.push({value: rows[i][trueKey], label: label})
          data[1].values.push({value: rows[i][falseKey], label: label})
        }
      }
    } else if (_.size(rows[0]) > 2) {
      var dataRows = []
      // if not a checkbox, but more than 2 records, then a groupby is being used and it needs to be pre-processed
      //
      var labels = rows.map(function (row) {
        if (typeof row.label === 'undefined') {
          return 'Unknown'
        } else {
          return row.label
        }
      }).filter(function (elem, index, array) {
        return array.indexOf(elem) === index
      })

      labels = ['x'].concat(labels)

      keys = rows.map(function (row) {
        if (typeof row[groupBy] === 'undefined') {
          return 'Unknown'
        } else {
          return row[groupBy]
        }
      }).filter(function (elem, index, array) {
        return array.indexOf(elem) === index
      })

      keys.forEach(function (key, index, array) {
        let row = Array.apply(null, new Array(labels.length - 1)).map(Number.prototype.valueOf, 0)
        row = [key].concat(row)
        dataRows.push(row)
      })

      rows.forEach(function (row, index, array) {
        var label = row.label || 'Unknown'
        var key = row[groupBy] || 'Unknown'
        dataRows[keys.indexOf(key)][labels.indexOf(label)] = row.value
      })

      data = [labels].concat(dataRows)
    } else {
      data = [{
        key: this.props.rowLabel,
        values: rows
      }]
    }

    this.data = data

    this.setState({
      data: this.data,
      selectedCol: this.selectedCol,
      dateBy: this.dateBy,
      groupBy: this.groupBy
    })
  }

  _dataFailureHandler (error) {
    console.log(error)
  }

  _runQuery () {
    var query = this._setSodaQuery()
    query.getRows()
      .on('success', this._dataSuccessHandler)
      .on('error', this._dataFailureHandler)
  }

  _setDateFilter (fieldDef) {
    let filter = {}
    filter.name = fieldDef.name
    filter.key = fieldDef.key
    filter.type = 'calendar_date'
    switch (this.dateBy) {
      case 'year':
        filter.startDate = moment(fieldDef.smallest)
        filter.endDate = moment(fieldDef.largest)
        break
      case 'month':
        filter.startDate = moment().subtract(5, 'years').startOf('year')
        filter.endDate = moment(fieldDef.largest)
        break
      default:
        filter.startDate = moment().subtract(1, 'year').startOf('year')
        filter.endDate = moment(fieldDef.largest)
        break
    }

    return filter
  }

  _setSodaQuery () {
    let {fieldDefs, datasetId} = this.props,
      selectedCol = this.selectedCol,
      fieldIdx = _.findIndex(fieldDefs, {'key': selectedCol}),
      fieldDef = this.fieldDef = fieldIdx !== -1 ? fieldDefs[fieldIdx] : null,
      groupIdx = _.findIndex(fieldDefs, {'key': this.groupBy}),
      groupDef = this.groupDef = groupIdx !== -1 ? fieldDefs[groupIdx] : null

    // domain should be set in state of Dataset.jsx so we can easily propogate
    let consumer = new soda.Consumer('data.sfgov.org')

    let query = consumer.query().withDataset(datasetId)

    let dateAggregation = this.dateBy == 'month' ? 'date_trunc_ym' : 'date_trunc_y'

    if (fieldDef.type == 'calendar_date') {
      query = query
        .select('count(*) as value')
        .select(dateAggregation + '(' + selectedCol + ') as label')
        .where('label is not null')
        .group('label')
        .order('label')
    } else if (fieldDef.type === 'category' || fieldDef.type === 'number') {
      query = query
        .select('count(*) as value')
        .select(selectedCol + ' as label')
        .group('label')
        .order('value desc')
    } else if (fieldDef.type === 'checkbox') {
      query = query
        .select('sum(case(' + selectedCol + '=false,1,true,0)) as ' + selectedCol + '_false')
        .select('sum(case(' + selectedCol + '=true,1,true,0)) as ' + selectedCol + '_true')
        .select('count(*) as total')
        .order('total desc')
    }

    if (this.groupBy) {
      query.select(this.groupBy).group(this.groupBy).order(this.groupBy)
    }

    if (this.state.filters.length > 0) {
      for (var filter of this.state.filters) {
        if (filter.type === 'calendar_date') {
          let start = filter.startDate.format('YYYY-MM-DD'),
            end = filter.endDate.format('YYYY-MM-DD')
          query.where(filter.key + '>="' + start + '" and ' + filter.key + '<="' + end + '"')
        } else if (filter.type === 'category' && filter.selected) {
          let enclose = '"',
            joined = filter.selected
          if (Array.isArray(filter.selected)) {
            joined = filter.selected.join(enclose + ' or ' + filter.key + '=' + enclose)
          }
          query.where(filter.key + '=' + enclose + joined + enclose)
        } else if (filter.type === 'checkbox' && filter.selected && filter.selected.length > 0) {
          let join = filter.join || 'or',
            joined = filter.selected.join(' ' + join + ' ')
          query.where(joined)
        } else if (filter.type === 'number') {
          let first = parseInt(filter.range[0]) - 1
          let last = parseInt(filter.range[1]) + 1
          query.where(filter.key + ' between "' + first + '" and "' + last + '"')
        }
      }
    }

    query = query.limit(50000)

    return query
  }

  _buildChartTitle () {
    let {fieldDefs} = this.props,
      groupByIdx = _.findIndex(fieldDefs, {'key': this.state.groupBy}),
      groupDef = groupByIdx !== -1 ? fieldDefs[groupByIdx] : null,
      label = this.props.rowLabel,
      title = ''

    if (this.fieldDef) {
      var fieldName = ' by ' + this.fieldDef.name
      title = label + fieldName
    }

    if (groupDef) {
      title += ' and ' + groupDef.name
    }

    // groupName = ' and ' + this.groupDef.name,

    // row label
    // by field name
    // if grouped: and groupby name
    return capitalize(title, true)
  }

  render () {
    let {fieldDefs} = this.props,{selectedCol, data, groupBy} = this.state,
      handleColumnSelect = this._handleColumnSelect,
      title = this._buildChartTitle(),
      compare = false,
      chart = null,
      chartOptions = null,
      order = [],
      counts = []

    var cols = fieldDefs.map(function (col, i) {
      if ((col.type !== 'text' && col.type !== 'location') && !col.pkey) {
        return (
        <Button
          key={i}
          bsSize="small"
          bsStyle="primary"
          onClick={handleColumnSelect.bind(this, col.key)}>
          {col.name}
        </Button>
        )
      } else {
        return false
      }
    })

    if (this.state.data.length > 0) {
      let fieldIdx = _.findIndex(fieldDefs, {'key': selectedCol})
      let groupByIdx = _.findIndex(fieldDefs, {'key': groupBy})
      let fieldDef = fieldIdx !== -1 ? fieldDefs[fieldIdx] : null
      let groupDef = groupByIdx !== -1 ? fieldDefs[groupByIdx] : null
      let type = 'bar'
      if (fieldDef.type === 'calendar_date') {
        type = 'area'
      }

      if (groupDef) {
        order = groupDef.stats.order
        counts = groupDef.stats.counts
      }

      var chartDef = {
        data: this.state.data,
        order: order,
        groupBy: this.state.groupBy,
        dateBy: this.state.dateBy,
        type: type,
        fieldType: fieldDef.type,
        title: title,
        viewOption: viewOptions[this.state.viewOption]
      }

      if (chartDef.viewOption == 'compare') {
        compare = true
      }
      chart = <Chart chartDef={chartDef} toggleYearMonth={this._toggleYearMonth} colors={colors} />
      chartOptions = <ChartOptions
                       fieldDefs={this.props.fieldDefs}
                       chartDef={chartDef}
                       counts={counts}
                       order={order}
                       compare={compare}
                       numberOfOptions={numberOfOptions}
                       handleGroupBy={this._handleGroupBy}
                       handleViewOptions={this._handleViewOptions}
                       handleCompare={this._handleCompare}
                       handleAddFilter={this.handleAddFilter}
                       handleRemoveFilter={this.handleRemoveFilter}
                       filters={this.state.filters}
                       setFilter={this.setFilter} />
    }

    let numberOfOptions = order.length

    return (
    <div id="ChartsContainer">
      <div className="column-buttons">
        {cols}
      </div>
      <Row id="ChartArea">
        <Col sm={9} id="Chart">
        {chart}
        </Col>
        <Col sm={3} id="ChartOptions">
        {chartOptions}
        </Col>
      </Row>
    </div>
    )
  }
}
