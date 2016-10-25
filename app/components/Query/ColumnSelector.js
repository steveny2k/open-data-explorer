import React, { Component } from 'react'
import { Panel, ListGroupItem, ListGroup } from 'react-bootstrap'

class ColumnSelector extends Component {
  render () {
    let { columns, selected, onSelectColumn } = this.props
    const options = columns.map((option) => {
      return (<ListGroupItem onClick={onSelectColumn.bind(this, option.value)}>{option.label}</ListGroupItem>)
    })

    return (
      <Panel header='Select a dataset column'>
        <ListGroup fill>
          {options}
        </ListGroup>
      </Panel>
    )
  }
}

ColumnSelector.PropTypes = {
  columns: React.PropTypes.array,
  selected: React.PropTypes.string,
  onSelectColumn: React.PropTypes.func
}

export default ColumnSelector
