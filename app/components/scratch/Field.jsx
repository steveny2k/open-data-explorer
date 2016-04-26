import React from 'react';
import {Grid, Row, Col, PageHeader, Alert, Input} from 'react-bootstrap';

export default class Field extends React.Component {

	constructor() {

		super();
		this.state = {};

	}

	render() {
		'use strict';

		return(
				<Col sm={12}>
					<div>
						<form>
	  					<Input type="text" label="Field Name" placeholder="Enter text" value={this.props.fieldName} />
	  					<Input type="text" label="Alias" placeholder="Enter text" value={this.props.alias} />
	  					<Input type="text" label="Type" placeholder="Enter text" value={this.props.type} />
	  					<Input type="text" label="Description" placeholder="Enter text" value={this.props.description} />
	  					<Input type="text" label="API Name" placeholder="Enter text" value={this.props.apiName} />
	  				</form>
  				</div>
				</Col>
			)
	}

}