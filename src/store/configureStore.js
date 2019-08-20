import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'

import expensesReducer from '../reducers/expenses'
import filtersReducer from '../reducers/filters'
import authReducer from '../reducers/auth'
//STORE CREATION

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    return createStore( combineReducers({
                            expenses:expensesReducer,
                            filters:filtersReducer,
                            auth:authReducer,
                        }),
                        composeEnhancers(applyMiddleware(thunk))
                        );
    
}

