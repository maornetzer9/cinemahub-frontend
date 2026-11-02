import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { disconnectUserService } from "../services/users";
import { resetAppState } from "../actions/app";
import {
    SESSION_TIMEOUT_LOGOUT_KEY,
    isManualLogout,
    isSessionTimeoutCancelled,
    readStoredJson,
    readStoredUsername,
} from "../utils/sessionLogout";

/** Fire the lock slightly before JWT expiry so the token is still valid for PUT /users/disconnect */
const DISCONNECT_BUFFER_MS = 2000;

const LOCK_FAILED_MESSAGE = "Session expired, but the server did not lock this account. Please contact your administrator.";

const getJwtExpirationMs = () => {
    try {
        const token = JSON.parse(localStorage.getItem("token") || "null");
        if (!token) return 0;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp ? payload.exp * 1000 : 0;
    } catch {
        return 0;
    }
};

const getUserIdFromJwt = () => {
    try {
        const token = JSON.parse(localStorage.getItem("token") || "null");
        if (!token) return "";
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload._id ? String(payload._id) : "";
    } catch {
        return "";
    }
};

const SessionTimeout = ({ children }) => {
    const dispatch = useDispatch();
    const hasExpiredRef = useRef(false);
    const scheduledExpirationRef = useRef(0);

    const initialTimeout = useMemo(() => {
        const sessionTimeout = Number(readStoredJson("sessionTimeout", 0));
        const savedRemaining = localStorage.getItem("sessionTimeoutRemaining");
        const remaining = savedRemaining ? Number(readStoredJson("sessionTimeoutRemaining", null)) : null;
        const parsed = remaining !== null && Number.isFinite(remaining) && remaining > 0
            ? remaining
            : sessionTimeout;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }, []);

    const [timeout, setTimeoutValue] = useState(initialTimeout);
    const hasActiveTimeout = timeout > 0;

    const finalizeLocalLogout = useCallback(() => {
        sessionStorage.removeItem(SESSION_TIMEOUT_LOGOUT_KEY);
        dispatch(resetAppState());
        localStorage.clear();
        window.location.replace("/");
    }, [dispatch]);

    const handleSessionExpired = useCallback(async () => {
        if (hasExpiredRef.current || isManualLogout() || isSessionTimeoutCancelled()) return;

        const token = localStorage.getItem("token");
        const localUsername = readStoredUsername();
        if (!token || !localUsername || localUsername === "Admin") return;

        hasExpiredRef.current = true;
        sessionStorage.setItem(SESSION_TIMEOUT_LOGOUT_KEY, "1");

        const userId = getUserIdFromJwt();
        if (!userId) {
            console.error("Session timeout: missing user id, account was not locked.");
            alert(LOCK_FAILED_MESSAGE);
            finalizeLocalLogout();
            return;
        }

        const result = await disconnectUserService({ _id: userId, sessionTimeout: 0 }, dispatch);
        const locked = result?.code === 200 && Number(result?.user?.sessionTimeout) === 0;

        if (!locked) {
            console.error(
                "Session timeout: server did not persist sessionTimeout=0.",
                result?.code,
                result?.message
            );
            alert(LOCK_FAILED_MESSAGE);
        } else {
            alert("Session expired. Please log in again.");
        }

        finalizeLocalLogout();
    }, [dispatch, finalizeLocalLogout]);

    const saveSessionData = useCallback((minutes) => {
        const jwtExpMs = getJwtExpirationMs();
        const expirationTime = jwtExpMs > 0
            ? jwtExpMs
            : Date.now() + minutes * 60 * 1000;
        localStorage.setItem("sessionTimeoutRemaining", JSON.stringify(minutes));
        localStorage.setItem("sessionExpirationTime", expirationTime.toString());
        return expirationTime;
    }, []);

    useEffect(() => {
        if (!hasActiveTimeout) return;

        const jwtExpMs = getJwtExpirationMs();
        let expirationTime = parseInt(localStorage.getItem("sessionExpirationTime") || "0", 10);

        if (jwtExpMs > 0) {
            expirationTime = expirationTime > 0 ? Math.min(expirationTime, jwtExpMs) : jwtExpMs;
            localStorage.setItem("sessionExpirationTime", expirationTime.toString());
        } else if (!expirationTime || expirationTime <= Date.now()) {
            const sessionMinutes = Number(readStoredJson("sessionTimeout", 0));
            if (sessionMinutes <= 0) return;
            expirationTime = saveSessionData(sessionMinutes);
        }

        if (scheduledExpirationRef.current !== expirationTime) {
            scheduledExpirationRef.current = expirationTime;
            hasExpiredRef.current = false;
        }

        if (expirationTime <= Date.now()) {
            handleSessionExpired();
            return;
        }

        const msUntilExpiry = Math.max(expirationTime - Date.now(), 0);
        const msUntilLogout = Math.max(msUntilExpiry - DISCONNECT_BUFFER_MS, 0);

        const logoutTimer = setTimeout(() => {
            handleSessionExpired();
        }, msUntilLogout);

        const interval = setInterval(() => {
            const exp = parseInt(localStorage.getItem("sessionExpirationTime") || "0", 10);
            if (!exp) return;

            const remainingMs = exp - Date.now();
            if (remainingMs <= DISCONNECT_BUFFER_MS) {
                handleSessionExpired();
                return;
            }

            const remainingMinutes = remainingMs / (60 * 1000);
            setTimeoutValue(remainingMinutes);
            localStorage.setItem("sessionTimeoutRemaining", JSON.stringify(remainingMinutes));
        }, 1000);

        return () => {
            clearTimeout(logoutTimer);
            clearInterval(interval);
        };
    }, [hasActiveTimeout, handleSessionExpired, saveSessionData]);

    return <>{children}</>;
};

export default SessionTimeout;
