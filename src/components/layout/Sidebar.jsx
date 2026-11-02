import {
    Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../../design-system/components/BrandLogo';
import { layout, colors, typography } from '../../design-system/tokens';
import { navItemSx, sidebarCollapseToggleSx, sidebarShellSx } from '../../design-system/styles';

const SIDEBAR_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const SIDEBAR_DURATION = '0.26s';
const sidebarWidthTransition = `width ${SIDEBAR_DURATION} ${SIDEBAR_EASE}`;
const sidebarFadeTransition = `opacity ${SIDEBAR_DURATION} ${SIDEBAR_EASE}, max-width ${SIDEBAR_DURATION} ${SIDEBAR_EASE}`;

const NAV_LABELS = {
    'Home Page': 'Dashboard',
    Movies: 'Movies',
    Subscriptions: 'Subscriptions',
    'Users Management': 'Users',
};

const labelTransitionSx = {
    opacity: 1,
    transition: sidebarFadeTransition,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
};

const hiddenLabelSx = {
    opacity: 0,
    maxWidth: 0,
    transition: sidebarFadeTransition,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
};

function NavItem({ item, active, collapsed, onNavigate }) {
    const label = NAV_LABELS[item.label] || item.label;

    const button = (
        <ListItemButton
            selected={active}
            onClick={() => onNavigate(item.path)}
            sx={{
                ...navItemSx,
                mx: collapsed ? 0.75 : 1.5,
                px: collapsed ? 1 : 1.5,
                justifyContent: collapsed ? 'center' : 'flex-start',
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: collapsed ? 0 : 32,
                    justifyContent: 'center',
                    color: active ? 'primary.main' : 'text.secondary',
                }}
            >
                <item.icon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
                primary={label}
                sx={collapsed ? hiddenLabelSx : labelTransitionSx}
                primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    fontSize: '0.875rem',
                    color: active ? 'text.primary' : 'text.secondary',
                }}
            />
        </ListItemButton>
    );

    return (
        <Tooltip
            title={label}
            placement="right"
            arrow
            disableHoverListener={!collapsed}
            disableFocusListener={!collapsed}
        >
            {button}
        </Tooltip>
    );
}

export default function Sidebar({
    navItems,
    mobile = false,
    open,
    onClose,
    collapsed = false,
    onToggleCollapsed,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const isExpanded = mobile || !collapsed;
    const sidebarWidth = isExpanded ? layout.sidebarWidth : layout.sidebarCollapsedWidth;

    const isActive = (path) => path !== '/' && location.pathname.startsWith(path);

    const handleNavigate = (path) => {
        navigate(path);
        onClose?.();
    };

    const content = (
        <Box
            sx={{
                ...sidebarShellSx,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isExpanded ? 'space-between' : 'center',
                    px: isExpanded ? 2 : 1.25,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: colors.borderSubtle,
                }}
            >
                <BrandLogo
                    size={isExpanded ? 'md' : 'sm'}
                    showText={isExpanded}
                    onClick={() => handleNavigate('/home')}
                />
                {!mobile && onToggleCollapsed && (
                    <IconButton
                        onClick={onToggleCollapsed}
                        size="small"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        sx={sidebarCollapseToggleSx(collapsed)}
                    >
                        {collapsed ? (
                            <ChevronRightIcon sx={{ fontSize: 16 }} />
                        ) : (
                            <ChevronLeftIcon sx={{ fontSize: 18 }} />
                        )}
                    </IconButton>
                )}
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <Typography
                    sx={{
                        ...typography.caption,
                        color: 'text.disabled',
                        px: 2.5,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        opacity: isExpanded ? 1 : 0,
                        maxHeight: isExpanded ? 48 : 0,
                        pt: isExpanded ? 1.75 : 0,
                        pb: isExpanded ? 0.75 : 0,
                        pointerEvents: isExpanded ? 'auto' : 'none',
                        transition: `opacity ${SIDEBAR_DURATION} ${SIDEBAR_EASE}, max-height ${SIDEBAR_DURATION} ${SIDEBAR_EASE}, padding ${SIDEBAR_DURATION} ${SIDEBAR_EASE}`,
                    }}
                >
                    NAVIGATION
                </Typography>

            <List sx={{ flexGrow: 1, py: 0 }}>
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <ListItem disablePadding key={item.id}>
                            <NavItem
                                item={item}
                                active={active}
                                collapsed={!isExpanded}
                                onNavigate={handleNavigate}
                            />
                        </ListItem>
                    );
                })}
            </List>
            </Box>
        </Box>
    );

    if (mobile) {
        return (
            <Drawer anchor="left" open={open} onClose={onClose} ModalProps={{ keepMounted: true }}>
                {content}
            </Drawer>
        );
    }

    return (
        <Box
            component="nav"
            sx={{
                ...sidebarShellSx,
                width: sidebarWidth,
                flexShrink: 0,
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: (t) => t.zIndex.drawer,
                transition: sidebarWidthTransition,
                willChange: 'width',
                overflow: 'visible',
            }}
        >
            {content}
        </Box>
    );
}
