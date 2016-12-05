require('./_Catalog.scss')

import React from 'react'
import { hashHistory } from 'react-router'
import { Grid, Row, Col, Pagination } from 'react-bootstrap'
import search from 'algoliasearch'
import searchHelper from 'algoliasearch-helper'

import CatalogSearchBar from './CatalogSearchBar'
import CatalogItem from './CatalogItem'
import CatalogFacets from './CatalogFacets'

const client = search('N6IVMSP2S4', '3bd0fc517f80911bf21045747262a1bd')
const helper = searchHelper(
  client,
  'dev_dataset_search', {
    facets: ['publishing_dept'],
    disjunctiveFacets: ['category']
  }
)

const facetIndex = {
  'categories': 'category',
  'departments': 'publishing_dept'
}

export default class CatalogBrowse extends React.Component {
  constructor () {
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

  handleSelect (page) {
    this.setState({
      activePage: page
    })
    helper.setPage(page - 1).search()
    hashHistory.push('/catalog/' + page)
  }

  _updateResults (content) {
    var facets = {}
    facets.departments = content.getFacetValues('publishing_dept')
    facets.categories = content.getFacetValues('category')
    if (content.query === '') {
      this.setState({
        catalogSize: content.nbHits
      })
    }
    this.setState({
      results: content.hits,
      facets: facets,
      nbHits: content.nbHits,
      pages: content.nbPages})
  }

  handleFacetSelections (sel, facet, ev) {
    let refine = this.state.refinements
    if (ev.target.type === 'checkbox') {
      if (ev.target.checked) {
        refine[facet].push(sel)
        helper.addDisjunctiveFacetRefinement(facetIndex[facet], sel)
      } else {
        refine[facet].splice(refine[facet].indexOf(sel), 1)
        helper.removeDisjunctiveFacetRefinement(facetIndex[facet], sel)
      }
    }

    if (ev.target.type === 'radio') {
      if (refine[facet].indexOf(sel) > -1) {
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

  componentDidMount () {
    let updateResults = this._updateResults

    if (this.props.params.page) {
      this.setState({
        activePage: parseInt(this.props.params.page)
      })
    }

    helper.on('result', function (content) {
      updateResults(content)
    })

    helper.on('error', function (err) {
      console.error(err)
    })

    let { searchTerm } = this.props

    helper.setQuery(searchTerm)
      .search()
  }

  componentWillUnmount () {
    helper.removeAllListeners('result')
    helper.removeAllListeners('error')
  }

  render () {
    let {facets, catalogSize, nbHits} = this.state
    let listItems = []
    let showingMsg = ''
    if (this.state.results.length > 0) {
      listItems = this.state.results.map(function (dataset, i) {
        return (<CatalogItem key={i} dataset={dataset} />)
      })
    }

    if (catalogSize) {
      showingMsg = 'Returned ' + nbHits + ' results of ' + catalogSize + ' possible'
    }

    return (
      <Grid fluid id='main-container' className={'catalogMain'}>
        <Row className={'catalogMainFacets'}>
          <Col sm={3}>
            <CatalogFacets facets={facets} handleCategorySelect={this.handleFacetSelections} />
          </Col>
          <Col sm={9}>
            <CatalogSearchBar helper={helper} handleSearch={this.handleSearch} searchTerm={this.props.searchTerm} />
            <div className={'CatalogShowingMsg'} style={{float: 'left'}}>
              {showingMsg}
            </div>
            <div style={{float: 'right'}}>
              <Pagination
                bsSize='small'
                items={this.state.pages}
                activePage={this.state.activePage}
                onSelect={this.handleSelect} />
            </div>
            {listItems}
            <div style={{float: 'right'}}>
              <Pagination
                bsSize='small'
                items={this.state.pages}
                activePage={this.state.activePage}
                onSelect={this.handleSelect} />
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
