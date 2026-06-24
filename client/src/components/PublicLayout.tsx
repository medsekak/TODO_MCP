import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PublicLayout = () => {

    if (localStorage.getItem("auth-storage")) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PublicLayout
