import './favicon.ico'
import './index.html'

import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import { Map } from 'immutable'

const initialState = Map({
  dataset: {
    query: {
      dateBy: 'year'
    },
    table: {
      tablePage: 0
    }
  }
})
const store = configureStore(initialState)
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState (state) {
    return state.get('routing').toJS()
  }
})

render(
  <Root store={store} history={history} />,
  document.getElementById('app')
)
