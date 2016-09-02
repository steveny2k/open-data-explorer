import React from 'react'
import Navigation from '../Navigation/Navigation'
import Footer from '../Footer/Footer'

const pages = [
  {
    route: '',
    title: 'Home'
  },
  {
    route: 'catalog',
    title: 'Data Catalog'
  }]

export default class App extends React.Component {
  render () {
    return (
      <div className={'app'}>
        <a href="/about#our-process" title="Read more about what we mean by beta">beta</a>
        <Navigation pages={pages} />
          {this.props.children}
        <Footer />
      </div>
    )
  }
}
