import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadingUsersAction } from "../actions/users";
import { CINEMA } from "../config/serviceUrls";
import { MENU } from "../utils/constants";
import { readStoredToken, readStoredUsername } from "../utils/sessionLogout";

const getStoredUsername = () => {
    const username = readStoredUsername();
    return username || null;
};

const getJwtSessionUser = () => {
    try {
        const token = readStoredToken();
        const username = getStoredUsername();
        if (!token || !username) return null;

        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            username,
            _id: payload._id,
            permissions: payload.permissions || [],
        };
    } catch {
        return null;
    }
};

const getSessionUser = (loggedInUser) => {
    if (loggedInUser?.username) {
        if (Array.isArray(loggedInUser.permissions) && loggedInUser.permissions.length > 0) {
            return loggedInUser;
        }
        const jwtUser = getJwtSessionUser();
        if (jwtUser && jwtUser.username === loggedInUser.username) {
            return { ...loggedInUser, _id: loggedInUser._id || jwtUser._id, permissions: jwtUser.permissions };
        }
        return loggedInUser;
    }
    return getJwtSessionUser();
};

/**
 * Custom hook for loading users and managing permissions.
 */

export const usePermissions = () => {
    const dispatch = useDispatch();
    const loggedInUser = useSelector((state) => state.userReducer.user);
    const [ authorize, setAuthorize ] = useState(null);

    const loadingUsers = useCallback(async () => {
        const username = loggedInUser?.username || getStoredUsername();

        if (username !== "Admin") {
            const sessionUser = getSessionUser(loggedInUser);
            return sessionUser ? [sessionUser] : [];
        }

        try {
            const USERS = `${CINEMA}/users/`;
            const result = await dispatch(loadingUsersAction(USERS));
            if (result?.code === 200) return result.users || [];
        } catch {
            // Admin fetch failed — fall through to empty list
        }
        return [];
    }, [dispatch, loggedInUser]);

    /**
     * Check if a user is authorized for movies or subscriptions based on their permissions.
     */
    const getUserPermissions = useCallback(async (username) => {
        const users = await loadingUsers();
        const isAdmin = username === "Admin";

        let user = users.find((user) => user.username === username);
        if (!user) {
            const sessionUser = getSessionUser(loggedInUser);
            if (sessionUser?.username === username) user = sessionUser;
        }
        if (!user && !isAdmin) 
        {
            const auth = { movies: false, subscription: false, admin: false };
            setAuthorize(auth);
            return auth;
        }

        const permissions = user?.permissions ?? [];

        const hasMoviesPermission = permissions.some((perm) =>
            ["View-Movies", "Create-Movies", "Update-Movies", "Delete-Movies"].includes(perm)
        );

        const hasSubscriptionsPermission = permissions.some((perm) =>
            ["View-Subscriptions", "Create-Subscriptions", "Update-Subscriptions", "Delete-Subscriptions"].includes(perm)
        );

        const auth = {
            movies: hasMoviesPermission || isAdmin,
            subscription: hasSubscriptionsPermission || isAdmin,
            admin: isAdmin,
        };

        setAuthorize(auth);
        return auth;
    }, [loadingUsers, loggedInUser]);

     /**
     * Check if the user is authorized to create delete or edit movie or subscriptions base on there permissions.
     */
    const getUserButtonsPermissions = useCallback(async (username) => {
        const users = await loadingUsers();
        const isAdmin = username === "Admin";

        let user = users.find((user) => user.username === username);
        if (!user) {
            const sessionUser = getSessionUser(loggedInUser);
            if (sessionUser?.username === username) user = sessionUser;
        }

        if (!user && !isAdmin) 
        {
            return {
                movies: { create: false, update: false, delete: false },
                subscriptions: { create: false, update: false, delete: false },
            };
        }

        const hasPermission = (permissions, key) => permissions.includes(key) || isAdmin;
        
        return {
            movies: {
                create: hasPermission(user?.permissions || [], 'Create-Movies'),
                update: hasPermission(user?.permissions || [], 'Update-Movies'),
                delete: hasPermission(user?.permissions || [], 'Delete-Movies'),
            },
            subscriptions: {
                create: hasPermission(user?.permissions || [], 'Create-Subscriptions'),
                update: hasPermission(user?.permissions || [], 'Update-Subscriptions'),
                delete: hasPermission(user?.permissions || [], 'Delete-Subscriptions'),
            },
        };
        
    }, [loadingUsers, loggedInUser]);
    

    /**
     * Filters the menu items based on user permissions.
     */
    const getFilteredMenu = useCallback((isAuthorize) => {
        return MENU.filter((item) => {
            if (item.label === 'Movies') return isAuthorize.movies;
            if (item.label === 'Subscriptions') return isAuthorize.subscription;
            if (item.label === 'Users Management') return isAuthorize.admin;
            return true;
        });
    }, []);

    return { 
        loadingUsers, 
        getUserPermissions, 
        getUserButtonsPermissions, 
        getFilteredMenu, 
        authorize, 
    };
};
