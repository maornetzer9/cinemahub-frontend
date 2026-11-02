import { Box, Chip, Tooltip, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { PERMISSIONS } from '../../utils/constants';

const ACTION_META = {
    View: { icon: VisibilityOutlinedIcon },
    Create: { icon: AddCircleOutlineOutlinedIcon },
    Update: { icon: EditOutlinedIcon },
    Delete: { icon: DeleteOutlineOutlinedIcon },
};

const GROUPS = [
    { key: 'Movies', title: 'Movies', icon: MovieFilterOutlinedIcon, suffix: 'Movies' },
    { key: 'Subscriptions', title: 'Subs', icon: SubscriptionsOutlinedIcon, suffix: 'Subscriptions' },
];

function groupPermissions(permissions = []) {
    return GROUPS.map((group) => ({
        ...group,
        items: PERMISSIONS.filter((p) => p.endsWith(`-${group.suffix}`)).map((permission) => {
            const [action] = permission.split('-');
            return { permission, action, granted: permissions.includes(permission), ...ACTION_META[action] };
        }),
    }));
}

export default function PermissionBadgeGroup({ permissions = [], compact = false }) {
    const groups = groupPermissions(permissions);

    if (!permissions.length) {
        return <Typography variant="caption" color="text.disabled">No permissions</Typography>;
    }

    if (compact) {
        return (
            <Box display="flex" flexWrap="wrap" gap={0.75}>
                {groups.map((group) => {
                    const GroupIcon = group.icon;
                    const granted = group.items.filter((item) => item.granted);
                    if (!granted.length) return null;
                    return (
                        <Tooltip key={group.key} title={granted.map((g) => g.permission).join(', ')}>
                            <Chip
                                size="small"
                                icon={<GroupIcon sx={{ fontSize: '14px !important' }} />}
                                label={`${group.title} (${granted.length})`}
                                variant="outlined"
                                sx={{ height: 26, fontSize: '0.72rem', borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.02)' }}
                            />
                        </Tooltip>
                    );
                })}
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" gap={1}>
            {groups.map((group) => {
                const GroupIcon = group.icon;
                const grantedCount = group.items.filter((item) => item.granted).length;
                if (!grantedCount) return null;
                return (
                    <Box key={group.key}>
                        <Box display="flex" alignItems="center" gap={0.75} mb={0.5}>
                            <GroupIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{group.title}</Typography>
                        </Box>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {group.items.map((item) => {
                                if (!item.granted) return null;
                                const ActionIcon = item.icon;
                                return (
                                    <Tooltip key={item.permission} title={item.permission}>
                                        <Chip
                                            size="small"
                                            icon={<ActionIcon sx={{ fontSize: '14px !important' }} />}
                                            label={item.action}
                                            sx={{
                                                height: 24,
                                                fontSize: '0.68rem',
                                                bgcolor: 'rgba(59,130,246,0.1)',
                                                border: '1px solid',
                                                borderColor: 'rgba(59,130,246,0.25)',
                                                color: 'primary.main',
                                            }}
                                        />
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
