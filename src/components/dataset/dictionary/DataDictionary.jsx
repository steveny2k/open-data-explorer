require('./datadictionary.scss')

import React from 'react'
import {Row, Col, Panel, Label} from 'react-bootstrap'

var labelStyle = {
	marginRight: '5px'
}

var defStyle = {
	minHeight: '200px'
}

var humanType = {
	'text': 'Text',
	'category': 'Category',
	'checkbox': 'True/False',
	'calendar_date': 'Date/Time',
	'location': 'Latitude and Longitude',
	'number': 'Number'
}

export default class DataDictionary extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		let definitions = this.props.fieldDefs.map(function(field, i){
			let title = <h2>{field.name}</h2>

			return(
				<Col md={4} key={i}>
				<Panel header={title} style={defStyle}>
      		<p>{field.description}</p>
      		<Label bsStyle="info" style={labelStyle}>Field type: {humanType[field.type]}</Label> 
      		<Label bsStyle="info" style={labelStyle}>API name: {field.key}</Label>
    		</Panel>
    		</Col>
				)
		})
		
		var rows = []
		for(var i = 0; i < this.props.fieldDefs.length; i+=3) {
			rows.push(<Row>
						{definitions[i]}
						{definitions[i + 1]}
						{definitions[i + 2]}
					</Row>)
		}

		return(
			<div id="DataDictionary">
				{rows}
			</div>
			)
	}
}