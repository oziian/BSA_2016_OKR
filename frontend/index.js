import React from "react"
import { render } from "react-dom"
import App from "./containers/app"
import LoginPage from "./components/login-page.js"
import HomePage from "./components/home-page.js"
import UserPage from "./components/other-persons-page/other-persons-page.js"
import "normalize.css";
import "./components/global.scss";
import {IndexRoute, Route, Router, browserHistory} from 'react-router';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import reducer from './reducers/commonReducer'

const middleware = [ thunk ]

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

render(
    (<Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
           <IndexRoute component={LoginPage} />
        </Route>

        <Route path="/home" component={App}>
           <IndexRoute component={HomePage} />
        </Route>

        <Route path="/users" component={App}>
           <IndexRoute component={UserPage} />
        </Route>
      </Router>
    </Provider>)
    , document.getElementById('root')
)
