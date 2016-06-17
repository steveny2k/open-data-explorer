import React, { Component } from 'react'
import { Button, Row, Col } from 'react-bootstrap'


class ChartColumns extends Component {
  constructor (props) {
    super(props)
  }


  renderColumnButton (column, idx, columns, selectColumn, dataset) {
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
    let categoryColumns = dataset.categoryColumns
    let buttonClassName = 'chartButtons'
    let colTypesAccepted = ['number', 'checkbox', 'date']
    if ((categoryColumns.indexOf(col.key) > -1 || colTypesAccepted.indexOf(col.type) > -1) && (removedIdKeys.indexOf(col.key) < 0) && (isNotNull(col))) {
      return (
        <Button
          style={{backgroundColor: buttonColor}}
          key={idx}
          bsSize='small'
          bsStyle='primary'
          className={buttonClassName}
          onClick={selectColumn.bind(this, col.key)}>
          {col.name}

        </Button>
      )
    } else {
      return null
    }
  }

  renderButtons(columns, selectColumn, dataset){
    let cols = []
    if (columns) {
      cols = Object.keys(columns).map((column, idx) => {
        return this.renderColumnButton(column, idx, columns, selectColumn, dataset)
      })
    }
    console.log(columns)
    console.log(cols)
    return cols
  }

  render () {
    console.log("This is the chart columns rendering")
    console.log(this.props);
    let { columns, selectColumn, dataset } = this.props
    let cols = this.renderButtons(columns, selectColumn, dataset)
    console.log(cols)
    return (
        <div>
        {cols}
        </div>

    )
  }
}
export default ChartColumns
