import React from "react"
import { render } from "react-dom"
import App from "./containers/app"
import LoginPage from "./components/login-page.js"
import History from "./components/history-page/history-page.js"
import {IndexRoute, Route, Router, browserHistory} from 'react-router';
import RecycleBin from './components/RecycleBin/RecycleBin.js';

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

			<Route path="history" component={History}/>
		  	<Route path="recycle-bin" component={RecycleBin}/>

        </Route>
      </Router>
    </Provider>)
    , document.getElementById('root')
)
