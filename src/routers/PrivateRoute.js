import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../reactComponents/Header'

export const PrivateRoute = ({
    isAuthenticated,
    component:Component,
    ...rest
}) => {
    return (
        <Route 
            component={(props)=>(
                isAuthenticated ? (
                <div>
                    <Header {...props}/>
                    <Component {...props}/>
                </div>
                ) : (
                <Redirect to='/'/>
                )
            )}
            {...rest}
        />
    )
}

const mapStateToProps = (state)=>({
    isAuthenticated: !!state.auth.uid 
})

export default connect(mapStateToProps)(PrivateRoute)





