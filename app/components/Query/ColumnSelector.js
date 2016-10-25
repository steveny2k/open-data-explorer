import React, { Component, PropTypes } from 'react'
import { Panel, ListGroupItem, ListGroup } from 'react-bootstrap'

class ColumnSelector extends Component {
  render () {
    let { columns, selected, onSelectColumn } = this.props
    const options = columns.map((option) => {
      return (<ListGroupItem key={option.value} onClick={onSelectColumn.bind(this, option.value)}>{option.label}</ListGroupItem>)
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
