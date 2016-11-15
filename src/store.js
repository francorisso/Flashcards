/* global window */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import reducers from './reducers';

const devToolsExtension = window.devToolsExtension && window.devToolsExtension();

const store = createStore(
  combineReducers({
    ...reducers,
    form: formReducer,
    routing: routerReducer,
  }),
  {},
  compose(applyMiddleware(thunk), devToolsExtension)
);

export default store;
