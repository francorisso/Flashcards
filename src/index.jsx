/* global document */
import React from 'react';
import { render } from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import store from './store';
import App from './components/App';
import Vocabulary from './components/Vocabulary';

const history = syncHistoryWithStore(browserHistory, store);

const reactElement = document.getElementById('app');
render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Vocabulary} />
      </Route>
    </Router>
  </Provider>,
  reactElement
);
