require('fixed-data-table/dist/fixed-data-table.css');

import React from 'react';
import {Pagination} from 'react-bootstrap'
import {Table, Column, Cell} from 'fixed-data-table'
import moment from 'moment'

var SortTypes = {
  ASC: 'asc',
  DESC: 'desc',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    var {sortDir, children, ...props} = this.props
    
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↑' : '↓') : ''}
        </a>
      </Cell>
    );
  }

  _onSortChange(e) {
    e.preventDefault()

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
}

class DynamicCell extends React.Component {
  render() {
  	'use strict'
    const {
    	rowIndex, 
    	field, 
    	data, 
    	type, 
     ...props 
    } = this.props
    var content = ""
    if (type == 'location' && data[rowIndex][field]) {
    	content = data[rowIndex][field].coordinates[1] + ", " + data[rowIndex][field].coordinates[0]
    } else if(type == 'checkbox') {
    	content = data[rowIndex][field] ? 'Yes' : 'No'
    } else if(type == 'calendar_date' && data[rowIndex][field]) {
    	content = moment(data[rowIndex][field]).format("MM/DD/YYYY")
    } else {
    	content = data[rowIndex][field]
    }

    return (
      <Cell {...props}>
        {content}
      </Cell>
    );
  }
}

export default class DataTable extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {

		if(this.props.data.length > 0) {
			var columns = this.props.fieldDefs.map(function(colDef, i){
					return <Column columnKey={colDef.key}
					key={colDef.key}
					header={
            <SortHeaderCell
              onSortChange={this.props.onSortChange}
              sortDir={this.props.colSortDirs[colDef.key]}>
              {colDef.name}
            </SortHeaderCell>
          }
					allowCellsRecycling={true}
					cell={
            <DynamicCell
              data={this.props.data}
              field={colDef.key}
              type={colDef.type} />
          }
					width={200}/>
			}.bind(this));
		} else {
			var columns = null;
		}

		let items = Math.ceil(this.props.totalRows/this.props.perPage)
		return (
			<div id='data-table'>
				<Pagination
          bsSize="small"
          items={items}
          activePage={this.props.currentPage}
          maxButtons={10}
          first
          last
          prev
          next
          ellipsis
          onSelect={this.props.handlePagination} />
				<Table
				rowsCount={this.props.data.length}
				rowHeight={50}
				headerHeight={50}
				width={this.props.width}
				height={500}>
				{columns}
				</Table>
				<Pagination
          bsSize="small"
          items={items}
          activePage={this.props.currentPage}
          maxButtons={10}
          first
          last
          prev
          next
          ellipsis
          onSelect={this.props.handlePagination} />
      </div>
			);
	}
}
