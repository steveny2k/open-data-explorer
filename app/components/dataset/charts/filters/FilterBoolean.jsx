import React from 'react'
import Select from 'react-select'

export default class FilterCategory extends React.Component {
	constructor(props) {
		super(props)

		this.onFilter = this.onFilter.bind(this)
	}

	onFilter(val) {
		let options = {}, 
			value = val || []

		if(value.filterJoin) {
			options = {
				key: this.props.filter.key,
				join: value.filterJoin
			}
		} else {
			let selected = value.length > 0 ? value.map(function(option){
				return option.value
			}) : null

			options = {
				selected : selected,
				key: this.props.filter.key
			}
		}
		 this.props.onFilter(options)
	}

	render() {
		let {options, filter} = this.props
		return(
			<div className="checkbox-filter">
        <label className="radio-inline">
            <input
                type="radio"
                value="or"
                name={filter.key + "_join"}
                defaultChecked
                onClick={this.onFilter.bind(this,{filterJoin: 'or'})}
            /> Any
        </label>
        <label className="radio-inline">
            <input
                type="radio"
                value="and"
                name={filter.key + "_join"}
                onClick={this.onFilter.bind(this,{filterJoin: 'and'})}
            /> All
        </label>
				<Select
					name='category_3'
					placeholder="Select a category"
					options={options}
					multi={true}
					value={filter.selected}
					onChange={this.onFilter}/>
			</div>
			)
	}
}