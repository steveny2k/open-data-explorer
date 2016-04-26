import React from 'react';
import {Grid, Row, Col, PageHeader, Alert, Button} from 'react-bootstrap';

export default class ImportFromSocrataButton extends React.Component {

	constructor() {

		super();
		this.state = {};

	}

	render() {
		'use strict';

		return(
				<Button bsStyle="success" onClick={this.props.onImport}>
					Import from Socrata
				</Button>
			)
	}

}