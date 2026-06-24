import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
  
    if (!localStorage.getItem("auth-storage")) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
}

export default ProtectRoute
