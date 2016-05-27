import React, { Component } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ChartCanvas from './ChartCanvas'
import ChartOptions from './ChartOptions'

class Charts extends Component {
  constructor (props) {
    super(props)

    this.renderColumnButton = this.renderColumnButton.bind(this)
    this.renderChartArea = this.renderChartArea.bind(this)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.dataset.query.isFetching
  }

  renderColumnButton (column, idx, columns) {
    function setButtonColors (col) {
      let buttonColors = function () {
        let bColorsFxn = d3.scale.category10()
        let buttonColors = bColorsFxn.range()
        return buttonColors
      }
      let btnColors = buttonColors()
      let numberFields = ['double', 'money', 'number']
      let textFields = ['text']
      let dateFields = ['date', 'calendar_date']
      let contactFields = ['email', 'phone', 'url']
      let locationFields = ['location']
      let allFields = [numberFields, textFields, dateFields, contactFields, locationFields]
      let isType = function (col, fieldList) {
        if (fieldList.indexOf(col['type']) > -1) {
          return true
        }
        return false
      }
      for (let i = 0; i < allFields.length; i++) {
        if (isType(col, allFields[i])) {
          return btnColors[i]
        }
      }
    }

    function removeIdKeys (obj) {
      // remove id fields from the buttons
      var removedIdKeys = []
      var idRegex = /id+/g
      var numIDRegex = /number+/g
      for (var key in obj) {
        var isIdField = idRegex.test(key)
        var isNumberIdField = numIDRegex.test(key)
        if (isIdField || isNumberIdField) {
          removedIdKeys.push(key)
        }
      }
      return removedIdKeys
    }
    function isNotNull (col) {
      if (col['count'] !== col['null']) {
        return true
      }
      return false
    }

    let removedIdKeys = removeIdKeys(columns)
    let col = columns[column]
    let buttonColor = setButtonColors(col)
    let { selectColumn } = this.props
    let categoryColumns = this.props.dataset.categoryColumns
    let colTypesAccepted = ['number', 'checkbox', 'date']
    if ((categoryColumns.indexOf(col.key) > -1 || colTypesAccepted.indexOf(col.type) > -1) && (removedIdKeys.indexOf(col.key) < 0) && (isNotNull(col))) {
      return (
        <Button
          style={{backgroundColor: buttonColor}}
          key={idx}
          bsSize='small'
          bsStyle='primary'
          onClick={selectColumn.bind(this, col.key)}>
          {col.name}
        </Button>
      )
    } else {
      return null
    }
  }

  renderChartArea (props) {
    let { dataset, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, changeDateBy } = this.props
    let { columns, query, ...other } = dataset
    let otherProps = {...other}

    otherProps.selectedColumnDef = query.selectedColumn ? columns[query.selectedColumn] : null
    otherProps.chartType = 'bar'

    if (otherProps.selectedColumnDef && otherProps.selectedColumnDef.type === 'date') {
      otherProps.chartType = 'area'
    }
    return (
      query && query.data
      ? (<Row>
        <Col md={9}>
          <ChartCanvas data={query.data} dateBy={query.dateBy} changeDateBy={changeDateBy} {...otherProps} sumBy={query.sumBy} columns={columns} />
        </Col>
        <Col md={3}>
          <ChartOptions
            {...query}
            columns={columns}
            handleGroupBy={handleGroupBy}
            handleAddFilter={handleAddFilter}
            handleRemoveFilter={handleRemoveFilter}
            applyFilter={applyFilter}
            updateFilter={updateFilter}
            handleSumBy={handleSumBy} />
        </Col>
      </Row>)
      : false
    )
  }

  render () {
    let { columns } = this.props.dataset
    let cols = []
    if (columns) {
      cols = Object.keys(columns).map((column, idx) => {
        return this.renderColumnButton(column, idx, columns)
      })
    }
    return (
      <div>
        <Row>
          <Col md={12}>
            {cols}
          </Col>
        </Row>
        {this.renderChartArea()}
      </div>

    )
  }
}

export default Charts
