import React from 'react'
import Select from 'react-select'
import {Well, Button} from 'react-bootstrap'
import _ from 'lodash'

import FilterDateTime from './filters/FilterDateTime.jsx'
import FilterCategory from './filters/FilterCategory.jsx'
import FilterBoolean from './filters/FilterBoolean.jsx'
import FilterNumeric from './filters/FilterNumeric.jsx'

const notFilters = ['text','checkbox','location','url']

export default class ChartFilters extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {

		let {fieldDefs, groupBy, handleAddFilter, filters, onFilter, dateBy, handleRemoveFilter} = this.props,
			checkboxes = false, checkboxOptions = []


		var options = fieldDefs.filter(function(option){
			if(option.type == 'checkbox') {
				checkboxes = true
			}
			if(notFilters.indexOf(option.type) > -1) {
				return false
			}
			if(option.pkey) {
				return false
			}
			if(_.findIndex(filters, {'key': option.key}) > -1) {
				return false
			}
			return true
			})
		.map(function(option, i){
			var ret = {
				value : option.key,
				label : option.name
			}
			return ret
		})

		if(checkboxes) {
			if( _.findIndex(filters, {'key': 'checkboxes'}) === -1) {
				options.push({value: 'checkboxes', label: 'Checkboxes (true/false)'})
			}

			checkboxOptions = fieldDefs.filter(function(option) {
				if(option.type === 'checkbox') {
					return true
				} else {
					return false
				}
			})
			.map(function(option, i){
				var ret = {
					value: option.key,
					label: option.name
				}
				return ret
			}) 
		}

		let filterOptions = []

		if(filters.length > 0) {
			for(let filter of filters) {
				let filterContent

				switch(filter.type) {
					case 'calendar_date':
						filterContent = <FilterDateTime key={filter.key} fieldKey={filter.key} startDate={filter.startDate} endDate={filter.endDate} dateBy={dateBy} onFilter={onFilter}/>
						break
					case 'category':
						let order = fieldDefs[_.findIndex(fieldDefs,{'key': filter.key})].stats.order
						let optionsForFilter = order.map(function(option) {
							let opt = {
								label: option,
								value: option
							}
							return opt
						})
						filterContent = <FilterCategory key={filter.key} options={optionsForFilter} onFilter={onFilter} filter={filter} />
						break
					case 'checkbox':
						filterContent = <FilterBoolean key={filter.key} options={checkboxOptions} onFilter={onFilter} filter={filter} />
						break
					case 'number':
						filterContent = <FilterNumeric key={filter.key} min={filter.min} max={filter.max} range={filter.range} filter={filter} onFilter={onFilter}/>
						break
					default:
						filterContent = null
					}

				let filterOption = (<Well bsSize="small" className="filter" key={filter.key}>
					<div className="filter-content">
					<Button className="close" onClick={handleRemoveFilter.bind(this,filter.key)}>&times;</Button>
					<h4>{filter.name}</h4>
						{filterContent}
					</div>
				</Well>)

				filterOptions.push(filterOption)
			}
		}

		return (
			<div>
				<label className="control-label">Filter by</label>
				<Select
					name='filters'
					placeholder="Select fields you'd like to filter by"
					options={options}
					onChange={handleAddFilter}/>
					<div>
						{filterOptions}
					</div>
			</div>
			)
	}
}