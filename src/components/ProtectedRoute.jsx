import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthGlobalContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {

    const { user } = useContext(AuthContext);
    console.log("user", user);
    // console.log("isAuthenticated", isAuthenticated);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute
