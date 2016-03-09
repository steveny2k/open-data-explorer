import React from 'react'
import {Row, Col, Panel} from 'react-bootstrap'
import {Link} from 'react-router'
import slugify from 'underscore.string/slugify'

export default class DatasetItem extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		let {dataset} = this.props,
			{id, _highlightResult, name} = dataset,
			description = dataset.description,
			highlightedName = _highlightResult.name.value

		var category = dataset.category || 'dataset'
		var path = '/' + slugify(category) + '/' + slugify(name) + '/' + id
		var link = <Link to={`${path}`}>{name}</Link>
		return(
				<Row>
					<Col sm={12}>
    				<Panel header={link}>
      				<p>{description}</p>
    			</Panel>
					</Col>
				</Row>
			)
	}
}