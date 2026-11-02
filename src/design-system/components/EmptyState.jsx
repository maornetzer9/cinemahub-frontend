import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { radius } from '../tokens';

export default function EmptyState({
    icon: Icon = InboxOutlinedIcon,
    title = 'Nothing here yet',
    description,
    action = null,
    compact = false,
}) {
    return (
        <Box
            sx={{
                py: compact ? 3 : 6,
                px: compact ? 2 : 3,
                textAlign: 'center',
                borderRadius: `${radius.control}px`,
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: 'rgba(255,255,255,0.02)',
            }}
        >
            {Icon && (
                <Box
                    sx={{
                        width: compact ? 40 : 48,
                        height: compact ? 40 : 48,
                        borderRadius: `${radius.control}px`,
                        mx: 'auto',
                        mb: compact ? 1.5 : 2,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: 'rgba(59,130,246,0.08)',
                        color: 'primary.main',
                    }}
                >
                    <Icon sx={{ fontSize: compact ? 20 : 24 }} />
                </Box>
            )}
            <Typography variant="body2" fontWeight={600} mb={0.25} sx={{ fontSize: compact ? '0.8125rem' : '0.9375rem' }}>
                {title}
            </Typography>
            {description && (
                <Typography variant="caption" color="text.secondary" maxWidth={360} mx="auto" display="block" mb={action ? 1.5 : 0}>
                    {description}
                </Typography>
            )}
            {action}
        </Box>
    );
}
