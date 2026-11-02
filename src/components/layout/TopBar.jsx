import { useState } from 'react';
import {
    Badge, Box, Button, Divider, IconButton, Menu, MenuItem, Tooltip, Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import Avatar from '../../design-system/components/Avatar';
import SearchInput from '../../design-system/components/SearchInput';
import ModalLayout from '../../design-system/components/ModalLayout';
import { useTopBarSearch } from '../../context/useTopBarSearch';
import { layout, colors, radius } from '../../design-system/tokens';
import { pageContainerSx, topBarSx } from '../../design-system/styles';

function getRoleLabel(username) {
    if (username === 'Admin') return 'System Administrator';
    return 'Team Member';
}

const topBarIconButtonSx = {
    color: 'text.secondary',
    border: '1px solid',
    borderColor: colors.borderSubtle,
    borderRadius: `${radius.control}px`,
    width: 36,
    height: 36,
    transition: 'all 0.2s ease',
    '&:hover': { bgcolor: colors.surfaceHover, color: 'text.primary' },
};

// The notifications dialog stays in this file. It is hidden until a real notification feed exists.
const notificationsEnabled = false;

export default function TopBar({ username, onMenuClick, onDisconnect, showMenuButton }) {
    const { search, setSearch, searchVisible, placeholder } = useTopBarSearch();
    const [userAnchor, setUserAnchor] = useState(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const closeNotifications = () => setNotificationsOpen(false);

    return (
        <Box component="header" sx={topBarSx}>
            <Box
                sx={{
                    ...pageContainerSx,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: layout.topBarHeight,
                    gap: 2,
                }}
            >
                {showMenuButton && (
                    <IconButton
                        onClick={onMenuClick}
                        aria-label="Open navigation"
                        sx={{ ...topBarIconButtonSx, flexShrink: 0 }}
                    >
                        <MenuIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                )}

                {searchVisible && (
                    <Box
                        sx={{
                            flex: { xs: '1 1 0px', sm: '0 1 auto' },
                            width: { xs: 'auto', sm: 320, md: 380 },
                            maxWidth: '100%',
                            minWidth: 0,
                        }}
                    >
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder={placeholder}
                            size="small"
                            sx={{ minWidth: { xs: 0, sm: 240 } }}
                        />
                    </Box>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        ml: 'auto',
                        flexShrink: 0,
                    }}
                >
                    {notificationsEnabled && (
                    <Tooltip title="Notifications">
                        <IconButton
                            size="small"
                            sx={topBarIconButtonSx}
                            aria-label="Notifications"
                            onClick={() => setNotificationsOpen(true)}
                        >
                            <Badge variant="dot" color="error" overlap="circular">
                                <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    )}

                    {notificationsEnabled && (
                    <ModalLayout
                        open={notificationsOpen}
                        onClose={closeNotifications}
                        title="Notifications coming soon"
                        subtitle="Real-time alerts and activity updates will be available in a future version."
                        maxWidth="xs"
                        footer={
                            <Button variant="contained" color="primary" fullWidth onClick={closeNotifications}>
                                Got it
                            </Button>
                        }
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                            <Box sx={{ position: 'relative', width: 96, height: 96, display: 'grid', placeItems: 'center' }}>
                                <Box
                                    component={motion.div}
                                    animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '50%',
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                    }}
                                />
                                <Box
                                    component={motion.div}
                                    animate={{ scale: [1, 1.2], opacity: [0.25, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                                    sx={{
                                        position: 'absolute',
                                        inset: 8,
                                        borderRadius: '50%',
                                        border: '1px solid',
                                        borderColor: 'primary.light',
                                    }}
                                />
                                <Box
                                    component={motion.div}
                                    initial={{ scale: 0.85, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                                    sx={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: `${radius.control}px`,
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: colors.primaryMuted,
                                        border: '1px solid',
                                        borderColor: 'rgba(59,130,246,0.35)',
                                        boxShadow: '0 0 32px rgba(59,130,246,0.2)',
                                    }}
                                >
                                    <Box
                                        component={motion.div}
                                        animate={{ rotate: [0, -14, 14, -10, 10, 0] }}
                                        transition={{ duration: 0.9, delay: 0.15, ease: 'easeInOut' }}
                                    >
                                        <NotificationsNoneOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </ModalLayout>
                    )}

                    {username && (
                        <>
                            <Box
                                onClick={(e) => setUserAnchor(e.currentTarget)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: `${radius.control}px`,
                                    border: '1px solid',
                                    borderColor: colors.borderSubtle,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: colors.surfaceHover, borderColor: colors.border },
                                }}
                            >
                                <Avatar name={username} username={username} size={28} />
                                <Box display={{ xs: 'none', md: 'block' }} minWidth={0}>
                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '0.8125rem', lineHeight: 1.2 }}>
                                        {username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ fontSize: '0.6875rem' }}>
                                        {getRoleLabel(username)}
                                    </Typography>
                                </Box>
                                <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary', display: { xs: 'none', md: 'block' } }} />
                            </Box>

                            <Menu
                                anchorEl={userAnchor}
                                open={Boolean(userAnchor)}
                                onClose={() => setUserAnchor(null)}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 200,
                                        borderRadius: `${radius.input}px`,
                                        border: '1px solid',
                                        borderColor: colors.borderSubtle,
                                    },
                                }}
                            >
                                <Box px={2} py={1.5}>
                                    <Typography variant="body2" fontWeight={600}>{username}</Typography>
                                    <Typography variant="caption" color="text.secondary">{getRoleLabel(username)}</Typography>
                                </Box>
                                <Divider />
                                <MenuItem
                                    onClick={() => { setUserAnchor(null); onDisconnect(); }}
                                    sx={{ color: 'error.main', gap: 1, py: 1.25 }}
                                >
                                    <LogoutIcon fontSize="small" />
                                    Disconnect
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
