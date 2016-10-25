import React, { Component, PropTypes } from 'react'
import { Panel, ListGroupItem, ListGroup } from 'react-bootstrap'

class ColumnSelector extends Component {
  constructor (props) {
    super(props)

    this.setButtonColors = this.setButtonColors.bind(this)
  }

  setButtonColors (col) {
    /*
    let buttonColors = function () {
      let bColorsFxn = d3.scale.category30()
      let buttonColors = bColorsFxn.range()
      return buttonColors
    }
    */
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

  render () {
    const colorIndex = {
      'number': '#27ae60',
      'text': '#7986cb',
      'date': '#8e44ad',
      'checkbox': '#d35400'
    }

    let { columns, selected, onSelectColumn } = this.props
    const options = columns.map((option) => {
      let classNames = ['ColumnSelector-list-group-item']
      if (option.value === selected && selected) {
        classNames.push('selected')
      } else if (selected) {
        classNames.push('not-selected')
      }
      return (
        <ListGroupItem
          key={option.value}
          onClick={onSelectColumn.bind(this, option.value)}
          style={{backgroundColor: colorIndex[option.type]}}
          className={classNames}>
          {option.label}
        </ListGroupItem>)
    })

    return (
      <Panel collapsible defaultExpanded header='Select a dataset column'>
        Help text
        <ListGroup fill className='ColumnSelector-list-group'>
          {options}
        </ListGroup>
      </Panel>
    )
  }
}

ColumnSelector.propTypes = {
  columns: PropTypes.array,
  selected: PropTypes.string,
  onSelectColumn: PropTypes.func
}

export default ColumnSelector
