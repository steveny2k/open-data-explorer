require('./app.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, hashHistory } from 'react-router'

import Dataset from './components/dataset/Dataset.jsx'
import DatasetBrowse from './components/list/DatasetBrowse.jsx'

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={DatasetBrowse}>
    	<Route path="browse" component={DatasetBrowse}/>
    	<Route path=":num" component={DatasetBrowse}/>
    </Route>
    <Route path="/:category/:title/:id" component={Dataset}>
    	<Route path=":viewType" component={Dataset}/>
    </Route>
    <Route path="*" component={Dataset}/>
  </Router>
), document.getElementById('app'))