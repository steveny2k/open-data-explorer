import React, { Component } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import ChartCanvas from './ChartCanvas'
import ChartOptions from './ChartOptions'
import ChartType from './ChartType'


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
        let bColorsFxn = d3.scale.category30()
        let buttonColors = bColorsFxn.range()
        return buttonColors
      }
      // let btnColors = buttonColors()
      let btnColors = ['#3498db', '#27ae60', '#16a085', '#7986cb', '#d35400', '#c0392b', '#a97964', '#8e44ad', '#f39c12']

      let numberFields = ['double', 'money', 'number']
      let textFields = ['text']
      let dateFields = ['date', 'calendar_date']
      let contactFields = ['email', 'phone', 'url']
      let locationFields = ['location']
      let booleanFields = ['checkbox']
      let categoryFields = function (col) {
        if (col['categories']) {
          return true
        } else {
          return false
        }
      }
      let allFields = [categoryFields, numberFields, textFields, dateFields, contactFields, locationFields, booleanFields]

      let isType = function (col, fieldList) {
        if (typeof fieldList === 'function') {
          return fieldList(col)
        } else {
          if (fieldList.indexOf(col['type']) > -1) {
            return true
          }
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
      // if the field doesn't exist just return true
      if (!col['null']) {
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
          className={'chartButtons'}
          onClick={selectColumn.bind(this, col.key)}>
          {col.name}

        </Button>
      )
    } else {
      return null
    }
  }

  renderChartArea (props) {
    let { dataset, handleGroupBy, handleSumBy, handleAddFilter, handleRemoveFilter, applyFilter, updateFilter, changeDateBy, applyChartType} = this.props
    let { columns, query, ...other } = dataset

    //set the props here; will get set by the reducer
    let chartType
    let otherProps = {...other}
    let displayChartOptions = false
    otherProps.selectedColumnDef = query.selectedColumn ? columns[query.selectedColumn] : null

    if (otherProps.selectedColumnDef && otherProps.selectedColumnDef.type === 'date') {
      chartType = 'area'
      displayChartOptions = true
    }
    else{
        chartType = 'bar'
    }

    let checkChartType = query.chartType
    if(checkChartType &&  displayChartOptions) {
      chartType = checkChartType
    }
    else {
      chartType = 'bar'
    }

    let shouldRender
    return (
      query && query.data
      ? (<Row>
        <Col md={9}>
          <ChartCanvas
            query={query}
            data={query.data}
            dateBy={query.dateBy}
            changeDateBy={changeDateBy}
            groupBy={query.groupBy}
            sumBy={query.sumBy}
            filters={query.filters}
            columns={columns}
            chartType={chartType}
            applyChartType={applyChartType}
            displayChartOptions={displayChartOptions}
            {...otherProps} />
        </Col>
        <Col md={3}>
          <Row>
          <ChartOptions
            {...query}
            columns={columns}
            handleGroupBy={handleGroupBy}
            handleAddFilter={handleAddFilter}
            handleRemoveFilter={handleRemoveFilter}
            applyFilter={applyFilter}
            updateFilter={updateFilter}
            handleSumBy={handleSumBy} />
            </Row>
          <Row>
          <ChartType
          applyChartType={applyChartType}
          displayChartOptions={displayChartOptions}
          chartType={chartType}/>
          </Row>
        </Col>
      </Row>


      )
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
    let ChartArea = this.renderChartArea()
    return (
      <div className={'container-fluid'}>
        <Row className={'chartButtonRow'}>
          <Col md={12}>
            {cols}
          </Col>
        </Row>
        {ChartArea}
      </div>

    )
  }
}

export default Charts
