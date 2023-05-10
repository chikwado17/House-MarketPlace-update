import React from 'react';
//Outlet that helps to render child element in react router dom
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {

    //destructuring the useAuthStatus State values
    const { loggedIn, loading } = useAuthStatus();

    if(loading) {
        return <Spinner />
    }

    return (
        <>
            {loggedIn ? <Outlet/ > : <Navigate to='/sign-in'/> }
        </>
    )
}

export default PrivateRoute