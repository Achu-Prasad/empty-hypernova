import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Optional: Check if the user is the specific admin
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (adminEmail && user.email !== adminEmail) {
        // If logged in but not the admin, maybe redirect to home or show unauthorized
        // For now, let's just log it and maybe allow (or disallow if strict)
        console.warn("User is not the designated admin:", user.email);
        // return <Navigate to="/" replace />; // Uncomment to strictly enforce email
    }

    return children;
};

export default ProtectedRoute;
