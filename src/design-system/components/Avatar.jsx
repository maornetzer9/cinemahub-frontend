import { Avatar as MuiAvatar } from '@mui/material';

const PALETTE = ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function hashString(str = '') {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
}

function getInitials(name = '', username = '') {
    const source = name?.trim() || username?.trim() || '?';
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return source.slice(0, 2).toUpperCase();
}

export default function Avatar({ name, username, size = 40, sx = {} }) {
    const label = name || username || '?';
    const initials = getInitials(name, username);
    const bgcolor = PALETTE[hashString(label) % PALETTE.length];

    return (
        <MuiAvatar
            sx={{
                width: size,
                height: size,
                fontSize: size * 0.36,
                fontWeight: 700,
                bgcolor,
                color: '#fff',
                ...sx,
            }}
        >
            {initials}
        </MuiAvatar>
    );
}
