import React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import { createBrowserHistory } from 'history'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import LoginPage from '../reactComponents/pages/LoginPage'
import NotFoundPage from '../reactComponents/pages/NotFoundPage'


export const history = createBrowserHistory();

const AppRouter = () => (
    <div>
        <Router history={history}>
            <Switch>
                <PublicRoute exact={true} path="/" component={LoginPage}/>
                <Route component={NotFoundPage}/>
            </Switch>
        </Router>
    </div>
);
 
export default AppRouter;
