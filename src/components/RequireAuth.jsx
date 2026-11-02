import { Navigate, Outlet } from "react-router-dom";
import { readStoredToken } from "../utils/sessionLogout";

export default function RequireAuth() {
    const token = readStoredToken();

    if (!token) return <Navigate to="/" replace />;

    return <Outlet />;
}
