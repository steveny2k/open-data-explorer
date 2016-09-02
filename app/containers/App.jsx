import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Navigation from '../components/Navigation/Navigation'
import Footer from '../components/Footer/Footer'

const pages = [
  {
    route: 'about',
    title: 'About'
  },
  {
    route: 'catalog',
    title: 'Data Catalog'
  }]

class App extends Component {
  render () {
    const { children } = this.props
    return (
      <div>
        <Navigation pages={pages} />
        <div className={'content-wrapper'}>
          {children}
        </div>
        <Footer />
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node
}

export default connect()(App)
