import React from 'react';
import { Link } from 'react-router-dom'

export const Header = ({startLogout}) => (  
    <div className='header'>
        <div className='container'>
            <header className='header__layout'>
                <Link className="header__home-link" to="/">
                    <h1>Catseye</h1>
                </Link>
                
                <Link className="header__help-link" to="/help">
                    <h2>Help</h2>
                </Link>
            </header>
        </div>
    </div>
);



export default Header;