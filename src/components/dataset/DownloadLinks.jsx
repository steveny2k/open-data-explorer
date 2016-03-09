import React from 'react';
import {MenuItem, DropdownButton} from 'react-bootstrap';

export default class DownloadLinks extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var downloadTypes = ['csv','xls','xlsx','json','geojson'];
		var menuItems = downloadTypes.map(function(type, i){
			var downloadLink = 'https://' + this.props.domain + '/api/views/' + this.props.datasetId + '/rows.' + type + '?accessType=DOWNLOAD';
			return <MenuItem href={downloadLink} key={i} eventKey={i}>{type}</MenuItem>
		}.bind(this))

		return (
			<DropdownButton title="Download" id="bg-nested-dropdown" bsStyle="primary">
      	{menuItems}
    	</DropdownButton>
    )
		//https://data.sfgov.org/api/views/tmnf-yvry/rows.csv?accessType=DOWNLOAD
		//https://data.sfgov.org/api/catalog/v1/domains/data.sfgov.org/facets
		//https://data.sfgov.org/api/views.json?method=getDefaultView&id=t6vv-tjkd
	}
}