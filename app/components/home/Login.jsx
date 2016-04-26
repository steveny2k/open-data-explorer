require('./oauth.min.js')

import React from 'react'
import { Button } from 'react-bootstrap'

OAuth.initialize('Hf0eMOnLYiBOOn5neRQoX9tRVOE')

export default class Login extends React.Component {
  constructor () {
    super()
    this.state = {
      logged_in: false
    }

    this.login = this.login.bind(this)
  }

  login (e) {
    OAuth.popup('socrata', { cache: true })
      .done(function (result) {
        console.log(result)
        this.setState({
          logged_in: true
        })
      }.bind(this))
  }

  logout (e) {
    OAuth.clearCache()
  }

  render () {
    return (<div>
        <Button onClick={this.login}>Login</Button>
        <Button onClick={this.logout}>Logout</Button>
      </div>)
  }
}
