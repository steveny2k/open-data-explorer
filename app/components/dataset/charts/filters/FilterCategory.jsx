import React from 'react'
import Select from 'react-select'

export default class FilterCategory extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			multi: false
		}

		this.onFilter = this.onFilter.bind(this)
	}

	onFilter(val) {
		let options = {},
			value = val || []

		if (typeof value.multi !== 'undefined') {
			options = {
				key: this.props.filter.key,
				multi: value.multi
			}
			if (Array.isArray(this.props.filter.selected) && !value.multi) {
				options.selected = this.props.filter.selected[0]
			}
		} else {
			console.log(value)
			let selected = value.length > 0 ? value.map(function(option){
				return option.value
			}) : (typeof value == 'object' ? value.value : null)

			options = {
				selected : selected,
				key: this.props.filter.key
			}
		}

		
    this.props.onFilter(options)
	}

	render() {
		let {options, filter} = this.props,
			multi = filter.multi || false

		return(
			<div className="category-filter">
			<label className="radio-inline">
            <input
                type="radio"
                value="false"
                name={filter.key + "_multi"}
                defaultChecked
                onClick={this.onFilter.bind(this,{multi: false})}
            /> Single Option
        </label>
        <label className="radio-inline">
            <input
                type="radio"
                value="and"
                name={filter.key + "_multi"}
                onClick={this.onFilter.bind(this,{multi: true})}
            /> Multiple Options
        </label>
			<Select
				name='category_2'
				placeholder="Select a category"
				options={options}
				value={filter.selected}
				multi={multi}
				onChange={this.onFilter}
				/>
			</div>
			)
	}
}