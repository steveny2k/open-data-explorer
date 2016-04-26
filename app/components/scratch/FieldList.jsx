import React from 'react';
import {Grid, Row, Col, PageHeader, Alert} from 'react-bootstrap';

import Field from './Field.jsx';

export default class FieldList extends React.Component {

	constructor() {

		super();
		this.state = {};
	
	}

	render() {
		'use strict';

		var fields = this.props.fields.map(function(f){
			return <Field key={f.fieldName}
										fieldName={f.fieldName} 
										alias={f.alias} 
										apiName={f.apiName} 
										type={f.type} 
										description={f.description}/>
		}.bind(this));

		return (
				<Row>
					{fields}
				</Row>
			);
	}

}