import React from 'react'
import {Input} from 'react-bootstrap'

export default class DatasetSearchBar extends React.Component {
	constructor(props) {
		super(props)

		this.handleSearch = this.handleSearch.bind(this)
	}

	handleSearch(ev) {
		let {helper} = this.props
		helper.setQuery(ev.target.value).search()
	}

	render() {
		let {handleSearch} = this.props
	 return(
	 		<div>
	 			<Input type="text" placeholder="Search" onKeyUp={this.handleSearch}/>
	 		</div>
	 	)
	}
}