import './_Navigation.scss'

import React from 'react'
import { Link } from 'react-router'

export default class Navigation extends React.Component {
  constructor () {
    super()

    this.state = {}
  }

  renderNavItem (page, index) {
    return (
    <li key={'page-' + index}>
      <Link to={page.route} activeStyle={{color: 'red'}}>
      {page.title}
      </Link>
    </li>
    )
  }

  render () {
    return (
    <ul className={'navigation'}>
      {this.props.pages.map(
         this.renderNavItem.bind(this)
       )}
    </ul>
    )
  }
}
