import React, { Component } from 'react'
import Select from 'react-select'
import { Panel } from 'react-bootstrap'

class GroupOptions extends Component {
  render () {
    let { columns, selected, onGroupBy } = this.props

    return (
      <Panel header='Group by another column'>
        <Select
          name='groupby'
          placeholder='Select a column to group by'
          options={columns}
          value={selected}
          onChange={onGroupBy} />
      </Panel>
    )
  }
}

GroupOptions.PropTypes = {
  columns: React.PropTypes.array,
  selected: React.PropTypes.string,
  onGroupBy: React.PropTypes.func
}

export default GroupOptions
