import React from 'react'
import Select from 'react-select'

export default class FilterCategory extends React.Component {
	constructor(props) {
		super(props)

		this.onFilter = this.onFilter.bind(this)
	}

	onFilter(value) {
		console.log(value)
		let options = {
			selected : value ? value.value : null,
			key: this.props.filter.key
		}
    this.props.onFilter(options)
	}

	render() {
		let {options, filter} = this.props
		return(
			<Select
				name='category_2'
				placeholder="Select a category"
				options={options}
				value={filter.selected}
				onChange={this.onFilter}/>
			)
	}
}