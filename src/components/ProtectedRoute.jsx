import { Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { readStoredToken, readStoredUsername } from '../utils/sessionLogout';

const ProtectedRoute = ({ allowedRoles }) => {
    const token    = readStoredToken();
    const username = readStoredUsername();

    if (!token) return <Navigate to="/" replace />;

    if (!allowedRoles.includes(username)) return <Navigate to="/home" replace />;

    return (
        <AnimatePresence mode="wait">
            <Outlet />
        </AnimatePresence>
    );
};

export default ProtectedRoute;
