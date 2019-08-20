import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'; 
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import { firebase } from './firebase/firebase';
import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';
import './styles/styles.scss';


const store = configureStore();

const jsx = (
    <Provider store={store}>
        <AppRouter/>
    </Provider>
)

ReactDOM.render(<p>loading...</p>, document.getElementById('root'));
renderApp();


let hasRendered = false;
const renderApp = ()=>{
    if(!hasRendered){
        ReactDOM.render(jsx, document.getElementById('root'));
        hasRendered = true;
    }
}


firebase.auth().onAuthStateChanged((user)=>{
    if(user){
    }else{
    }
})