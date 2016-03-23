require('./browse.scss')

import React from 'react'
import { hashHistory } from 'react-router'
import {Grid, Row, Col, Pagination} from 'react-bootstrap'
import request from 'superagent'
import search from 'algoliasearch'
import searchHelper from 'algoliasearch-helper'

import DatasetSearchBar from './DatasetSearchBar.jsx'
import DatasetItem from './DatasetItem.jsx'
import DatasetFacets from './DatasetFacets.jsx'

const client = search('N6IVMSP2S4', '3bd0fc517f80911bf21045747262a1bd')
const helper = searchHelper(
	client,
	'dev_dataset_search', {
		facets: ['publishing_dept'],
		disjunctiveFacets: ['category']
	}
)

const facetIndex = {
	'categories' : 'category',
	'departments' : 'publishing_dept'
}

export default class DatasetBrowse extends React.Component {
	constructor() {
		super()

		this.state = {
			results: [],
			limit: 20,
			domain: 'data.sfgov.org',
			pages: 1,
			activePage: 1,
			facets: {
				categories: [],
				departments: []
			},
			refinements: {
				categories: [],
				departments: []
			}

		}

		this.handleSelect = this.handleSelect.bind(this)
		this.handleFacetSelections = this.handleFacetSelections.bind(this)

		this._updateResults = this._updateResults.bind(this)

	}

	handleSelect(event, selectedEvent) {
		var newPage = selectedEvent.eventKey
		this.setState({
      activePage: newPage
    })
    helper.setPage(newPage - 1).search()
    hashHistory.push('/'+ newPage)
	}

	_updateResults(content) {
		console.log(content)
		var facets = {}
		facets.departments = content.getFacetValues('publishing_dept')
		facets.categories = content.getFacetValues('category')
		console.log(facets.departments)
		this.setState({
			results: content.hits, 
			facets: facets, 
			pages: content.nbPages})
	}

	handleFacetSelections(sel, facet, ev) {
		let refine = this.state.refinements
		if(ev.target.type == 'checkbox') {
			if(ev.target.checked) {
				refine[facet].push(sel)
				helper.addDisjunctiveFacetRefinement(facetIndex[facet], sel)
			} else {
				refine[facet].splice(refine[facet].indexOf(sel),1)
				helper.removeDisjunctiveFacetRefinement(facetIndex[facet], sel)
			}
		}

		if(ev.target.type == 'radio') {
			if(refine[facet].indexOf(sel) > -1) {
				refine[facet] = []
				helper.removeFacetRefinement(facetIndex[facet], sel)
			} else {
				refine[facet] = [sel]
				helper.addFacetRefinement(facetIndex[facet], sel)
			}
		}
		
		this.setState({
			activePage: 1
		}, helper.search())
		hashHistory.push('/')
	}

	componentDidMount() {
		let updateResults = this._updateResults

		helper.on('result', function(content) {
  		updateResults(content)
		})

		helper.on('error', function(err) {
		  console.error(err);
		})

		helper.setQuery('')
			.search()
	}

	componentWillUnmount() {
		helper.removeAllListeners('result')
		helper.removeAllListeners('error');
	}

	render() {
		let {facets, ...state} = this.state
		var listItems = this.state.results.map(function(dataset, i){
				return(<DatasetItem key={i} dataset={dataset}/>)
		})

		return(
			<Grid fluid id="main-container">
				<Row>
					<Col sm={3}>
						<DatasetFacets facets={facets} handleCategorySelect={this.handleFacetSelections}/>
					</Col>
					<Col sm={9}>
						<DatasetSearchBar helper={helper} handleSearch={this.handleSearch}/>
						{listItems}
						<Pagination
		          bsSize="medium"
		          items={this.state.pages}
		          activePage={this.state.activePage}
		          onSelect={this.handleSelect} />
					</Col>
				</Row>
			</Grid>
			)
	}
}