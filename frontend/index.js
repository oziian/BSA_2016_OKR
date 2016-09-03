import React from "react"
import { render } from "react-dom"
import App from "./containers/app"
import History from "./components/admin/history-page/history-page.js"
import HomePage from "./components/home-page/home-page.js"
import RolesPage from "./components/admin/role-mapping/role-mapping.js"
import ObjAccept from "./components/admin/accept-objective/accept-objective.js"
import UserPage from "./components/other-persons-page/other-persons-page.js"
import {IndexRoute, Route, Router, browserHistory} from 'react-router'
import ObjectiveView from "./components/objectiveView/objectiveView.js"
import OKRmanaging from "./components/admin/OKRmanaging/OKRmanaging.js"
import UserRecycleBin from './components/user-recycle-bin/recycle-bin.jsx'
import AdminRecycleBin from './components/admin/admin-recycle-bin/recycle-bin.jsx'
import ListOfUsers from './components/list-of-users/list-of-users.jsx'
import BarStats from './components/dashboard/barStats.jsx'
import NotFound from './components/common/notFound.jsx';


import configureStore from './store/configureStore';

import { Provider } from 'react-redux'
import logger from 'redux-logger'
import { syncHistoryWithStore } from 'react-router-redux'

import reducer from './reducers/commonReducer'

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

render(
	(<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<IndexRoute component={HomePage} />
				<Route path="users" component={ListOfUsers} />
				<Route path="user/:id" component={UserPage} />
				<Route path="history" component={History} />
				<Route path="roles" component={RolesPage} />
				<Route path="objective" component={ObjectiveView} />
				<Route path="okr-managing" component={OKRmanaging} />
				<Route path="recycle-bin" component={UserRecycleBin} />
				<Route path="admin-recycle-bin" component={AdminRecycleBin} />
				<Route path="charts" component={BarStats}/>
				<Route path="obj-accept" component={ObjAccept}/>
				<Route path="*" component={NotFound}/>
			</Route>
		</Router>
	</Provider>)
	, document.getElementById('root'));
