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
        <Link to={page.route}>
          {page.title}
        </Link>
      </li>
    )
  }

  render () {
    return (
      <nav id={'Navigation'} className={'myNav'}>
        <div className={'navbar navbar-default navbar-fixed-top'} role='navigation'>
          <div className={'container navTotal'}>
            <div className={'navbar-header'}>
              <button type='button' className={'navbar-toggle'} data-toggle='collapse' data-target='.navbar-collapse'>
                <span className={'sr-only'}>Toggle navigation</span>
                <span className={'icon-bar'}></span>
                <span className={'icon-bar'}></span>
                <span className={'icon-bar'}></span>
              </button>
              <a className={'navbar-brand'} href='#'> <img src='https://lh3.googleusercontent.com/lfLEPeGqOCpXHk57yldP5oQ-3MUug9djPzVJYVZYY_AX7vIQ2alRW2aWamZ3IP7-pg=w170' alt='logo' height='60' width='60'></img></a>
              <a className={'navbar-brand navLogo'} href='#'>DataSF // Explorer</a>
            </div>
            <div className={'navbar-collapse collapse'}>
              <ul className={'nav navbar-nav navbar-right navLi'}>
                {this.props.pages.map(
                    this.renderNavItem.bind(this)
                )}
                <li><a href='#'>Help</a></li>
                <li><a href='#'>Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

