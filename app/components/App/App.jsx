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
      <link href='https://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'/>
      <div className={'app'}>
        <Navigation pages={pages} />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
