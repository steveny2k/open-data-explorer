require('react-select/dist/react-select.css')

import React from 'react'
import {Col, Row, Input, Alert, Button, ButtonGroup, Label} from 'react-bootstrap'
import _ from 'lodash'
import Select from 'react-select'
import { defaultRanges, Calendar, DateRange } from 'react-date-range'
import yearRanges from './yearRanges.js'

import ChartFilters from './ChartFilters.jsx'

export default class ChartOptions extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			alertVisible: false,
			rangePicker: {}
		}

		this.handleAlertDismiss = this.handleAlertDismiss.bind(this)
		this.handleViewOptions = this.handleViewOptions.bind(this)
		this.handleDateFilter = this.handleDateFilter.bind(this)
	}

	handleAlertDismiss() {
		this.setState({alertVisible: false})
	}

	handleViewOptions(ev) {
		console.log(ev.target.value)
	}

	handleDateFilter(which, payload) {
    this.setState({
      [which] : payload
    });
	}

	componentDidMount() {
		if(this.props.numberOfOptions > 5) {
			this.setState({alertVisible: true})
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.numberOfOptions > 5) {
			//this.setState({alertVisible: true})
		} else {
			//this.setState({alertVisible: false})
		}
	}


	render() {
		//loop through categories
		//generate select box with category names and handler
		//on select handle selection with an update to the query
		//
		const format = 'MM/DD/YYYY';
		
		let {fieldDefs, handleGroupBy, handleViewOptions, handleCompare, handleAddFilter, chartDef, counts, order, filters, setFilter, ...props} = this.props,
			{rangePicker} = this.state,
			alert = null, 
			categories = _.filter(fieldDefs, {'type': 'category'}),
			compareOptions = null,
			quickViewOptions = null

		var options = categories.map(function(option,i){
			let ret = {}
			ret.value = option.key
			ret.label = option.name
			return ret
		})

		if(this.state.alertVisible) {
			alert = (
				<Alert bsStyle="warning" onDismiss={this.handleAlertDismiss}>
          <p>There are {this.props.numberOfOptions} categories. The current view is defaulting to the top 5 categories by cumulative values. You can change this using the quick view options below.</p>
        </Alert>
				)
		}

		if(this.props.compare) {
			compareOptions = order.map(function(ob, i){
				return (
					<Button value={ob} onClick={handleCompare.bind(null,ob)}>{ob} <Label bsStyle="info">Count: {counts[i]}</Label></Button>
					)
			})
			compareOptions = (
				<ButtonGroup vertical block>
					{compareOptions}
				</ButtonGroup>
				)
		}
		
		if(chartDef.groupBy) {
			quickViewOptions = (
					<div>
					<label className="control-label">Quick view options</label>
	    		<Input type="radio" name="quickViewOptions" eventKey={0} value={0} label="Show top 5 categories" defaultChecked onClick={handleViewOptions}/>
	    		<Input type="radio" name="quickViewOptions" eventKey={1} value={1} label="Show bottom 5 categories" onClick={handleViewOptions}/>
	    		<Input type="radio" name="quickViewOptions" eventKey={2} value={2} label="Show all categories" onClick={handleViewOptions}/>
	    		<Input type="radio" name="quickViewOptions" eventKey={3} value={3} label="Show one category compared against the rest" onClick={handleViewOptions}/>
	    		</div>
				)
		}

		return(
			<div>
			<label className="control-label">Group by</label>
			<Select
				name='groupby'
				placeholder="Select a field to group by"
				options={options}
				value={chartDef.groupBy}
				onChange={handleGroupBy}/>

    		{alert}
    		{quickViewOptions}
    		{compareOptions}
    	<ChartFilters fieldDefs={fieldDefs} groupBy={chartDef.groupBy} dateBy={chartDef.dateBy} handleAddFilter={handleAddFilter} onFilter={setFilter} filters={filters} />
    	</div>
			)
	}
}