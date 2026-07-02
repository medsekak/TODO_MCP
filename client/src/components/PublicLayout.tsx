import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PublicLayout = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PublicLayout
