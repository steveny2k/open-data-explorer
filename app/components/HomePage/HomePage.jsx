import './_HomePage.scss'

import React, { Component } from 'react'
import { hashHistory } from 'react-router'

class HomePage extends Component {

  constructor (props) {
    super(props)
    // temporary state with component, this will graduate later after we refactor search altogether
    this.state = {
      text: ''
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  handleSearch (e) {
    e.preventDefault()
    let text = this.state.text.trim()

    if (!text) {
      return
    }

    hashHistory.push('/catalog/?search=' + text)
  }

  handleTextChange (e) {
    console.log(e.target.value)
    this.setState({text: e.target.value})
  }

  render () {
    return (
      <div id='main-container' className={'homePageMain container-fluid'}>
        <section id='jumbo-search' className={'jumbotron jumbotron-default homepage'}>
          <div className={'container'}>
            <h1>Find the data you need</h1>
            <p>Search hundreds of datasets from the City and County of San Francisco. Or browse on the <a href='#/catalog' className={'ext-sf-opendata'}>data catalog</a></p>
            <div className={'row'}>
              <div className={'col-md-12'}>
                <form action='#' role='form' className={'form-inline'} onSubmit={this.handleSearch} >
                  <input id='homepageSearch' className={'search-input form-control input-mysize'} type='text' name='search' placeholder='Search for things like Crime, 311 cases, lobbyists, etc.' autoComplete={'off'} onChange={this.handleTextChange} />
                  <button className={'btn btn-default btnSearch'} type='submit'><i className={'glyphicon glyphicon-search'} /></button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default HomePage
