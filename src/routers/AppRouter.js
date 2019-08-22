import React from 'react'
import {Router, Route, Switch} from 'react-router-dom'
import { createBrowserHistory } from 'history'

import GridBuilderPage from '../reactComponents/GridBuilderPage'
import Header from '../reactComponents/Header'
import LandingPage from '../reactComponents/LandingPage'
import NotFoundPage from '../reactComponents/NotFoundPage'
import PatternBuilderPage from '../reactComponents/PatternBuilderPage'

export const history = createBrowserHistory();

const AppRouter = () => (
    <div>
        <Router history={history}>
            <Header/>
            <Switch>
                <Route exact={true} path="/" component= {LandingPage}/>
                <Route path="/pattern-builder" component= { PatternBuilderPage }/>
                <Route path="/grid-builder" component= { GridBuilderPage }/>
                <Route component={NotFoundPage}/>
            </Switch>
        </Router>
    </div>
);
 
export default AppRouter;
