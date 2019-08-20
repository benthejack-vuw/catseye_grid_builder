import React from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { startLogout } from '../actions/auth'

export const Header = ({startLogout}) => (  
    <div className='header'>
        <div className='container'>
            <header className='header__layout'>
                <NavLink className="header__home-link" to="/dashboard" activeClassName="is-active">
                    <h1>Expensify</h1>
                </NavLink>
                <button className='button button--link' onClick={startLogout}>Log Out</button>
            </header>
        </div>
    </div>
);

const mapDispatchToProps = (dispatch)=>({
    startLogout: ()=>dispatch(startLogout())
})

export default connect(undefined, mapDispatchToProps)(Header);