import React from 'react'
import ReactDOM from 'react-dom'
import turf from 'turf'
import request from 'superagent'
import _ from 'lodash'

export default class DatasetMap extends React.Component {
	constructor(props){
		super(props)

		this.aggregatePoints = this.aggregatePoints.bind(this)
		this.setFilters = this.setFilters.bind(this)
		this._createHexGrids = this._createHexGrids.bind(this)
	}

	aggregatePoints(grid, data) {
		var expanded = turf.featurecollection([]);
		expanded.features = grid.features.map(function(cell,k) {
			cell.properties['count'] = 0
			for(var i = 0; i < data.features.length; i++) {
				if(turf.inside(data.features[i], cell)){
					cell.properties['count']++;
				}
			}
			return cell;
		});
		return expanded;
	}

	_createHexGrids() {
		var gridSizes = [1,.5,.25]
		for(var i=0; i < gridSizes.length; i++){
			console.log(turf.hexGrid(this.props.bbox, gridSizes[i], 'miles'))
		}
	}

	_queryPoints() {
		//midblock obfuscated - group by and run through loop to turn counts into integers
		//small datasets - get all
		//very large - pre-set filter
	}

	_queryByBounds(bbox, grid, points) {
		//buffer bbox by .5 miles
		//intersect buffer and hex grid - if grid (if null, skip and use buffered bbox)
		//take output and if hex grid sum counts by count field
	}

	_loadInitialGrid() {
		
	}

	//on moveend
	//get zoom
	//get zoom direction
	//get hex grid for zoom level: 11, 12 - .75; 13, 14 - .5; 15 - .25; 16 - none - points
	//get bbox of current view if greater than 12, otherwise, use default
	//query by hex, bbox and points _queryByBounds

	setFilters(breaks) {
		var filtersArray = []
		for (var p = 0; p < breaks.length; p++) {
			var filters
			if (p == 0) {
				filters = [ 'all',
				[ '>', 'count', breaks[p] ],
				[ '<', 'count', breaks[p + 1] ]
				]
			} else if (p < breaks.length - 1) {
				filters = [ 'all',
				[ '>=', 'count', breaks[p] ],
				[ '<', 'count', breaks[p + 1] ]
				]
			} else {
				filters = [ 'all',
				[ '>=', 'count', breaks[p] ]
				]
			}
			filtersArray[p] = filters
		}
		return filtersArray
	}

