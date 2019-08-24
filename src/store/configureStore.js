import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'

import patternBuilder from '../reducers/PatternBuilder' 
//STORE CREATION

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    return createStore( combineReducers({
                            patternBuilder
                        }),
                        composeEnhancers(applyMiddleware(thunk))
                        );
    
}

