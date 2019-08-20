import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../reactComponents/Header'

export const PublicRoute = ({
    isAuthenticated,
    component:Component,
    ...rest
}) => {
    return (
        <Route 
            component={(props)=>(
                isAuthenticated ? (
                    <Redirect to='/dashboard'/>
                ) : (
                    <Component {...props}/>
                )
            )}
            {...rest}
        />
    )
}

const mapStateToProps = (state)=>({
    isAuthenticated: !!state.auth.uid 
})

export default connect(mapStateToProps)(PublicRoute)





