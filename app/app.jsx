import './favicon.ico'
import './index.html'
import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'
var airbrakeJs = require('airbrake-js')
/*ignore jslint start*/
window.airbrake = new airbrakeJs({projectId: 129534, projectKey: '9a82934389a163571bd7dd056cbfec5d'})  // eslint-disable-line
const initialState = {
  dataset: {
    query: {
      dateBy: 'year'
    },
    table: {
      tablePage: 0
    }
  }
}
var airbrakeJs = require('airbrake-js')
window.airbrake = new airbrakeJs({projectId: 129600, projectKey: 'b8fe4ddb8be71382afa569e93c9b0d87'}) // eslint-disable-line
const store = configureStore(initialState)
const history = syncHistoryWithStore(hashHistory, store)
render(
  <Root store={store} history={history} />,
  document.getElementById('app')
)
