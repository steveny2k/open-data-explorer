import React from 'react'

import { Route, IndexRoute } from 'react-router'

import App from './containers/App'
import HomePage from './components/HomePage/HomePage'
import Catalog from './components/Catalog/Catalog'
import Dataset from './containers/Dataset'
import DatasetOverview from './containers/DatasetOverview'
import DatasetDetails from './containers/DatasetDetails'
import Charts from './containers/Charts'

export default (
  <Route component={App} path='/'>
    <IndexRoute component={HomePage} />
    <Route component={Catalog} path='catalog' />
    <Route path='/:category/:title/:id' components={Dataset}>
      <IndexRoute component={DatasetOverview} />
      <Route path='overview' component={DatasetOverview} />
      <Route path='details' component={DatasetDetails} />
      <Route path='charts' component={Charts} />
      <Route path='map' component={Dataset} />
      <Route path='table' component={Dataset} />
    </Route>
  </Route>
)
