import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectRoute = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
}

export default ProtectRoute
