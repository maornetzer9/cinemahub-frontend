import { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./components/Login";
import ChangePasswordFirstLogin from "./components/ChangePasswordFirstLogin";
import RequirePasswordChange from "./components/RequirePasswordChange";
import RequireAuth from "./components/RequireAuth";
import ProtectedRoute from "./components/ProtectedRoute";

const Register = lazy(() => import("./components/Register"));
const AppShell = lazy(() => import("./components/layout/AppShell"));
const SessionTimeout = lazy(() => import("./components/SessionTimeout"));
const HomePage = lazy(() => import("./components/HomePage"));
const Movies = lazy(() => import("./components/Movies-Components/Movies"));
const Users = lazy(() => import("./components/Admin-Components/Users"));
const Subscriptions = lazy(() => import("./components/Members-Components/Subscriptions"));

const Layout = () => (
    <Suspense fallback={null}>
        <SessionTimeout>
            <AppShell>
                <Outlet />
            </AppShell>
        </SessionTimeout>
    </Suspense>
);

function App() {
    return (
        <Routes>
            <Route path="/"         element={<Login />} />
            <Route path="/register" element={<Suspense fallback={null}><Register /></Suspense>} />
            <Route path="/change-password" element={<ChangePasswordFirstLogin />} />

            <Route element={<RequireAuth />}>
                <Route element={<RequirePasswordChange />}>
                    <Route element={<Layout />}>
                        <Route path="/home"            element={<Suspense fallback={null}><HomePage /></Suspense>} />
                        <Route path="/movies"          element={<Suspense fallback={null}><Movies /></Suspense>} />
                        <Route path="/movies/:movieId" element={<Suspense fallback={null}><Movies /></Suspense>} />
                        <Route path="/subscriptions"   element={<Suspense fallback={null}><Subscriptions /></Suspense>} />

                        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                            <Route path="/users" element={<Suspense fallback={null}><Users /></Suspense>} />
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
