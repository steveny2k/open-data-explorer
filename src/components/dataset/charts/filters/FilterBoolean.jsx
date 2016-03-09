import React from 'react'
import Select from 'react-select'

export default class FilterCategory extends React.Component {
	constructor(props) {
		super(props)

		this.onFilter = this.onFilter.bind(this)
	}

	onFilter(value) {
		let selected = value ? value.map(function(option){
				return option.value
		}) : null, 
			options = {
				selected : selected,
				key: this.props.filter.key
			}
    this.props.onFilter(options)
	}

	render() {
		let {options, filter} = this.props
		return(
			<Select
				name='category_3'
				placeholder="Select a category"
				options={options}
				multi={true}
				value={filter.selected}
				onChange={this.onFilter}/>
			)
	}
}