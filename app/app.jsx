import './favicon.ico'
import './index.html'
import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'



var airbrakeJs = require('airbrake-js')
window.airbrake = new airbrakeJs({projectId: 129534, projectKey: '9a82934389a163571bd7dd056cbfec5d'})

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




const store = configureStore(initialState)
const history = syncHistoryWithStore(hashHistory, store)
render(
  <Root store={store} history={history} />,
  document.getElementById('app')
)
