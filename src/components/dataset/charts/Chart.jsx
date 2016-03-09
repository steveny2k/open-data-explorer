require('c3/c3.css');

import React from 'react'
import {Col, Row, Button, ButtonGroup} from 'react-bootstrap'
import request from 'superagent'
import pluralize from 'pluralize'
import C3Chart from './C3Chart.jsx'

export default class Chart extends React.Component {
	constructor(props){
		super(props)
	}

	componentDidMount() {
		
	}

	render() {
		let {chartDef, toggleYearMonth} = this.props
		let {data, type, title, order, dateBy, viewOption} = chartDef
		let options = {
		  padding: {
		    top: 20,
		    bottom: 20,
		    left: 50,
		    right: 10
		  },
		  grid: {
		    x: false,
		    y: true
		  },
		  onClick: function(d) {
		    let categories = this.categories(); //c3 function, get categorical labels
		    console.log(d);
		    console.log("you clicked {" + d.name + ": " + categories[d.x] + ": " + d.value + "}");
		  }
		}
		let maxLabelLength = 0
		_.forEach(data[0].values, function(value, key){
			if(!value.label) {
				value.label = "Unknown"
			} 
			maxLabelLength = value.label.length > maxLabelLength ? value.label.length : maxLabelLength
		})

		if(data[0].values.length>10 && (type == 'bar' || type == 'multiBarGroup')) {
			options.rotated = true
			options.padding.left = (maxLabelLength * 4) +50
		}
		
		let toggle = <span/>
		if (type === 'timeseries') {
			type = 'area'
			options.timeseries = true
			let monthActive = dateBy == 'month' ? 'active' : ''
			let yearActive = dateBy == 'year' ? 'active' : ''
			toggle = (<ButtonGroup className='toggle-time'>
				<Button bsStyle="success" bsSize="small" onClick={toggleYearMonth} className={monthActive}>Month</Button>
				<Button bsStyle="success" bsSize="small" onClick={toggleYearMonth} className={yearActive}>Year</Button>
			</ButtonGroup>)
		}

		return(
			<div id="C3Chart">
				{toggle}
				<h2>{title}</h2>
				<C3Chart data={data} order={order} type={type} options={options} viewOption={viewOption} colors={this.props.colors}/>
			</div>
			)
		
	}

}