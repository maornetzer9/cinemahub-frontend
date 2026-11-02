import { Navigate, Outlet, useLocation } from "react-router-dom";
import { readStoredBoolean, readStoredToken } from "../utils/sessionLogout";

export default function RequirePasswordChange() {
    const location = useLocation();
    const token = readStoredToken();
    const mustChangePassword = readStoredBoolean("mustChangePassword");

    if (!token) return <Navigate to="/" replace />;
    if (!mustChangePassword) return <Outlet />;
    if (location.pathname === "/change-password") return <Outlet />;

    return <Navigate to="/change-password" replace />;
}
