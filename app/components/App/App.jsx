import React from 'react'
import Navigation from '../Navigation/Navigation'
import Footer from '../Footer/Footer'

const pages = [
  {
    route: 'aboutpage',
    title: 'AboutPage'
  },
  {
    route: 'catalog',
    title: 'Data Catalog'
  }]

export default class App extends React.Component {
  render () {
    return (
      <div className={'app'}>
        <Navigation pages={pages} />
        <div className={'content-wrapper'}>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
