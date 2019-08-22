import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'

//STORE CREATION

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    return createStore( combineReducers({
                        }),
                        composeEnhancers(applyMiddleware(thunk))
                        );
    
}

