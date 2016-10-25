import React, { Component, PropTypes } from 'react'
import { Panel, ListGroupItem, ListGroup } from 'react-bootstrap'

class ColumnSelector extends Component {
  render () {
    const colorIndex = {
      'number': '#27ae60',
      'category': '#3498db',
      'date': '#8e44ad',
      'checkbox': '#d35400'
    }

    let { columns, selected, onSelectColumn } = this.props
    const options = columns.map((option) => {
      let classNames = ['ColumnSelector-list-group-item']
      let type = (option.isCategory ? 'category' : option.type)
      classNames.push('column-type-' + type)
      if (option.value === selected && selected) {
        classNames.push('selected')
      } else if (selected) {
        classNames.push('not-selected')
      }
      return (
        <ListGroupItem
          key={option.value}
          onClick={onSelectColumn.bind(this, option.value)}
          style={{backgroundColor: colorIndex[type]}}
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
