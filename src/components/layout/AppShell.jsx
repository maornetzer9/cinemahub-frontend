import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { disconnectUserService } from '../../services/users';
import { resetAppState } from '../../actions/app';
import { getRemainingSessionMinutes, markManualLogout } from '../../utils/sessionLogout';
import { usePermissions } from '../../hooks/permissions';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import { layout, motion } from '../../design-system/tokens';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { TopBarSearchProvider } from '../../context/TopBarSearchContext';

const AppShell = ({ children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.userReducer);
    const { getUserPermissions, getFilteredMenu } = usePermissions();

    const username = user?.username || (() => {
        try {
            return JSON.parse(localStorage.getItem('username'));
        } catch {
            return null;
        }
    })();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isAuthorize, setIsAuthorize] = useState(null);
    const [isRedirected, setIsRedirected] = useState(false);

    const { collapsed, toggleCollapsed } = useSidebarCollapsed();
    const sidebarWidth = collapsed ? layout.sidebarCollapsedWidth : layout.sidebarWidth;

    const toggleMobileDrawer = useCallback(() => setMobileOpen((prev) => !prev), []);

    const disconnect = useCallback(async () => {
        markManualLogout();
        try {
            if (username === 'Admin') {
                dispatch(resetAppState());
                localStorage.clear();
                navigate('/');
            } else {
                let sessionTimeout = getRemainingSessionMinutes();
                if (sessionTimeout <= 0 && Number(user?.sessionTimeout) > 0) {
                    sessionTimeout = Math.floor(Number(user.sessionTimeout));
                }

                if (sessionTimeout > 0 && user?._id) {
                    const updatedUser = { ...user, sessionTimeout };
                    delete updatedUser.permissions;
                    await disconnectUserService(updatedUser, dispatch);
                }

                dispatch(resetAppState());
                localStorage.clear();
                navigate('/');
            }
        } catch (err) {
            console.error(err.message);
            dispatch(resetAppState());
            localStorage.clear();
            navigate('/');
        }
    }, [username, user, dispatch, navigate]);

    useEffect(() => {
        setIsAuthorize(null);
        setIsRedirected(false);
    }, [username]);

    useEffect(() => {
        if (!username) return;
        const fetchAuth = async () => {
            try {
                const auth = await getUserPermissions(username);
                setIsAuthorize(auth);
            } catch (err) {
                console.error(err.message);
                if (username === 'Admin') {
                    setIsAuthorize({ movies: true, subscription: true, admin: true });
                }
            }
        };
        fetchAuth();
    }, [getUserPermissions, username]);

    useEffect(() => {
        if (!isAuthorize || isRedirected) return;

        const currentPath = location.pathname;
        const validPages = [];
        if (isAuthorize.movies) validPages.push('/movies');
        if (isAuthorize.subscription) validPages.push('/subscriptions');
        if (isAuthorize.admin) validPages.push('/users');
        validPages.push('/home');

        if (!validPages.some((p) => currentPath.startsWith(p))) {
            const target = currentPath.startsWith('/users') || (!isAuthorize.movies && !isAuthorize.subscription)
                ? '/home'
                : isAuthorize.movies
                ? '/movies'
                : '/subscriptions';
            navigate(target);
        }
        setIsRedirected(true);
    }, [isAuthorize, isRedirected, location.pathname, navigate]);

    const filteredMenu = useMemo(
        () => (isAuthorize ? getFilteredMenu(isAuthorize) : []),
        [isAuthorize, getFilteredMenu]
    );

    const navItems = filteredMenu.filter((item) => item.label !== 'Disconnect');

    return (
        <TopBarSearchProvider>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {!isMobile && (
                <Sidebar
                    navItems={navItems}
                    collapsed={collapsed}
                    onToggleCollapsed={toggleCollapsed}
                />
            )}

            {isMobile && (
                <Sidebar
                    mobile
                    open={mobileOpen}
                    onClose={toggleMobileDrawer}
                    navItems={navItems}
                />
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    width: { md: `calc(100% - ${sidebarWidth}px)` },
                    ml: { md: `${sidebarWidth}px` },
                    display: 'flex',
                    flexDirection: 'column',
                    transition: `margin-left ${motion.normal}, width ${motion.normal}`,
                }}
            >
                <TopBar
                    username={username}
                    onMenuClick={toggleMobileDrawer}
                    onDisconnect={disconnect}
                    showMenuButton={isMobile}
                />
                <Box sx={{ flex: 1 }}>{children}</Box>
            </Box>
        </Box>
        </TopBarSearchProvider>
    );
};

export default memo(AppShell);