	componentDidMount() {
		var geojson
		var sourceObj = new mapboxgl.GeoJSONSource({})
		var pointObj = new mapboxgl.GeoJSONSource({})
		var cachedLayers = {}
		mapboxgl.accessToken = this.props.token
		this.map = new mapboxgl.Map(this.props.view)
		this.map.addControl(new mapboxgl.Navigation())
		/*var sourceObj = new mapboxgl.GeoJSONSource({
			data: 'https://data.sfgov.org/resource/93gi-sfd2.geojson?$where=client_location+IS+NOT+NULL&$limit=50000',
			cluster: true
		})*/
		this._createHexGrids()

		this.map.on('style.load', function(){
			request
			.get('https://data.sfgov.org/resource/93gi-sfd2.geojson?$where=client_location+IS+NOT+NULL&$order=file_date+desc&$limit=5000')
			.end(function(err,response){
				geojson = JSON.parse(response.text)
					//SF bounding box
					var hexgrid = turf.hexGrid(this.props.bbox, .75, 'miles')
					var counted = turf.count(hexgrid, geojson, 'count');
					//var expanded = this.aggregatePoints(hexgrid,geojson)
					var breaks = turf.jenks(counted, 'count', 5);
					var colors = ['#ffffd4','#fed98e','#fe9929','#d95f0e','#993404']
					
					sourceObj.setData(counted)

					this.map.addSource('hexgrid', sourceObj)
					var filtersArray = this.setFilters(breaks)
					for (var p = 0; p < breaks.length; p++) {
						this.map.addLayer({
							id: 'hexgrid-' + p,
							type: 'fill',
							source: 'hexgrid',
							paint: {
								'fill-color': colors[p],
								'fill-outline-color': 'rgba(204,204,204,1)',
					      // set the opacity based on the level
					      // (p + 1) / breaks.length
					      'fill-opacity': .6
					    },
					    filter: filtersArray[p]
					  })
					}
				}.bind(this))
		}.bind(this))

var prevZ = 11
var breaks
this.map.on('moveend', function(e) {
	var z = e.target.getZoom()
	var zoomDirection = (z == prevZ ? 'none' : (z > prevZ ? 'in' : 'out'))
	var bbox = this.props.bbox
	var cellSize = (z <= 12 ? .75 : (z <= 13 ? .5 : .25))
	if(z > 12) {
		var bounds = this.map.getBounds()
		bbox = [
		bounds._sw['lng'],
		bounds._sw['lat'],
		bounds._ne['lng'],
		bounds._ne['lat']
		]
	}
	if( z <= 11) {
		prevZ = z
		return
	}
	if (z < 16 && _.isInteger(z)) {
		var hexgrid = turf.hexGrid(bbox, cellSize, 'miles')
		var counted = turf.count(hexgrid, geojson, 'count');
		breaks = turf.jenks(counted, 'count', 5);
		sourceObj.setData(counted)
		var filtersArray = this.setFilters(breaks)
		for(var p=0; p<breaks.length; p++){
			this.map.setFilter('hexgrid-'+p, filtersArray[p])
		}
		prevZ = z
	} else {
		for(p=0;p < breaks.length; p++) {
			this.map.setLayoutProperty('hexgrid-'+p, 'visibility', 'none')
		}

		var sodaQueryBox = [
		bounds._ne['lat'],
		bounds._sw['lng'],
		bounds._sw['lat'],
		bounds._ne['lng']
		]
		var classes = [1,2,3,4,5,6,7,8,9,10]
		request.get('https://data.sfgov.org/resource/93gi-sfd2.geojson?$select=client_location,count(*)&$group=client_location&$where=within_box(client_location,' + sodaQueryBox + ')+AND+client_location+IS+NOT+NULL&$limit=5000')
		.end(function(err, response){
			var geoMarkers = JSON.parse(response.text)
			var geoMarkersInt = turf.featurecollection([]);
			geoMarkersInt.features = geoMarkers.features.map(function(cell,k){
				cell.properties['count'] = parseInt(cell.properties['count'])
	    	return cell
	    })
	    				pointObj.setData(geoMarkers)
			    		//console.log(this.map.getSource('markers'))
			    		if(!this.map.getSource('markers')){
			    			this.map.addSource('markers',pointObj)
			    			for(var i=0;i < classes.length; i++){
			    				console.log(i)
			    				var cl = classes[i]
			    				console.log(cl)
			    				var filter = ['all',
			    				['>=','count',cl],
			    				['<','count',cl+1]
			    				]
			    				if(i == classes.length) {
			    					filter = ['all',['>=','count',cl]]
			    				}
			    				this.map.addLayer({
			    					'id': 'markers-' + i,
			    					'type': "circle",
			    					'source': "markers",
			    					'filter': filter,
			    					'paint': {
			    						'circle-radius': 7.5 + (cl * 1.5),
			    						'circle-color': 'rgba(55,148,179,.5)'
			    					}
			    				})
			    			}
			    		}
}.bind(this))	    	
}
prevZ = z
}.bind(this))
			//var bounds = this.map.getBounds()
		/*
		this.map.on('style.load', function(){
			this.map.addSource("markers", sourceObj)
	    this.map.addLayer({
	      "id": "markers",
	      "type": "circle",
	      "source": "markers",
	      'paint': {
            'circle-radius': 8,
            'circle-color': 'rgba(55,148,179,.3)'
        }
	    })
}.bind(this))*/

}

componentWillUnmount() {
	this.map.remove()
}

componentDidUpdate() {
	this.map.resize()
}

	render() {
		return(
				<div id='map' ref='map'/>
			)
	}
}