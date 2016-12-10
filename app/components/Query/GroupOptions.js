import React, { Component, PropTypes } from 'react'
import Select from 'react-select'
import { Panel } from 'react-bootstrap'

class GroupOptions extends Component {
  render () {
    let { columns, selected, onGroupBy } = this.props
    return (
      columns.length !== 0
      ? <Panel collapsible defaultExpanded header='Group by another column'>
        <Select
          name='groupby'
          placeholder='Select a column to group by'
          options={columns}
          value={selected}
          onChange={onGroupBy} />
      </Panel>
      : false
    )
  }
}

GroupOptions.propTypes = {
  columns: PropTypes.array,
  selected: PropTypes.string,
  onGroupBy: PropTypes.func
}

export default GroupOptions
